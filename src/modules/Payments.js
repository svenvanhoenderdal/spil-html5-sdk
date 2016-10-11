var Event = require('./Event');

var Utils = require('../core_modules/Utils.js');
var Config = require('../modules/Config.js');

module.exports = {
    openPaymentsScreen: function (packageId, referenceNumber) {
        var client = new PaymentClient(),
            options = {
                'siteId': Utils.getSiteId(),
                'gameId': Config.SpilSDK.getConfigValue('payment_game_id'),
                'userId': Utils.get_uuid(),
                'token': '',
                'params': JSON.stringify({
                    'package_id': packageId,
                    'reference_number': referenceNumber
                }).replace(/"/g, '%22'),
                'dynamic_pricing': 1
            };
        client.showPaymentSelectionScreen(options);
    }

};
