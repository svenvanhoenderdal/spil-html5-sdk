var PlayerItem = require("./PlayerItem");

function Inventory(inventoryData, gameData) {
    this.items = [];
    this.itemsDict = {};
    for (var i = 0; i < inventoryData.items.length; i++) {
        var item = new PlayerItem(inventoryData.items[i], gameData);
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
Inventory.prototype.getLogic = function () {
    return this.logic;
};

module.exports = Inventory;
