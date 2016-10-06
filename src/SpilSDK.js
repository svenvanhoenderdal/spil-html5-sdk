SpilSDK = function(bundle_id, app_version, callback, environment) {
    var wallet, package,
        stepsToLoad = 1,
    init = function() {
        statics = Statics(bundle_id, app_version, environment);
        eventModule = Event(statics);
        config = Config(eventModule);
        gameData = GameData(eventModule);
        wallet = Wallet(eventModule);
        playerData = PlayerData(eventModule, gameData);
        package = Package(eventModule);

        preloadData(loadScript, ['https://payments.spilgames.com/static/javascript/spil/payment.client.js']);
        preloadData(loadScript, ['https://payments.spilgames.com/static/javascript/spil/payment.portal.js']);
        preloadData(SDK_functions.requestGameData);
        preloadData(SDK_functions.refreshConfig);
        // preloadData(SDK_functions.updatePackagesAndPromotion);
        stepsToLoad--;
    },
    preloadData = function(method, args) {
        stepsToLoad++;
        args = args || [];
        args.push(loadCallback);
        method.apply(this, args);
    },
    send_heartbeat = function() {
        eventModule.sendEvent('heartBeat');
    },
    loadCallback = function() {
        stepsToLoad--;
        if(stepsToLoad === 0) {
            // setInterval(send_heartbeat, 1000);
            SpilSDK = SDK_functions;
            if (callback) {
                callback(SDK_functions);
            }
        }
    },
    loadScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');
        script.src = url;

        script.onreadystatechange = callback;
        script.onload = callback;

        head.appendChild(script);
    },
    triggerEvent = function(event, data) {
        event_callbacks = events[event];
        for (var i = 0; i < event_callbacks.length; i++) {
            event_callbacks[i](data);
        }
    },
    events = {
        'onPackagesUpdated': [],
        'onConfigUpdated': [],
        'onGameDataUpdated': [],
        'onPlayerDataAvailable': [],
        'onPlayerDataUpdated': []
    },
    SDK_functions = {
        sendCustomEvent: function(event_name, data, callback) {
            eventModule.sendEvent(event_name, data, callback);
        },
        // Package calls
        updatePackagesAndPromotion: function(callback) {
            package.updatePackagesAndPromotion(function(packages_data){
                triggerEvent('onPackagesUpdated', packages_data);
                if(callback) {
                    callback(packages_data);
                }
            });
        },
        getAllPackages: function() {
            return package.getAllPackages();
        },
        getPackage: function(package_id) {
            return package.getPackage(package_id);
        },
        openPaymentsScreen: function(package_id) {
            package.openPaymentsScreen(package_id);
        },

        // Config calls
        refreshConfig: function(callback) {
            config.refreshConfig(function(config_data){
                triggerEvent('onConfigUpdated', config_data);
                if(callback) {
                    callback(config_data);
                }
            });
        },
        getConfigAll: function() {
            return config.getConfigAll();
        },
        getConfigValue: function(key) {
            return config.getConfigValue(key);
        },

        // GameData
        requestGameData: function(callback) {
            gameData.refreshGameData(function(game_data){
                triggerEvent('onGameDataUpdated', game_data);
                if(callback) {
                    callback(game_data);
                }
            });
        },
        getGameData: function() {
            return gameData.getGameData();
        },

        //PlayerData
        getWallet: function() {
            return playerData.getWallet();
        },
        getInventory: function() {
            return playerData.getInventory();
        },
        addCurrencyToWallet: function(currencyId, amount, reason) {
            if (amount <= 0) {
                console.log('Amount should be bigger than zero');
                return;
            }
            playerData.updateWallet(currencyId, amount, reason);
        },
        subtractCurrencyFromWallet: function(currencyId, amount, reason) {
            if (amount <= 0) {
                console.log('Amount should be bigger than zero');
                return;
            }
            playerData.updateWallet(currencyId, -amount, reason);
        },
        addItemToInventory: function(itemId, amount, reason) {
            if (amount <= 0) {
                console.log('Amount should be bigger than zero');
                return;
            }
            playerData.updateInventory(itemId, amount, reason);
        },
        subtractItemFromInventory: function(itemId, amount, reason) {
            if (amount <= 0) {
                console.log('Amount should be bigger than zero');
                return;
            }
            playerData.updateInventory(itemId, -amount, reason);
        },
        consumeBundle: function(bundleId, reason) {
            playerData.consumeBundle(bundleId, reason);
        },

        // Listeners
        onPackagesUpdated: function(callback) {
            events.onPackagesUpdated.push(callback);
        },
        onConfigUpdated: function(callback) {
            events.onConfigUpdated.push(callback);
        },
        onGameDataUpdated: function(callback) {
            events.onGameDataUpdated.push(callback);
        },
        onPlayerDataAvailable: function(callback) {
            events.onPlayerDataAvailable.push(callback);
        },
        onPlayerDataUpdated: function(callback) {
            events.onPlayerDataUpdated.push(callback);
        }
    };
    init();
};
