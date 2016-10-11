var Event = require('./Event');
var Events = require('../core_modules/Events.js');



var gameData;



module.exports = {
    'SpilSDK': {
        requestGameData: function (callback) {
            Event.sendEvent('requestGameData', {}, function (response_data) {
                gameData = response_data.data;
                Events.publish('onGameDataUpdated', gameData);
                if (callback) {
                    callback(gameData);
                }
            });
        },
        getGameData: function () {
            return gameData;
        },
        onGameDataUpdated:function(callback){
            Events.subscribe('onGameDataUpdated', callback);
        }
    }
};