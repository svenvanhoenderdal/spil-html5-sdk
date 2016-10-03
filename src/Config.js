function Config(_event) {
    var event = _event,
        config = {},
        storeConfig = function(response_data) {
            config = response_data.data;
            return config;
        };

    return {
        refreshConfig: function(callback) {
            event.sendEvent('requestConfig', {}, function(response_data){
                data = storeConfig(response_data);
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
        }
    };
}