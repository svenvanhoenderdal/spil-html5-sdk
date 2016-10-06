function PlayerData(_event, _game_data) {
    var event = _event,
        gameData = _game_data,
        userProfile;

    return {
        refreshPlayerData: function(callback) {
            event.sendEvent('requestPlayerData', {}, function(response_data){
                userProfile = UserProfileModel(response_data.data);
                if (callback) {
                    callback(userProfile);
                }
            });
        },
        getWallet: function() {
            return userProfile.getWallet();
        },
        getInventory: function() {
            return userProfile.getInventory();
        },
        updateWallet: function(currencyId, delta, reason) {

        },
        updateInventory: function(itemId, delta, reason) {

        },
        consumeBundle: function(bundleId, reason) {

        }
    };
}