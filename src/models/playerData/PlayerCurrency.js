var Currency = require("../gameData/Currency");

function PlayerCurrency(playerCurrencyData) {
    var GameData = require("../../modules/GameData").SpilSDK;
    Currency.call(this, playerCurrencyData);
    var currency = GameData.getGameData().getCurrency(this.id);
    this.name = currency.getName();
    this.type = currency.getType();
    this.initialValue = currency.getInitialValue();
    this.currentBalance = playerCurrencyData.currentBalance;
    this.delta = playerCurrencyData.delta;
}
PlayerCurrency.prototype = Object.create(Currency.prototype);
PlayerCurrency.prototype.constructor = PlayerCurrency;

PlayerCurrency.prototype.getCurrentBalance = function () {
    return this.currentBalance;
};
PlayerCurrency.prototype.setCurrentBalance = function (currentBalance) {
    this.currentBalance = currentBalance;
};
PlayerCurrency.prototype.getDelta = function () {
    return this.delta;
};
PlayerCurrency.prototype.setDelta = function (delta) {
    this.delta = delta;
};

module.exports = PlayerCurrency;
