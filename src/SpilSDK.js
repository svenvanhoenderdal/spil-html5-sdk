SpilSDK = function (bundleId, appVersion, callback, environment) {
    require("./core_modules/Config.js")({
        bundleId: bundleId,
        appVersion: appVersion,
        environment: environment
    });

    /**
     * core modules
     * @type {*|exports|module.exports}
     */
    var Utils = require("./core_modules/Utils");
    var PreloadQueue = require("./core_modules/PreloadQueue");
    var Events = require("./core_modules/Events");

    /**
     * +
     * @type {*|exports|module.exports}
     */
    var GameData = require("./modules/GameData");
    var EventUtil = require("./modules/EventUtil");
    var ConfigModule = require("./modules/Config");
    var Package = require("./modules/Package");
    var PlayerData = require("./modules/PlayerData");

    var modules = [EventUtil, GameData, ConfigModule, Package, PlayerData];

    function init() {
        PreloadQueue([{
                action: "loadscript",
                args: ["https://payments.spilgames.com/static/javascript/spil/payment.client.js"]
            }, {
                action: "loadscript",
                args: ["https://payments.spilgames.com/static/javascript/spil/payment.portal.js"]
            }, {
                action: function (callback) {
                    GameData.SpilSDK.requestGameData(function () {
                        PlayerData.SpilSDK.requestPlayerData(callback);
                    });
                }
            }], function () {callback(SpilSDK);}
        );

        /**
         * global spilsdk mutate
         */
        SpilSDK = {};
        /**
         * load global SpilSDK properties
         * @type {Array}
         */
        var args = [SpilSDK];
        for (var i = 0; i < modules.length; i++) {
            args.push(modules[i].SpilSDK);
        }
        SpilSDK = Object.assign.apply(null, args);
    }
    init();
};
