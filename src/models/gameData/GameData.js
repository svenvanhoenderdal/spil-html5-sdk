var Item = require('./Item');
var Bundle = require('./Bundle');
var Currency = require('./Currency');
var Promotion = require('./Promotion');
var Tab = require('./Tab');

function GameData(gameData) {
    this.items = [];
    this.itemsDict = {};
    for (var i = 0; i < gameData.items.length; i++) {
        var item = new Item(_gameData.items[i]);
        this.items.push(item);
        this.itemsDict[item.getId()] = item;
    }
    this.bundles = [];
    this.bundlesDict = {};
    for (i = 0; i < gameData.bundles.length; i++) {
        var bundle = new Bundle(_gameData.bundles[i], this);
        this.bundles.push(bundle);
        this.bundlesDict[bundle.getId()] = bundle;
    }
    this.currencies = [];
    this.currenciesDict = {};
    for (i = 0; i < gameData.currencies.length; i++) {
        var currency = new Currency(_gameData.currencies[i]);
        this.currencies.push(currency);
        this.currenciesDict[currency.getId()] = currency;
    }
    this.promotions = [];
    this.promotionsDict = {};
    for (i = 0; i < gameData.promotions.length; i++) {
        var promotion = new Promotion(_gameData.promotions[i], this);
        this.promotions.push(promotion);
        this.promotionsDict[promotion.getBundleId()] = promotion;
    }
    this.shop = []
    for (i = 0; i < gameData.shop.length; i++) {
        var tab = new Tab(_gameData.shop[i], this)
        this.shop.push(tab);
    }
}

GameData.prototype.getItems = function() {
    return this.items;
};
GameData.prototype.getItem = function(itemId){
    return this.itemsDict[itemId] || null;
};
GameData.prototype.getBundles = function() {
    return this.bundles;
};
GameData.prototype.getBundle = function(bundleId) {
    return this.bundlesDict[bundleId] || null;
};
GameData.prototype.getCurrencies = function() {
    return this.currencies;
};
GameData.prototype.getCurrency = function(currencyId) {
    return this.currenciesDict[currencyId] || null;
};
GameData.prototype.getPromotions = function() {
    return this.promotions;
};
GameData.prototype.getPromotion = function(promotionId) {
    return this.promotionsDict[promotionId] || null;
};
GameData.prototype.getShop = function() {
    return this.shop;
};

module.exports = GameData;
