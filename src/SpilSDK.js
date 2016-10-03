SpilSDK = function(bundle_id, app_version, callback, environment) {
    var wallet, package,
        steps_to_load = 4,
    init = function() {
        statics = Statics(bundle_id, app_version, environment);
        event_module = Event(statics);
        wallet = Wallet(event_module);
        package = Package(event_module);

        loadScript('https://payments.spilgames.com/static/javascript/spil/payment.client.js', loadCallback);
        loadScript('https://payments.spilgames.com/static/javascript/spil/payment.portal.js', loadCallback);
        SDK_functions.updatePackagesAndPromotion(loadCallback);
        loadCallback();
    },
    send_heartbeat = function() {
        event_module.sendEvent('heartBeat');
    },
    loadCallback = function() {
        steps_to_load--;
        if(steps_to_load === 0) {
            setInterval(send_heartbeat, 1000);
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
    },
    SDK_functions = {
        callWallet: function() {
            wallet.doStuff();
        },
        sendCustomEvent: function(event_name, data) {
            event_module.sendEvent(event_name, data);
        },
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
        onPackagesUpdated: function(callback) {
            events.onPackagesUpdated.push(callback);
        },
    };
    init();
};
