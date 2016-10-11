var Event = require('./Event');
var Events = require('../core_modules/Events');

var storeconfig = {};

module.exports = {
    'SpilSDK':{
        refreshConfig: function(callback) {
            Event.sendEvent('requestConfig', {}, function(response_data){
                data = storeconfig = response_data.data;
                Events.publish('onConfigUpdated', data);
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