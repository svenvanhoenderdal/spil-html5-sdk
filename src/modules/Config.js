var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");

var config = {};

var configDataCallbacks = {
    'configDataUpdated': function() {}
}

module.exports = {
    "SpilSDK": {
        refreshConfig: function (callback) {
            EventUtil.sendEvent("requestConfig", {}, function (responseData) {
                config = responseData.data;
                configDataCallbacks.configDataUpdated();
                if (callback) {
                    callback(data);
                }
            });
        },
        getConfigAll: function () {
            return config;
        },
        getConfigValue: function (key) {
            return config[key];
        },
        setConfigDataCallbacks: function(listeners) {
            for (var listenerName in listeners) {
                configDataCallbacks[listenerName] = listeners[listenerName];
            }
        }
    }
};
