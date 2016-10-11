var Event = require('./Event');

module.exports = {
    'SpilSDK': {
        openPaymentsScreen: function (package_id, reference_number) {
            var client = new PaymentClient(),
                options = {
                    'siteId': 1,
                    'gameId': 2,
                    'userId': 'Little.Bear',
                    'token': 'example-token-1234',
                    'params': 'package_id=' + package_id + '&reference_number=' + reference_number,
                    'selectedSku': 'Coins',
                    'dynamic_pricing': 1
                };
            client.showPaymentSelectionScreen(options);
        }
    }
};
