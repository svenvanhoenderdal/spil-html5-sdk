function GameDataModel(_gameData) {
    var gameData = _gameData,
        items,
        bundles,
        currencies,
        promotions;

    function init() {
        assignValues = function(source) {
            output = {}
            for (var index in source) {
                var item = source[index];
                output[item.id] = item;
            }
            return output;
        }
        items = assignValues(gameData.items);
        bundles = assignValues(gameData.bundles);
        currencies = assignValues(gameData.currencies);
        promotions = assignValues(gameData.promotions);
    }
    init();

    return {
        getItems: function() {
            return gameData.items;
        },
        getItem: function(itemId){
            return items[itemId] || null;
        },
        getBundles: function() {
            return gameData.bundles;
        },
        getBundle: function(bundleId) {
            return bundles[bundleId] || null;
        },
        getCurrencies: function() {
            return gameData.currencies;
        },
        getCurrency: function(currencyId) {
            return currencies[currencyId] || null;
        },
        getPromotions: function() {
            return gameData.promotions;
        },
        getPromotion: function(promotionId) {
            return promotions[promotionId] || null;
        }
    };
}
