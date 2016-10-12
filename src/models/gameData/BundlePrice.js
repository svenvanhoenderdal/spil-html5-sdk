function BundlePrice(bundlePriceData, _gameData) {
    this.gameData = _gameData;
    this.currencyId = bundlePriceData.currencyId;
    this.value = bundlePriceData.value;
}
BundlePrice.prototype.getCurrencyId = function() {
    return this.currencyId;
};
BundlePrice.prototype.getValue = function(){
    return this.value;
};
BundlePrice.prototype.getCurrency = function(){
    return this.gameData.getCurrency(this.currencyId);
};

module.exports = BundlePrice;
