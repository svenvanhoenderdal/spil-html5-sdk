var GameData;

function BundleItem(bundleItemData) {
    GameData = require("../../modules/GameData").SpilSDK;
    this.id = bundleItemData.itemId || bundleItemData.id;
    this.amount = bundleItemData.amount;
}
BundleItem.prototype.getId = function () {
    return this.id;
};
BundleItem.prototype.getAmount = function () {
    return this.amount;
};
BundleItem.prototype.getItem = function () {
    return GameData.getGameData().getItem(this.id);
};
BundleItem.prototype.getObject = function () {
    return {
        id: this.id,
        amount: this.amount
    };
};

module.exports = BundleItem;
