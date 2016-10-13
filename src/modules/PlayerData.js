var Event = require('./Event.js'),
    UserProfile = require('../models/playerData/UserProfile.js'),
    UpdatedData = require('../models/playerData/UpdatedData.js'),
    Wallet = require('../models/playerData/Wallet.js'),
    Inventory = require('../models/playerData/Inventory.js'),
    PlayerItem = require('../models/playerData/PlayerItem.js'),
    GameData = require('./GameData.js').SpilSDK,
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
    console.log(wallet)
    console.log(inventory)
    var updated = false;
    var updatedData = new UpdatedData();
    var userProfile = getUserProfile();
    wallet = new Wallet(wallet);
    inventory = new Inventory(inventory);
    console.log(wallet);
    console.log(inventory);
    console.log('test')
    if (userProfile == null) {
        console.log('processPlayerData: no userprofile set!');
        return
    }
    if (wallet == null || inventory == null) {
        console.log('processPlayerData: no wallet or inventory!');
        return
        //PlayerDataError
    }
    updated = processWallet(userProfile.getWallet(), wallet) && updated;
    updatedData.setCurrencies(wallet.getCurrencies());

    updated = processInventory(userProfile.getInventory(), inventory) && updated;
    updatedData.setItems(inventory.getItems());

    updateUserProfile(userProfile);

    if (updated) {
        //PlayerDataUpdated
    }

    //PlayerDataAvailable
}

function processWallet(oldWallet, newWallet) {
    var storedCurrencies = oldWallet.getCurrencies();
    var receivedCurrencies = newWallet.getCurrencies();
    var updated = false;
    console.log('processWallet')
    console.log(newWallet);

    for (var i = 0; i < storedCurrencies.length; i++) {
        storedCurrencies[i].setDelta(0);
    }
    // !!! Something with init wallet
    if (oldWallet.getOffset() < newWallet.getOffset() && receivedCurrencies.length > 0 && newWallet.getLogic() === "CLIENT") {
        for(i = 0; i < receivedCurrencies.length; i++) {
            var receivedCurrency = receivedCurrencies[i];
            var storedCurrency = oldWallet.getCurrency(receivedCurrency.getId());
            console.log(receivedCurrency);
            console.log(storedCurrency)

            // Do this at a later stage (getUserProfile)
            // if (storedCurrency == null) {
            //     oldWallet.addCurrency(receivedCurrency)
            //     updated = true;
            //     continue;
            // }

            var newBalance = storedCurrency.getCurrentBalance() + receivedCurrency.getDelta();
            newBalance = newBalance >= 0 ? newBalance : 0;
            storedCurrency.setCurrentBalance(updatedBalance);

            updated = true;
        }
    }
    oldWallet.setOffset(newWallet.getOffset());
    oldWallet.setLogic(newWallet.getLogic());

    return updated;
}

function processInventory(oldInventory, newInventory) {
    var storedItems = oldInventory.getItems();
    var receivedItems = newInventory.getItems();
    var updated = false;
    for (i = 0; i < storedItems.length; i++) {
        storedItems[i].setDelta(0);
    }

    if(oldInventory.getOffset() < newInventory.getOffset() && receivedItems.length > 0 && newInventory.getLogic() === "CLIENT") {
        itemsToBeAdded = [];
        for (i = 0; i < receivedItems.length; i++) {
            var receivedItem = receivedItems[i];
            var storedItem = oldInventory.getItem(receivedItem.getId());

            if (storedItem == null) {
                oldInventory.addItem(receivedItem)
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

    'SpilSDK': {
        requestPlayerData: function(callback) {
            var userProfile = getUserProfile();
            eventData = {'wallet': {'offset': userProfile.getWallet().getOffset()}, 'inventory': {'offset': userProfile.getInventory().getOffset()}};
            Event.sendEvent('requestPlayerData', eventData, function(response_data){
                // userProfile = new UserProfile(response_data.data, GameData.getGameData());
                processPlayerData(response_data.data.wallet, response_data.data.inventory);
                if (callback) {
                    callback(userProfile);
                }
            });
        },
        updatePlayerData: function(currencies, items, callback) {
            var userProfile = getUserProfile();
            eventData = {
                'wallet': {'currencies': currencies, 'offset': userProfile.getWallet().getOffset()},
                'inventory': {'items': items, 'offset': userProfile.getInventory().getOffset()}
            };
            Event.sendEvent('updatePlayerData', eventData, function(response_data){
                // userProfile = new UserProfile(response_data.data, GameData.getGameData());
                processPlayerData(response_data.data.wallet, response_data.data.inventory);
                if (callback) {
                    callback(userProfile);
                }
            });
        },
        getWallet: function() {
            return getUserProfile().getWallet();
        },
        getInventory: function() {
            return getUserProfile().getInventory();
        },
        getUserProfile: function() {
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
        "currencies": [
            {
                "id": 207,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 185,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 157,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 181,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 67,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 45,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 79,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 65,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 85,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 49,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 53,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 118,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 103,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 89,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 115,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 61,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 111,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 93,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 63,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 107,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 101,
                "currentBalance": 0,
                "delta": 0
            },
            {
                "id": 97,
                "currentBalance": 0,
                "delta": 0
            }
        ]
    }
}
