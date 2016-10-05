function GameData(_event) {
    var event = _event,
        gameData;
    return {
        refreshGameData: function(callback) {
            event.sendEvent('requestGameData', {}, function(response_data){
                gameData = GameDataModel(response_data.data);
                if (callback) {
                    callback(gameData);
                }
            });
        },
        getGameData: function() {
            return gameData;
        }
    };
}
