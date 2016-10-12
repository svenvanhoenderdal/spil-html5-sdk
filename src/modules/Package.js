var EventUtil = require("./EventUtil");
var Payments = require("./Payments");
var Events = require("../core_modules/Events");

var packages = {},
    packagesData = [],
    promotions = {};

function storePackagesAndPromotions(responseData) {
    packages = {};
    packagesData = responseData.data.packages;
    for (var i = 0; i < packagesData.length; i++) {
        var package = packagesData[i];
        packages[package.packageId] = package;
    }
    promotions = {};
    var promotionsData = responseData.data.promotions;
    for (i = 0; i < promotionsData.length; i++) {
        var promotion = promotionsData[i];
        promotions[promotion.promotionId] = promotion;
    }
    return packages;
}

module.exports = {
    "SpilSDK": {
        requestPackages: function (callback) {
            EventUtil.sendEvent("requestPackages", {}, function (responseData) {
                data = storePackagesAndPromotions(responseData);
                Events.publish("onPackagesUpdated", data);
                if (callback) {
                    callback(data);
                }
            });
        },
        getAllPackages: function () {
            return packagesData;
        },
        getPackage: function (packageId) {
            return packages[packageId] || null;
        },
        getPromotion: function (packageId) {
            return promotions[packageId] || null;
        },
        openPaymentsScreen: function (packageId) {
            EventUtil.sendEvent("prepareWebPayments", {}, function (responseData) {
                Payments.openPaymentsScreen(packageId, responseData.data.referenceNumber);
            });
        },
        onPackagesUpdated: function (callback) {
            Events.subscribe("onPackagesUpdated", callback);
        }
    }
};


