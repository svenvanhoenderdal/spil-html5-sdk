var config = null;

var Config = function(_config){

    config = !_config ? config : _config;

    return config;
};

module.exports = Config;