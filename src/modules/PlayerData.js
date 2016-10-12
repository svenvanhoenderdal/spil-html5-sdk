var Event = require('./Event.js'),
    UserProfile = require('../models/playerData/UserProfile.js'),
    GameData = require('./GameData.js').SpilSDK,
    userProfile;

function getUserProfile() {
    if (userProfile) {
        return userProfile;
    }
    userProfile = new UserProfile({'wallet': {'currencies':[], 'offset':0}, 'inventory': {'items':[], 'offset': 0}});
    return userProfile;

}

module.exports = {
    'SpilSDK': {
        requestPlayerData: function(callback) {
            Event.sendEvent('requestPlayerData', {'wallet': {'currencies':[], 'offset':0}, 'inventory': {'items':[], 'offset': 0}}, function(response_data){
                userProfile = new UserProfile(response_data.data, GameData.getGameData());
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


