var GameData;

function BundleItem(bundleItemData) {
    GameData = require("../../modules/GameData").SpilSDK;
    this.id = bundleItemData.id;
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

module.exports = BundleItem;
