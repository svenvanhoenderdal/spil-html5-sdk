var Event = require('./Event');
var Events = require('../core_modules/Events');

var config = {};

module.exports = {
    'SpilSDK':{
        refreshConfig: function(callback) {
            Event.sendEvent('requestConfig', {}, function(response_data){
                config = response_data.data;
                Events.publish('onConfigUpdated', config);
                if (callback) {
                    callback(data);
                }
            });
        },
        getConfigAll: function() {
            return config;
        },
        getConfigValue: function(key) {
            return config[key];
        },
        onConfigUpdated:function(callback){
            Events.subscribe('onConfigUpdated', callback);
        }
    }
};