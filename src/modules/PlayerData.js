var EventUtil = require("./EventUtil");
var UserProfile = require("../models/playerData/UserProfile");
var GameData = require("./GameData").SpilSDK,
    userProfile;

function getUserProfile() {
    if (userProfile) {
        return userProfile;
    }
    userProfile = new UserProfile({"wallet": {"currencies": [], "offset": 0}, "inventory": {"items": [], "offset": 0}});
    return userProfile;
}

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


