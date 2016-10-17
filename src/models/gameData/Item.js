function Item(itemData) {
    this.id = itemData.id;
    this.name = itemData.name;
    this.initialValue = itemData.initialValue;
    this.type = itemData.type;
}
Item.prototype.getId = function () {
    return this.id;
};
Item.prototype.getName = function () {
    return this.name;
};
Item.prototype.getInitialValue = function () {
    return this.initialValue;
};
Item.prototype.getType = function () {
    return this.type;
};
Item.prototype.getObject = function () {
    return {
        id: this.id
    };
};

module.exports = Item;
