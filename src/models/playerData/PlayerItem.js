var Item = require('../gameData/Item.js');

function PlayerItem(playerItemData, _gameData) {
    Item.call(this, playerItemData);
    var item = _gameData.getItem(this.id);
    this.name = item.getName();
    this.type = item.getType();
    this.amount = playerItemData.amount;
    this.delta = playerItemData.delta;
    this.value = playerItemData.value;
}
PlayerItem.prototype = Object.create(Item.prototype);
PlayerItem.prototype.constructor = PlayerItem;

PlayerItem.prototype.getAmount = function(){
    return this.amount;
};
PlayerItem.prototype.getDelta = function(){
    return this.delta;
};
PlayerItem.prototype.getValue = function(){
    return this.value;
};

module.exports = PlayerItem;
