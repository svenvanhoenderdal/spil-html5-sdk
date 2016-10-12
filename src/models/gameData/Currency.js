function Currency(currencyData) {
    this.id = currencyData.id;
    this.name = currencyData.name;
    this.initialValue = currencyData.initialValue;
    this.type = currencyData.type;
}
Currency.prototype.getId = function () {
    return this.id;
};
Currency.prototype.getName = function () {
    return this.name;
};
Currency.prototype.getInitialValue = function () {
    return this.initialValue;
};
Currency.prototype.getType = function () {
    return this.type;
};

module.exports = Currency;
