var PlayerCurrency = require("./PlayerCurrency");

function Wallet(walletData, gameData) {
    this.currencies = [];
    this.currenciesDict = {};
    for (var i = 0; i < walletData.currencies.length; i++) {
        var currency = new PlayerCurrency(walletData.currencies[i], gameData);
        this.currencies.push(currency);
        this.currenciesDict[currency.getId()] = currency;
    }
    this.offset = walletData.offset;
    this.logic = walletData.logic;
}

Wallet.prototype.getCurrencies = function () {
    return this.currencies;
};
Wallet.prototype.getCurrency = function (currencyId) {
    return this.currenciesDict[currencyId] || null;
};
Wallet.prototype.getOffset = function () {
    return this.offset;
};
Wallet.prototype.getLogic = function () {
    return this.logic;
};

module.exports = Wallet;
