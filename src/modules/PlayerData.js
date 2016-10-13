var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");
var UserProfile = require("../models/playerData/UserProfile");
var ErrorCodes = require("../core_modules/ErrorCodes");
var GameData = require("./GameData").SpilSDK,
    userProfile;

function getUserProfile() {
    if (userProfile) {
        return userProfile;
    }
    userProfile = new UserProfile({"wallet": {"currencies": [], "offset": 0}, "inventory": {"items": [], "offset": 0}});
    return userProfile;
}

var playerDataCallbacks = {
    playerDataError: function (error) {},
    playerDataAvailable: function () {},
    playerDataUpdated: function (reason, updatedData) {}
};

module.exports = {
    "SpilSDK": {
        requestPlayerData: function (callback) {
            data = {"wallet": {"currencies": [], "offset": 0}, "inventory": {"items": [], "offset": 0}};
            EventUtil.sendEvent("requestPlayerData", data, function (responseData) {
                userProfile = new UserProfile(responseData.data, GameData.getGameData());
                if (callback) {
                    callback(userProfile);
                }
            });
        },
        getWallet: function () {
            var userProf = getUserProfile();
            if (userProf) {
                //@TODO set initialize value for wallet
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
        setPlayerDataCallbacks: function (listeners) {
            for (var listenerName in listeners) {
                playerDataCallbacks[listenerName] = listeners[listenerName];
            }
        }

    }
};


