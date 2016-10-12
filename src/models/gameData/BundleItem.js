function BundleItem(bundleItemData, _gameData) {
    this.gameData = _gameData;
    this.id = bundleItemData.id;
    this.amount = bundleItemData.amount;
}
BundleItem.prototype.getId = function() {
    return this.id;
};
BundleItem.prototype.getAmount = function(){
    return this.amount;
};
BundleItem.prototype.getItem = function(){
    return this.gameData.getItem(this.id);
};

module.exports = BundleItem;
