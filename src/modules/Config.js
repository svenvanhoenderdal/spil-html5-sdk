var EventUtil = require("./EventUtil");
var Events = require("../core_modules/Events");

var config = {};

module.exports = {
    "SpilSDK": {
        refreshConfig: function (callback) {
            EventUtil.sendEvent("requestConfig", {}, function (responseData) {
                config = responseData.data;
                Events.publish("onConfigUpdated", config);
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
        onConfigUpdated: function (callback) {
            Events.subscribe("onConfigUpdated", callback);
        }
    }
};
