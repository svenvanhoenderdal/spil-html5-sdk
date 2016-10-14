var Item, Bundle, Currency, Promotion, Tab;
function GameData(gameData) {
    Item = require("./Item");
    Bundle = require("./Bundle");
    Currency = require("./Currency");
    Promotion = require("./Promotion");
    Tab = require("./Tab");

    this.setItems(gameData.items);
    this.setBundles(gameData.bundles);
    this.setCurrencies(gameData.currencies);
    this.setPromotions(gameData.promotions);
    this.setShop(gameData.shop);
}

GameData.prototype.getItems = function () {
    return this.items;
};
GameData.prototype.setItems = function (items) {
    this.items = [];
    this.itemsDict = {};
    if (!items || !items.length){
        return;
    }
    for (var i = 0; i < items.length; i++) {
        var item = new Item(items[i]);
        this.items.push(item);
        this.itemsDict[item.getId()] = item;
    }
};
GameData.prototype.getItem = function (itemId) {
    return this.itemsDict[itemId] || null;
};
GameData.prototype.getBundles = function () {
    return this.bundles;
};
GameData.prototype.setBundles = function (bundles) {
    this.bundles = [];
    this.bundlesDict = {};
    for (i = 0; i < bundles.length; i++) {
        var bundle = new Bundle(bundles[i]);
        this.bundles.push(bundle);
        this.bundlesDict[bundle.getId()] = bundle;
    }
};
GameData.prototype.getBundle = function (bundleId) {
    return this.bundlesDict[bundleId] || null;
};
GameData.prototype.getCurrencies = function () {
    return this.currencies;
};
GameData.prototype.setCurrencies = function (currencies) {
    this.currencies = [];
    this.currenciesDict = {};
    for (i = 0; i < currencies.length; i++) {
        var currency = new Currency(currencies[i]);
        this.currencies.push(currency);
        this.currenciesDict[currency.getId()] = currency;
    }
}
GameData.prototype.getCurrency = function (currencyId) {
    return this.currenciesDict[currencyId] || null;
};
GameData.prototype.getPromotions = function () {
    return this.promotions;
};
GameData.prototype.setPromotions = function (promotions) {
    this.promotions = [];
    this.promotionsDict = {};
    for (i = 0; i < promotions.length; i++) {
        var promotion = new Promotion(promotions[i]);
        this.promotions.push(promotion);
        this.promotionsDict[promotion.getBundleId()] = promotion;
    }
};
GameData.prototype.getPromotion = function (promotionId) {
    return this.promotionsDict[promotionId] || null;
};
GameData.prototype.getShop = function () {
    return this.shop;
};
GameData.prototype.setShop = function (shop) {
    this.shop = [];
    for (i = 0; i < shop.length; i++) {
        var tab = new Tab(shop[i]);
        this.shop.push(tab);
    }
};
GameData.prototype.updateGameData = function (gameData) {
    return this.shop;
};

module.exports = GameData;
