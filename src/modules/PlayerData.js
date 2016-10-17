var ErrorCodes = require("../core_modules/ErrorCodes"),
    EventUtil = require("./EventUtil"),
    UserProfile = require("../models/playerData/UserProfile"),
    UpdatedData = require("../models/playerData/UpdatedData"),
    Wallet = require("../models/playerData/Wallet"),
    Inventory = require("../models/playerData/Inventory"),
    PlayerItem = require("../models/playerData/PlayerItem"),
    userProfile;

function getUserProfile() {
    if (userProfile) {
        return userProfile;
    }
    userProfile = new UserProfile(defaultPlayerData);
    return userProfile;
}

function updateUserProfile(updatedUserProfile) {
    userProfile = updatedUserProfile;
}

function processPlayerData(wallet, inventory) {
    var updated = false,
        updatedData = new UpdatedData(),
        userProfile = getUserProfile();
    wallet = new Wallet(wallet);
    inventory = new Inventory(inventory);
    if (userProfile == null) {
        console.log("processPlayerData: no userprofile set!");
        return;
    }
    if (wallet == null || inventory == null) {
        console.log("processPlayerData: no wallet or inventory!");
        return;
        //PlayerDataError
    }
    updated = processWallet(userProfile.getWallet(), wallet) && updated;
    updatedData.setCurrencies(wallet.getCurrencies());

    updated = processInventory(userProfile.getInventory(), inventory) && updated;
    updatedData.setItems(inventory.getItems());

    updateUserProfile(userProfile);

    if (updated) {
        console.log("PlayerDataUpdated");
        //PlayerDataUpdated
    }

    //PlayerDataAvailable
}

function processWallet(oldWallet, newWallet) {
    var storedCurrencies = oldWallet.getCurrencies(),
        receivedCurrencies = newWallet.getCurrencies(),
        updated = false;

    for (var i = 0; i < storedCurrencies.length; i++) {
        storedCurrencies[i].setDelta(0);
    }
    // !!! Something with init wallet
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
                oldInventory.addItem(receivedItem);
                updated = true;
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
    if (!userprofile || !gameData) {
        //PlayerDataError - LoadFailed
        return;
    }

    var item = gameData.getItem(itemId);
    if (item === null || amount === undefined || action === undefined || reason === undefined) {
        // playerDataError - ItemOperation
        return;
    }
    var playerItem = new PlayerItem({
        id: item.getId(),
        delta: amount,
        amount: amount
    }),
        inventoryItem = userProfile.getInventory ().getItem(itemId);
    if (inventoryItem) {
        var inventoryItemAmount = inventoryItem.getAmount();
        inventoryItemAmount += (action === "add" ? amount : -amount);
        inventoryItem.setDelta(amount);
        inventoryItem.setAmount(inventoryItem);
    } else {
        if (action === "add") {
            userProfile.getInventory().addItem(playerItem);
        } else if (action === "substract") {
            console.log("playerDataError - ItemAmountToLow");
        }
    }
    updateUserProfile(userprofile);
    var updatedData = new UpdatedData();
    updatedData.addItem(playerItem);

    // playerDataUpdated

    sendUpdatePlayerDataEvent(updatedData, reason, "item", item.getObject());
}

function updateInventoryWithBundle(bundleId, reason) {
    var userProfile = getUserProfile(),
        gameData = require("./GameData").SpilSDK.getGameData();
    if (!userProfile || !gameData) {
        console.log("playerDataError - LoadFailed");
        return;
    }
    var updatedData = new UpdatedData(),
        bundle = gameData.getBundle(bundleId);
    if (bundle === null || reason === undefined) {
        console.log("playerDataError - BundleOperation");
        return;
    }
    //Look at tempCurrency
    for (var i =  0; i < bundle.getPrices().length; i++) {
        var bundlePrice = bundle.getPrices()[i],
            playerCurrency = userProfile.getWallet().getCurrency(bundlePrice.getCurrencyId());
        if (!playerCurrency) {
            console.log("playerDataError - CurrencyNotFound");
            return;
        }
        var currentBalance = playerCurrency.getCurrentBalance(),
            updatedBalance = currentBalance - bundlePrice.getValue();
        if (updatedBalance < 0) {
            console.log("playerDataError - NotEnoughCurrency");
            //playerDataError -
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
            inventoryItem = userProfile.getInventory().getItem(bundleItem.getId());
        if (inventoryItem != null) {
            var inventoryItemAmount = inventoryItem.getAmount();
            inventoryItemAmount = inventoryItemAmount + bundleItem.getAmount();

            inventoryItem.setDelta(bundleItem.getAmount());
            inventoryItem.setAmount(inventoryItemAmount);
        } else {
            playerItem.setDelta(bundleItem.getAmount());
            playerItem.setAmount(bundleItem.getAmount());
            userProfile.getInventory().addItem(playerItem);
        }
        updatedData.addItem(playerItem);
    }

    sendUpdatePlayerDataEvent(updatedData, reason, "bundle", bundle.getObject());
    //playerDataUpdated
}

function sendUpdatePlayerDataEvent(updatedData, reason, reportingKey, reportingValue) {
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
                amount: item.getAmount()
            });
        }
    }
    if (reportingKey && reportingValue) {
        result[reportingKey] = reportingValue;
    }
    updatePlayerData(result);
}

var lastStoredReason = "";
var timeoutObject = false;

function timeoutSend() {
    sendEvent(lastStoredReason);

    lastStoredReason = "";
    timeoutObject = false;
}

function sendEvent(reason) {
    console.log("send event reason: " + reason);
}

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
    }

    var updatedDelta = delta + currency.getDelta();

    if (updatedDelta == 0) {
        updatedDelta = delta;
    }

    currency.setDelta(updatedDelta);
    currency.setCurrentBalance(updatedBalance);

    if (userProf.getWallet().getLogic() == "CLIENT") {

        var updatedData = new UpdatedData({"currencies": [currency]});

        if (lastStoredReason == reason || lastStoredReason == "") {

            playerDataCallbacks.playerDataUpdated(reason, updatedData);

            if (timeoutObject == false) {
                lastStoredReason = reason;

                timeoutObject = setTimeout(timeoutSend, 5000);
            }else {
                //unregister current timeout object
                clearTimeout(timeoutObject);

                timeoutObject = setTimeout(timeoutSend, 5000);
            }

        }else {
            var lastReason = lastStoredReason;

            clearTimeout(timeoutObject);
            timeoutObject = false;
            sendEvent(lastReason);

            sendEvent(reason);
            lastStoredReason = reason;

            playerDataCallbacks.playerDataUpdated(reason, updatedData);
        }

    }
}



var playerDataCallbacks = {
    playerDataError: function (error) {},
    playerDataAvailable: function () {},
    playerDataUpdated: function (reason, updatedData) {}
};


function updatePlayerData(data, callback) {
    EventUtil.sendEvent("updatePlayerData", data, function (responseData) {
        processPlayerData(responseData.data.wallet, responseData.data.inventory);
        if (callback) {
            callback(userProfile);
        }
    });
};

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
        },
        updatePlayerData: updatePlayerData,
        getWallet: function () {
            var userProf = getUserProfile();
            if (userProf) {
                return userProf.getWallet();
            }else {
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
            updateInventoryWithItem(itemId, amount, "add", reason);
        },
        subtractItemFromInventory: function (itemId, amount, reason) {
            updateInventoryWithItem(itemId, amount, "substract", reason);
        },
        consumeBundle: function (bundleId, reason) {
            updateInventoryWithBundle(bundleId, reason);
        },
        setPlayerDataCallbacks: function (listeners) {
            for (var listenerName in listeners) {
                playerDataCallbacks[listenerName] = listeners[listenerName];
            }
        },
        addCurrencyToWallet: function (currencyId, delta, reason) {

            if (parseInt(delta) < 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.CurrencyOperation);
                return;
            }

            mutateWallet(currencyId, delta, reason)
        },
        subtractCurrencyFromWallet: function (currencyId, delta, reason) {

            if (delta > 0) {
                playerDataCallbacks.playerDataError(ErrorCodes.CurrencyOperation);
                return;
            }

            mutateWallet(currencyId, -delta, reason)
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
