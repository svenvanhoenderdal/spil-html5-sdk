var Event = require('./Event.js'),
    payments = require('./Payments.js'),
    Events = require('../core_modules/Events.js'),
    packages = {},
    promotions = {};

function storePackagesAndPromotions(response_data) {
    packages = {};
    var packages_data = response_data.data.packages;
    for (var i = 0; i < packages_data.length; i++) {
        var package = packages_data[i];
        packages[package.packageId] = package;
    }
    promotions = {};
    var promotions_data = response_data.data.promotions;
    for (i = 0; i < promotions_data.length; i++) {
        var promotion = promotions_data[i];
        promotions[promotion.promotionId] = promotion;
    }
    return packages;
}

module.exports = {
    'SpilSDK': {
        requestPackages: function (callback) {
            Event.sendEvent('requestPackages', {}, function (response_data) {
                data = storePackagesAndPromotions(response_data);
                Events.publish('onPackagesUpdated', data);
                if (callback) {
                    callback(data);
                }
            });
        },
        getAllPackages: function () {
            return packages;
        },
        getPackage: function (package_id) {
            return packages[package_id];
        },
        getPromotion: function (promotion_id) {
            return promotion;
        },
        openPaymentsScreen: function (package_id) {
            Event.sendEvent('prepareWebPayments', {}, function (response_data) {
                console.log(response_data);
                payments.openPaymentsScreen(package_id, response_data.data.referenceNumber);
            });
        },
        onPackagesUpdated:function(callback){
            Events.subscribe('onPackagesUpdated', callback);
        }
    }
};


