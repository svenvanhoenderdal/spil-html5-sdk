var BundlePrice = require('./BundlePrice.js');
var BundleItem = require('./BundleItem.js');

function Bundle(itemData, _gameData) {
    this.id = itemData.id;
    this.name = itemData.name;
    this.prices = [];
    for (var i in itemData.prices) {
        var price = itemData.prices[i];
        this.prices.push(new BundlePrice(price, _gameData));
    }
    this.items = [];
    for (i in itemData.items) {
        var item = itemData.items[i];
        this.items.push(new BundleItem(item, _gameData));
    }
}
Bundle.prototype.getId = function() {
    return this.id;
};
Bundle.prototype.getName = function(){
    return this.name;
};
Bundle.prototype.getPrices = function(){
    return this.prices;
};
Bundle.prototype.getItems = function(){
    return this.items;
};

module.exports = Bundle;
