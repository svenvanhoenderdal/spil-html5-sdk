function UpdatedData(updatedData) {
    var PlayerCurrency = require("./PlayerCurrency");
    var PlayerItem = require("./PlayerItem");
    this.currencies = [];
    this.currenciesDict = {};
    if (updatedData && "currencies" in updatedData) {
        for (var i = 0; i < updatedData.currencies.length; i++) {
            var currency = new PlayerCurrency(updatedData.currencies[i]);
            this.currencies.push(currency);
            this.currenciesDict[currency.getId()] = currency;
        }
    }
    this.items = [];
    this.itemsDict = {};
    if (updatedData && updatedData.hasOwnProperty("items")) {
        for (var j = 0; j < updatedData.items.length; j++) {
            var item = new PlayerItem(updatedData.items[j]);
            this.items.push(item);
            this.itemsDict[item.getId()] = item;
        }
    }
}

UpdatedData.prototype.getCurrencies = function () {
    return this.currencies;
};
UpdatedData.prototype.getCurrency = function (currencyId) {
    return this.currenciesDict[currencyId] || null;
};
UpdatedData.prototype.setCurrencies = function (currencies) {
    this.currencies = currencies;
};
UpdatedData.prototype.getItems = function () {
    return this.items;
};
UpdatedData.prototype.getItem = function (itemId) {
    return this.itemsDict[itemId] || null;
};
UpdatedData.prototype.setItems = function (items) {
    this.items = items;
};

module.exports = UpdatedData;
