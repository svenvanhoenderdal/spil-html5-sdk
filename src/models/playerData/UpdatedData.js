var PlayerCurrency;
var PlayerItem;

function UpdatedData(updatedData) {
    PlayerCurrency = require("./PlayerCurrency");
    PlayerItem = require("./PlayerItem");

    this.currencies = [];
    this.currenciesDict = {};
    if (updatedData && updatedData.hasOwnProperty("currencies")) {
        this.setCurrencies(updatedData.currencies);
    }
    this.items = [];
    this.itemsDict = {};
    if (updatedData && updatedData.hasOwnProperty("items")) {
        this.setItems(updatedData.items);
    }
}

UpdatedData.prototype.getCurrencies = function () {
    return this.currencies;
};
UpdatedData.prototype.getCurrency = function (currencyId) {
    return this.currenciesDict[currencyId] || null;
};
UpdatedData.prototype.setCurrencies = function (currencies) {
    this.currencies = [];
    this.currenciesDict = {};
    if (!currencies || !currencies.length) {
        return;
    }
    for (var i = 0; i < currencies.length; i++) {
        var currency = new PlayerCurrency(currencies[i]);
        this.currencies.push(currency);
        this.currenciesDict[currency.getId()] = currency;
    }
};
UpdatedData.prototype.addCurrency = function (currency) {
    this.currencies.push(currency);
    this.currenciesDict[currency.getId()] = currency;
};
UpdatedData.prototype.getItems = function () {
    return this.items;
};
UpdatedData.prototype.getItem = function (itemId) {
    return this.itemsDict[itemId] || null;
};
UpdatedData.prototype.setItems = function (items) {
    this.items = [];
    this.itemsDict = {};
    if (!items || !items.length) {
        return;
    }
    for (var j = 0; j < items.length; j++) {
        var item = new PlayerItem(items[j]);
        this.items.push(item);
        this.itemsDict[item.getId()] = item;
    }
};
UpdatedData.prototype.addItem = function (item) {
    this.items.push(item);
    this.itemsDict[item.getId()] = item;
};

module.exports = UpdatedData;
