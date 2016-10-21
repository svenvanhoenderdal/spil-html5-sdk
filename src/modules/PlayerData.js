var ErrorCodes = require("../core_modules/ErrorCodes"),
    EventUtil = require("./EventUtil"),
    UserProfile = require("../models/playerData/UserProfile"),
    UpdatedData = require("../models/playerData/UpdatedData"),
    Wallet = require("../models/playerData/Wallet"),
    Inventory = require("../models/playerData/Inventory"),
    PlayerItem = require("../models/playerData/PlayerItem"),
    PreloadQueue = require("../core_modules/PreloadQueue");

var userProfile,
    lastStoredReason = "",
    timeoutObject = false,
    timeoutObjectTaskKey,
    lastUpdatedData,
    playerDataCallbacks = {
        playerDataError: function (error) {},
        playerDataAvailable: function () {},
        playerDataUpdated: function (reason, updatedData) {}
    };

function getUserProfile() {
    if (userProfile) {
        return userProfile;
    }
    userProfile = new UserProfile(defaultPlayerData);
    return userProfile;
}

function processPlayerData(wallet, inventory) {
    var updated = false,
        updatedData = new UpdatedData(),
        userProfile = getUserProfile();
    wallet = new Wallet(wallet);
    inventory = new Inventory(inventory);
    if (!userProfile) {
        return;
    }
    if (wallet) {
        updated = processWallet(userProfile.getWallet(), wallet) && updated;
        updatedData.setCurrencies(wallet.getCurrencies());
    }
    if (inventory) {
        updated = processInventory(userProfile.getInventory(), inventory) && updated;
        updatedData.setItems(inventory.getItems());
    }

    if (updated) {
        playerDataCallbacks.playerDataUpdated(playerDataUpdateReasons.ServerUpdate, updatedData);
    }

    playerDataCallbacks.playerDataAvailable();
}

function processWallet(oldWallet, newWallet) {
    var storedCurrencies = oldWallet.getCurrencies(),
        receivedCurrencies = newWallet.getCurrencies(),
        updated = false;

    for (var i = 0; i < storedCurrencies.length; i++) {
        storedCurrencies[i].setDelta(0);
    }
    if (oldWallet.getOffset() < newWallet.getOffset() &&
            receivedCurrencies.length > 0 &&
            newWallet.getLogic() === "CLIENT") {
        for (i = 0; i < receivedCurrencies.length; i++) {
            var receivedCurrency = receivedCurrencies[i],
                storedCurrency = oldWallet.getCurrency(receivedCurrency.getId()),
                newBalance;
            if (oldWallet.getOffset() === 0 && newWallet.getOffset() !== 0) {
                newBalance = receivedCurrency.getCurrentBalance();
            } else {
                newBalance = storedCurrency.getCurrentBalance() + receivedCurrency.getDelta();
                newBalance = newBalance >= 0 ? newBalance : 0;
            }
            storedCurrency.setCurrentBalance(newBalance);

            updated = true;
        }
    }
    oldWallet.setOffset(newWallet.getOffset());
    oldWallet.setLogic(newWallet.getLogic());

    return updated;
}

function processInventory(oldInventory, newInventory) {
    var storedItems = oldInventory.getItems(),
        receivedItems = newInventory.getItems(),
        updated = false;

    for (i = 0; i < storedItems.length; i++) {
        storedItems[i].setDelta(0);
    }

    if (oldInventory.getOffset() < newInventory.getOffset() &&
            receivedItems.length > 0 &&
            newInventory.getLogic() === "CLIENT") {
        itemsToBeAdded = [];
        for (i = 0; i < receivedItems.length; i++) {
            var receivedItem = receivedItems[i],
                storedItem = oldInventory.getItem(receivedItem.getId());
            if (storedItem == null) {
                if (receivedItem.getAmount() > 0) {
                    oldInventory.addItem(receivedItem);
                    updated = true;
                }
                continue;
            }

            var newBalance = storedItem.getAmount() + receivedItem.getDelta();
            if (newBalance <= 0) {
                oldInventory.removeItem(storedItem.getId());
            } else {
                storedItem.setAmount(newBalance);
            }
            updated = true;
        }
    }

    oldInventory.setOffset(newInventory.getOffset());
    oldInventory.setLogic(newInventory.getLogic());

    return updated;
}

function updateInventoryWithItem(itemId, amount, action, reason) {
    var userProfile = getUserProfile(),
        gameData = require("./GameData").SpilSDK.getGameData();
    amount = parseInt(amount);
    if (!userProfile || !gameData) {
        playerDataCallbacks.playerDataError(ErrorCodes.LoadFailed);
        return;
    }

    var item = gameData.getItem(itemId);
    if (item === null || amount === undefined || action === undefined || reason === undefined) {
        playerDataCallbacks.playerDataError(ErrorCodes.ItemOperation);
        return;
    }
    var playerItem = new PlayerItem({
            id: item.getId(),
            delta: amount,
            amount: amount
        }),
        inventoryItem = userProfile.getInventory ().getItem(itemId),
        updatedData = new UpdatedData();
    if (inventoryItem) {
        var inventoryItemAmount = inventoryItem.getAmount();
        inventoryItemAmount += (action === "add" ? amount : -amount);
        if (inventoryItemAmount < 0) {

            playerDataCallbacks.playerDataError(ErrorCodes.ItemAmountToLow);
            return;
        }
        inventoryItem.setDelta(amount);
        inventoryItem.setAmount(inventoryItemAmount);
        updatedData.addItem(inventoryItem);
    } else {
        if (action === "add") {
            userProfile.getInventory().addItem(playerItem);
            updatedData.addItem(playerItem);
        } else if (action === "substract") {
            playerDataCallbacks.playerDataError(ErrorCodes.ItemAmountToLow);
            return;
        }
    }

    playerDataCallbacks.playerDataUpdated(reason, updatedData);

    sendUpdatePlayerDataEvent(updatedData, reason, "item", item.getObject());
}

function updateInventoryWithBundle(bundleId, reason, fromShop) {
    var userProfile = getUserProfile(),
        gameData = require("./GameData").SpilSDK.getGameData();
    if (!userProfile || !gameData) {
        playerDataCallbacks.playerDataError(ErrorCodes.LoadFailed);
        return;
    }
    var updatedData = new UpdatedData(),
        bundle = gameData.getBundle(bundleId);
    if (bundle === null || reason === undefined) {
        playerDataCallbacks.playerDataError(ErrorCodes.BundleOperation);
        return;
    }

    var prices = bundle.getPrices(),
        promotion = gameData.getPromotion(bundle.getId()),
        usePromotion = promotion && fromShop;
    if (usePromotion) {
        prices = promotion.getPrices();
    }
    //Look at tempCurrency
    for (var i =  0; i < prices.length; i++) {
        var bundlePrice = prices[i],
            playerCurrency = userProfile.getWallet().getCurrency(bundlePrice.getCurrencyId());
        if (!playerCurrency) {
            playerDataCallbacks.playerDataError(ErrorCodes.CurrencyNotFound);
            return;
        }
        var currentBalance = playerCurrency.getCurrentBalance(),
            updatedBalance = currentBalance - bundlePrice.getValue();
        if (updatedBalance < 0) {
            playerDataCallbacks.playerDataError(ErrorCodes.NotEnoughCurrency);
            return;
        }
        var updatedDelta = playerCurrency.getDelta() - bundlePrice.getValue();
        // Look at this. Make sure the data is sent
        // if (updatedDelta == 0) {
        //     updatedDelta = -bundlePrice.getValue();
        // }
        playerCurrency.setDelta(updatedDelta);
        playerCurrency.setCurrentBalance(updatedBalance);

        updatedData.addCurrency(playerCurrency);
    }

    for (i = 0; i < bundle.getItems().length; i++) {
        var bundleItem = bundle.getItems()[i],
                playerItem = new PlayerItem({
                id: bundleItem.getId()
            }),
            inventoryItem = userProfile.getInventory().getItem(bundleItem.getId()),
            bundleItemAmount = bundleItem.getAmount();
        if (usePromotion) {
            bundleItemAmount *= promotion.getAmount();
        }
        if (inventoryItem != null) {
            var inventoryItemAmount = inventoryItem.getAmount();
            inventoryItemAmount = inventoryItemAmount + bundleItemAmount;

            inventoryItem.setDelta(bundleItemAmount);
            inventoryItem.setAmount(inventoryItemAmount);
            updatedData.addItem(inventoryItem);
        } else {
            playerItem.setDelta(bundleItemAmount);
            playerItem.setAmount(bundleItemAmount);
            userProfile.getInventory().addItem(playerItem);
            updatedData.addItem(playerItem);
        }
    }

    sendUpdatePlayerDataEvent(updatedData, reason, "bundle", bundle.getObject());

    playerDataCallbacks.playerDataUpdated(reason, updatedData);
}

function sendUpdatePlayerDataEvent(updatedData, reason, reportingKey, reportingValue, taskKey) {

    if (taskKey !== undefined) {
        TaskQueue.removeTask("PlayerData", taskKey);
        timeoutObject = false;
    }

    var userProfile = getUserProfile(),
        result = {
            wallet: {
                offset: userProfile.getWallet().getOffset()
            },
            inventory: {
                offset: userProfile.getInventory().getOffset()
            }
        };
    if (updatedData.getCurrencies().length > 0) {
        result.wallet.currencies = [];
        for (var i = 0; i < updatedData.getCurrencies().length; i++) {
            var currency = updatedData.getCurrencies()[i];
            result.wallet.currencies.push({
                id: currency.getId(),
                currentBalance: currency.getCurrentBalance(),
                delta: currency.getDelta()
            });
        }
    }
    if (updatedData.getItems().length > 0) {
        result.inventory.items = [];
        for (var j = 0; j < updatedData.getItems().length; j++) {
            var item = updatedData.getItems()[j];
            result.inventory.items.push({
                id: item.getId(),
                amount: item.getAmount(),
                delta: item.getDelta()
            });
        }
    }
    if (reportingKey && reportingValue) {
        result[reportingKey] = reportingValue;
    }

    if (reason) {
        result.reason = reason;
    }

    updatePlayerData(result);

}

var TaskQueue = {
    getQueue: function (holder) {
        return JSON.parse(localStorage.getItem(holder)) || [];
    },
    addTask: function (holder, task) {
        var queue = this.getQueue(holder),
            taskKey = queue.push({args: task.args});

        localStorage.setItem(holder, JSON.stringify(queue));

        return taskKey - 1;
    },
    runTasks: function (holder, callback) {
        var queue = this.getQueue(holder),
            queueActions = [];
        for (var i = 0; i < queue.length; i++) {

            var task = queue[i];

            if (holder === "PlayerData") {
                queueActions.push({
                    action: mutateWalletTask,
                    args: task.args
                });
            }

        }

        PreloadQueue(queueActions, callback);

        this.clearQueue(holder);
    },
    removeTask: function (holder, taskKey) {
        var queue = this.getQueue(holder);
        queue.splice(taskKey, 1);
        localStorage.setItem(holder, JSON.stringify(queue));
    },
    updateTask: function (holder, taskKey, args) {
        var queue = this.getQueue(holder);
        queue[taskKey].args = args;

        localStorage.setItem(holder, JSON.stringify(queue));
    },
    clearQueue: function (holder) {
        localStorage.setItem(holder, JSON.stringify([]));
    }
};

function mutateWalletTask(requestUpdatedData, reason) {

    requestUpdatedData = new UpdatedData({"currencies": requestUpdatedData.currencies});

    var currencies = requestUpdatedData.getCurrencies(),
        currency,
        userCurrency;

    for (var i = 0; i < currencies.length; i++) {
        currency = currencies[i];

        userCurrency = getUserProfile().getWallet().getCurrency(currency.id);

        userCurrency.setDelta(currency.getDelta());
        userCurrency.setCurrentBalance(currency.getCurrentBalance());
    }


    sendUpdatePlayerDataEvent(requestUpdatedData, reason);
}

var requestUpdatedData = new UpdatedData();

function mutateWallet(currencyId, delta, reason) {

    var userProf = getUserProfile();
    if (!userProf) {
        playerDataCallbacks.playerDataError(ErrorCodes.WalletNotFound);
        return;
    }

    var currency = getUserProfile().getWallet().getCurrency(currencyId);

    if (!currency) {
        playerDataCallbacks.playerDataError(ErrorCodes.CurrencyNotFound);
        return;
    }

    if (currencyId < 0 || reason == null) {
        playerDataCallbacks.playerDataError(ErrorCodes.CurrencyOperation);
        return;
    }

    var updatedBalance = parseFloat(currency.getCurrentBalance()) + parseFloat(delta);


    if (updatedBalance < 0) {
        playerDataCallbacks.playerDataError(ErrorCodes.NotEnoughCurrency);
        return;
    }

    var updatedDelta = delta + currency.getDelta();

    if (updatedDelta === 0) {
        updatedDelta = delta;
    }

    currency.setDelta(updatedDelta);
    currency.setCurrentBalance(updatedBalance);

    if (userProf.getWallet().getLogic() === "CLIENT") {

        requestUpdatedData.addCurrency(currency);

        if (lastStoredReason === reason || lastStoredReason === "") {

            playerDataCallbacks.playerDataUpdated(reason, new UpdatedData({"currencies": [currency]}));

            /**
             * if there is no timeout object yet defined
             */
            if (timeoutObject === false) {
                lastStoredReason = reason;
                lastUpdatedData = requestUpdatedData;
                /**
                 * add task
                 */
                timeoutObjectTaskKey = TaskQueue.addTask("PlayerData", {
                    args: [requestUpdatedData, reason]
                });

                timeoutObject = setTimeout(sendUpdatePlayerDataEvent.bind(
                    null,
                    requestUpdatedData,
                    reason,
                    null, null,
                    timeoutObjectTaskKey
                ), 5000);

            /**
             * if there is allready a timeout object defined,
             * replace the current timeout object with the new updated data and reset the timer
             *
             * update the task to execute with
             */
            }else {
                /** unregister current timeout object
                    and register a new one
                 **/
                clearTimeout(timeoutObject);
                lastUpdatedData = requestUpdatedData;

                TaskQueue.updateTask("PlayerData", timeoutObjectTaskKey, [requestUpdatedData, reason]);

                timeoutObject = setTimeout(sendUpdatePlayerDataEvent.bind(
                    null,
                    requestUpdatedData,
                    reason,
                    null, null,
                    timeoutObjectTaskKey
                ), 5000);
            }

        }else {
            var lastReason = lastStoredReason;

            clearTimeout(timeoutObject);
            timeoutObject = false;
            TaskQueue.removeTask("PlayerData", timeoutObjectTaskKey);
            sendUpdatePlayerDataEvent(requestUpdatedData, lastReason);

            var newUpdatedData = new UpdatedData({"currencies": [currency]});

            sendUpdatePlayerDataEvent(newUpdatedData, reason);
            lastStoredReason = reason;
            lastUpdatedData = newUpdatedData;

            playerDataCallbacks.playerDataUpdated(reason, newUpdatedData);

        }

    }
}

function updatePlayerData(data, callback) {
    EventUtil.sendEvent("updatePlayerData", data, function (responseData) {
        processPlayerData(responseData.data.wallet, responseData.data.inventory);

        if (callback) {
            callback(userProfile);
        }
    });
}

var playerDataUpdateReasons = {
    RewardAds: "Reward Ads",
    ItemBought: "Item Bought",
    ItemSold: "Item Sold",
    EventReward: "Event Reward",
    LoginReward: "Login Reward",
    IAP: "IAP",
    PlayerLevelUp: "Player Level Up",
    LevelComplete: "Level Complete",
    ItemUpgrade: "Item Upgrade",
    BonusFeatures: "Bonus Features",
    Trade: "Trade",
    ClientServerMismatch: "Client-Server Mismatch",
    ItemPickedUp: "Item Picked Up",
    ServerUpdate: "Server Update",
    DailyBonus: "Daily Bonus From Client"
};


module.exports = {
    "SpilSDK": {
        requestPlayerData: function (callback) {

            function request(callback) {
                var userProfile = getUserProfile();
                eventData = {
                    "wallet": {"offset": userProfile.getWallet().getOffset()},
                    "inventory": {"offset": userProfile.getInventory().getOffset()}
                };
                EventUtil.sendEvent("requestPlayerData", eventData, function (responseData) {
                    processPlayerData(responseData.data.wallet, responseData.data.inventory);
                    if (callback) {
                        callback(userProfile);
                    }
                });
            }

            /**
             * if we have task run the tasks
             */
            if (TaskQueue.getQueue("PlayerData").length > 0) {
                request(function () {
                    TaskQueue.runTasks("PlayerData", function () {
                        //request();
                    });
                });

            }else {
                request(callback);
            }
        },
        getWallet: function () {
            var userProf = getUserProfile();
            if (userProf) {
                return userProf.getWallet();
            } else {
                playerDataCallbacks.playerDataError(ErrorCodes.WalletNotFound);
            }
        },
        getInventory: function () {
            return getUserProfile().getInventory();
        },
        getUserProfile: function () {
            return getUserProfile();
        },
        addItemToInventory: function (itemId, amount, reason) {

            if (parseInt(amount) < 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.ItemOperation);
                return;
            }
            updateInventoryWithItem(itemId, amount, "add", reason);
        },
        subtractItemFromInventory: function (itemId, amount, reason) {

            if (parseInt(amount) < 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.ItemOperation);
                return;
            }
            updateInventoryWithItem(itemId, amount, "substract", reason);
        },
        consumeBundle: function (bundleId, reason, fromShop) {
            updateInventoryWithBundle(bundleId, reason, fromShop);
        },
        addCurrencyToWallet: function (currencyId, delta, reason) {

            if (parseInt(delta) < 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.CurrencyOperation);
                return;
            }

            mutateWallet(currencyId, parseFloat(delta), reason);
        },
        subtractCurrencyFromWallet: function (currencyId, delta, reason) {

            if (parseInt(delta) < 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.CurrencyOperation);
                return;
            }

            mutateWallet(currencyId, -Math.abs(delta), reason);
        },
        setPlayerDataCallbacks: function (listeners) {
            for (var listenerName in listeners) {
                playerDataCallbacks[listenerName] = listeners[listenerName];
            }
        }
    }
};

var defaultPlayerData = {
    "inventory": {
        "offset": 0,
        "items": [],
        "logic": "CLIENT"
    },
    "wallet": {
        "offset": 0,
        "logic": "CLIENT",
        "currencies": []
    }
};
