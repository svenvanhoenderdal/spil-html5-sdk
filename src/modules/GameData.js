var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");
var GameData = require("../models/gameData/GameData");
var PlayerData = require("./PlayerData").SpilSDK;
var PlayerCurrency = require("../models/playerData/PlayerCurrency");
var gameData;

function getGameData() {
    if (gameData) {
        return gameData;
    }
    try {
        gameData = new GameData(defaultGameData);
        return gameData;
    } catch(err) {
        //GameDataError
        return null;
    }
}

function updateGameData(updatedGameData) {
    gameData = updatedGameData;
}

function processGameData (gameData) {
    storedGameData = getGameData();
    storedGameData.setItems(gameData.items);
    storedGameData.setBundles(gameData.bundles);
    storedGameData.setCurrencies(gameData.currencies);
    storedGameData.setPromotions(gameData.promotions);
    storedGameData.setShop(gameData.shop);

    var wallet = PlayerData.getUserProfile().getWallet();
    for (var i = 0; i < storedGameData.getCurrencies().length; i++) {
        var currency = storedGameData.getCurrencies()[i];
        if (!wallet.getCurrency(currency.getId())) {
            wallet.addCurrency(new PlayerCurrency({
                'id': currency.getId(),
                'currentBalance': currency.getInitialValue(),
                'delta': currency.getInitialValue()
            }));
        }
    }
    for (i = 0; i < wallet.getCurrencies().length; i++) {
        var currency = wallet.getCurrencies()[i];
        if (!storedGameData.getCurrency(currency.getId())) {
            wallet.removeCurrency(currency.getId());
        }
    }

    updateGameData(storedGameData);

    //gameDataAvailable
}

module.exports = {
    "SpilSDK": {
        requestGameData: function (callback) {
            EventUtil.sendEvent("requestGameData", {}, function (responseData) {
                processGameData(responseData.data)

                Events.publish("onGameDataUpdated", gameData);
                if (callback) {
                    callback(gameData);
                }
            });
        },
        getGameData: function () {
            return getGameData();
        },
        onGameDataUpdated: function (callback) {
            Events.subscribe("onGameDataUpdated", callback);
        }
    }
};

var defaultGameData = {
    "bundles": [],
    "items": [],
    "promotions": [],
    "currencies": [],
    "shop": []
}