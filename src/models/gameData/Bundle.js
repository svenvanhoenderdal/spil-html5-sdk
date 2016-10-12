var BundlePrice = require("./BundlePrice");
var BundleItem = require("./BundleItem");

function Bundle(itemData, gameData) {
    this.id = itemData.id;
    this.name = itemData.name;
    this.prices = [];
    for (var i = 0; i < itemData.prices.length; i++) {
        var price = itemData.prices[i];
        this.prices.push(new BundlePrice(price, gameData));
    }
    this.items = [];
    for (i = 0; i < itemData.items.length; i++) {
        var item = itemData.items[i];
        this.items.push(new BundleItem(item, gameData));
    }
}
Bundle.prototype.getId = function () {
    return this.id;
};
Bundle.prototype.getName = function () {
    return this.name;
};
Bundle.prototype.getPrices = function () {
    return this.prices;
};
Bundle.prototype.getItems = function () {
    return this.items;
};

module.exports = Bundle;
