var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");
var GameData = require("../models/gameData/GameData");
var gameData;

module.exports = {
    "SpilSDK": {
        requestGameData: function (callback) {
            EventUtil.sendEvent("requestGameData", {}, function (responseData) {
                gameData = new GameData(responseData.data);
                Events.publish("onGameDataUpdated", gameData);
                if (callback) {
                    callback(gameData);
                }
            });
        },
        getGameData: function () {
            return gameData;
        },
        onGameDataUpdated: function (callback) {
            Events.subscribe("onGameDataUpdated", callback);
        }
    }
};
