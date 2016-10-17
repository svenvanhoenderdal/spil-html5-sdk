function Bundle(bundleData) {
    var BundlePrice = require("./BundlePrice");
    var BundleItem = require("./BundleItem");
    this.id = bundleData.id;
    this.name = bundleData.name;
    this.prices = [];
    for (var i = 0; i < bundleData.prices.length; i++) {
        var price = bundleData.prices[i];
        this.prices.push(new BundlePrice(price));
    }
    this.items = [];
    for (i = 0; i < bundleData.items.length; i++) {
        var item = bundleData.items[i];
        this.items.push(new BundleItem(item));
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
Bundle.prototype.getObject = function () {
    result = {
        id: this.id,
        name: this.name,
        prices: [],
        items: []
    };
    for (var i = 0; i < this.prices.length; i++) {
        result.prices.push(this.prices[i].getObject());
    }
    for (i = 0; i < this.items.length; i++) {
        result.items.push(this.items[i].getObject());
    }
    return result;
};

module.exports = Bundle;
