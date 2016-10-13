var EventUtil = require("./EventUtil"),
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
                storedCurrency = oldWallet.getCurrency(receivedCurrency.getId());

            // Do this at a later stage (getUserProfile)
            // if (storedCurrency == null) {
            //     oldWallet.addCurrency(receivedCurrency)
            //     updated = true;
            //     continue;
            // }

            var newBalance = storedCurrency.getCurrentBalance() + receivedCurrency.getDelta();
            newBalance = newBalance >= 0 ? newBalance : 0;
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
        updatePlayerData: function (currencies, items, callback) {
            var userProfile = getUserProfile();
            eventData = {
                "wallet": {"currencies": currencies, "offset": userProfile.getWallet().getOffset()},
                "inventory": {"items": items, "offset": userProfile.getInventory().getOffset()}
            };
            EventUtil.sendEvent("updatePlayerData", eventData, function (responseData) {
                processPlayerData(responseData.data.wallet, responseData.data.inventory);
                if (callback) {
                    callback(userProfile);
                }
            });
        },
        getWallet: function () {
            return getUserProfile().getWallet();
        },
        getInventory: function () {
            return getUserProfile().getInventory();
        },
        getUserProfile: function () {
            return getUserProfile();
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
