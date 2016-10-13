var BundlePrice = require("./BundlePrice");

function Promotion(promotionData, _gameData) {
    this.bundleId = promotionData.bundleId;
    this.amount = promotionData.amount;
    this.discount = promotionData.discount;
    this.startDate = promotionData.startDate;
    this.endDate = promotionData.endDate;

    this.prices = [];
    for (var i = 0; i < promotionData.prices.length; i++) {
        var price = promotionData.prices[i];
        this.prices.push(new BundlePrice(price, _gameData));
    }
}
Promotion.prototype.getBundleId = function () {
    return this.bundleId;
};
Promotion.prototype.getAmount = function () {
    return this.amount;
};
Promotion.prototype.getPrices = function () {
    return this.prices;
};
Promotion.prototype.getDiscount = function () {
    return this.discount;
};
Promotion.prototype.getStartDate = function () {
    return this.startDate;
};
Promotion.prototype.getEndDate = function () {
    return this.endDate;
};
Promotion.prototype.getBundle = function () {
    return this.gameData.getBundle(this.bundleId);
};

module.exports = Promotion;
