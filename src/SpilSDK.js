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
    var CallbackQueue = require('./core_modules/CallbackQueue.js');
    var Events = require('./core_modules/Events.js');

    /**
     * +
     * @type {*|exports|module.exports}
     */
    var GameData = require('./modules/GameData.js');
    var Event = require('./modules/Event.js');
    var ConfigModule = require('./modules/Config.js');
    var Package = require('./modules/Package.js');

    var modules = [Event, GameData, ConfigModule, Package];

    function init() {

        CallbackQueue([{
            callback: 'loadscript',
            args: ['https://payments.spilgames.com/static/javascript/spil/payment.client.js']
        },{
            callback: 'loadscript',
            args: ['https://payments.spilgames.com/static/javascript/spil/payment.portal.js']
        },{
            callback: GameData.SpilSDK.requestGameData
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