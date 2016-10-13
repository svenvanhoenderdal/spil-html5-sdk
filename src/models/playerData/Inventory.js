function Inventory(inventoryData) {
    var PlayerItem = require("./PlayerItem");
    this.items = [];
    this.itemsDict = {};
    for (var i = 0; i < inventoryData.items.length; i++) {
        var item = new PlayerItem(inventoryData.items[i]);
        this.items.push(item);
        this.itemsDict[item.getId()] = item;
    }
    this.offset = inventoryData.offset;
    this.logic = inventoryData.logic;
}

Inventory.prototype.getItems = function () {
    return this.items;
};
Inventory.prototype.getItem = function (itemId) {
    return this.itemsDict[itemId] || null;
};
Inventory.prototype.getOffset = function () {
    return this.offset;
};
Inventory.prototype.setOffset = function (offset) {
    this.offset = offset;
};
Inventory.prototype.getLogic = function () {
    return this.logic;
};
Inventory.prototype.setLogic = function (logic) {
    this.logic = logic;
};
Inventory.prototype.addItem = function (item) {
    this.items.push(item);
    this.itemsDict[item.getId()] = item;
};
Inventory.prototype.removeItem = function (itemId) {
    var item = this.itemsDict[itemId],
        index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1);
    }
    delete this.itemsDict[itemId];
};


module.exports = Inventory;
