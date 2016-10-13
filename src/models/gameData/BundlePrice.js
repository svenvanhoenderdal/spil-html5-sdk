var GameData = require('../../modules/GameData').SpilSDK;

function BundlePrice(bundlePriceData) {
    this.currencyId = bundlePriceData.currencyId;
    this.value = bundlePriceData.value;
}
BundlePrice.prototype.getCurrencyId = function () {
    return this.currencyId;
};
BundlePrice.prototype.getValue = function () {
    return this.value;
};
BundlePrice.prototype.getCurrency = function (){
    return GameData.getGameData().getCurrency(this.currencyId);
};

module.exports = BundlePrice;
