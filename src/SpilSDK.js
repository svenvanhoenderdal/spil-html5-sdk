SpilSDK = function(bundle_id, app_version, callback, environment) {

    require('./core_modules/Config')({
        bundle_id:bundle_id,
        app_version: app_version,
        environment: environment
    });

    /**
     * core modules
     * @type {*|exports|module.exports}
     */
    var Utils = require('./core_modules/Utils.js');
    var PreloadQueue = require('./core_modules/PreloadQueue.js');
    var Events = require('./core_modules/Events.js');

    /**
     * +
     * @type {*|exports|module.exports}
     */
    var GameData = require('./modules/GameData.js');
    var Event = require('./modules/Event.js');
    var ConfigModule = require('./modules/Config.js');
    var Package = require('./modules/Package.js');
    var PlayerData = require('./modules/PlayerData.js');

    var modules = [Event, GameData, ConfigModule, Package, PlayerData];

    function init() {

        PreloadQueue([{
            action: 'loadscript',
            args: ['https://payments.spilgames.com/static/javascript/spil/payment.client.js']
        },{
            action: 'loadscript',
            args: ['https://payments.spilgames.com/static/javascript/spil/payment.portal.js']
        },{
            action: function(callback) {
                GameData.SpilSDK.requestGameData(function() {
                    PlayerData.SpilSDK.requestPlayerData(callback);
                });
            }
        }
        ], function(){

            /**
             * global spilsdk mutate
             */

            SpilSDK = {};

            /**
             * load global SpilSDK properties
             * @type {Array}
             */
            var args = [SpilSDK];
            for(var i=0;i<modules.length;i++){
                args.push(modules[i]['SpilSDK']);
            }
            SpilSDK = Object.assign.apply(null, args);

            callback(SpilSDK);

        });


        //preloadData(SDK_functions.requestGameData);
        //preloadData(SDK_functions.refreshConfig);


    }


    init();
};