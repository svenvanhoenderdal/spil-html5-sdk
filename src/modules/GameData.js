var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");
var GameData = require("../models/gameData/GameData");
var PlayerData = require("./PlayerData").SpilSDK;
var PlayerCurrency = require("../models/playerData/PlayerCurrency");
var ErrorCodes = require("../core_modules/ErrorCodes");
var gameData;

function getGameData() {
    if (gameData) {
        return gameData;
    }
    try {
        gameData = new GameData(defaultGameData);
        return gameData;
    } catch (err) {
        gameDataCallbacks.gameDataError(ErrorCodes.loadFailed);
        return null;
    }
}

function updateGameData(updatedGameData) {
    gameData = updatedGameData;
}

function processGameData(gameData) {
    storedGameData = getGameData();
    storedGameData.setItems(gameData.items);
    storedGameData.setBundles(gameData.bundles);
    storedGameData.setCurrencies(gameData.currencies);
    storedGameData.setPromotions(gameData.promotions);
    storedGameData.setShop(gameData.shop);

    var wallet = PlayerData.getUserProfile().getWallet();
    for (var i = 0; i < storedGameData.getCurrencies().length; i++) {
        var storedCurrency = storedGameData.getCurrencies()[i];
        if (!wallet.getCurrency(storedCurrency.getId())) {
            wallet.addCurrency(new PlayerCurrency({
                "id": storedCurrency.getId(),
                "currentBalance": storedCurrency.getInitialValue(),
                "delta": storedCurrency.getInitialValue()
            }));
        }
    }
    for (i = 0; i < wallet.getCurrencies().length; i++) {
        var playerCurrency = wallet.getCurrencies()[i];
        if (!storedGameData.getCurrency(playerCurrency.getId())) {
            wallet.removeCurrency(playerCurrency.getId());
        }
    }

    updateGameData(storedGameData);

    gameDataCallbacks.gameDataAvailable();
}

var gameDataCallbacks = {
    gameDataError: function (error) {},
    gameDataAvailable: function () {}
};

module.exports = {
    "SpilSDK": {
        requestGameData: function (callback) {
            EventUtil.sendEvent("requestGameData", {}, function (responseData) {
                processGameData(responseData.data);

                Events.publish("onGameDataUpdated", gameData);
                if (callback) {
                    callback(gameData);
                }
            });
        },
        getGameData: function () {
            return getGameData();
        },
        setGameDataCallbacks: function (listeners) {
            for (var listenerName in listeners) {
                gameDataCallbacks[listenerName] = listeners[listenerName];
            }
        }
    }
};

var defaultGameData = {
    "bundles": [],
    "items": [],
    "promotions": [],
    "currencies": [],
    "shop": []
};


