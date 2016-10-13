var Item = require("../gameData/Item");
var GameData = require("../../modules/GameData").SpilSDK;

function PlayerItem(playerItemData) {
    Item.call(this, playerItemData);
    var item = GameData.getGameData().getItem(this.id);
    this.name = item.getName();
    this.type = item.getType();
    this.amount = playerItemData.amount;
    this.delta = playerItemData.delta;
    this.value = playerItemData.value;
}
PlayerItem.prototype = Object.create(Item.prototype);
PlayerItem.prototype.constructor = PlayerItem;

PlayerItem.prototype.getAmount = function () {
    return this.amount;
};
PlayerItem.prototype.getDelta = function () {
    return this.delta;
};
PlayerItem.prototype.getValue = function () {
    return this.value;
};

module.exports = PlayerItem;
