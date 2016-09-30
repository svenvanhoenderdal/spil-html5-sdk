function Package(_event) {
    var event = _event,
        payments = Payments(),
        packages = {},
        promotions = {},
    storePackagesAndPromotions = function(response_data) {
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
    };
    return {
        updatePackagesAndPromotion: function(callback) {
            event.sendEvent('requestPackages', {}, function(response_data){
                data = storePackagesAndPromotions(response_data);
                if (callback) {
                    callback(data);
                }
            });
        },
        getAllPackages: function() {
            return packages;
        },
        getPackage: function(package_id) {
            return packages[package_id];
        },
        getPromotion: function(promotion_id) {
            return promotion;
        },
        openPaymentsScreen: function(package_id) {
            event.sendEvent('prepareWebPayments', {}, function(response_data) {
                console.log(response_data);
                payments.openPaymentsScreen(package_id, response_data.data.referenceNumber);
            });
        }
    };
}
