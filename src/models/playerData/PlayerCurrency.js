var Currency = require("../gameData/Currency");
var GameData = require("../../modules/GameData").SpilSDK;
function PlayerCurrency(playerCurrencyData) {
    Currency.call(this, playerCurrencyData);
    var currency = GameData.getGameData().getCurrency(this.id);
    this.name = currency.getName();
    this.type = currency.getType();
    this.currentBalance = playerCurrencyData.currentBalance;
    this.delta = playerCurrencyData.delta;
}
PlayerCurrency.prototype = Object.create(Currency.prototype);
PlayerCurrency.prototype.constructor = PlayerCurrency;

PlayerCurrency.prototype.getCurrentBalance = function () {
    return this.currentBalance;
};
PlayerCurrency.prototype.getDelta = function () {
    return this.delta;
};
PlayerCurrency.prototype.setDelta = function (delta) {
    this.delta = delta;
};

module.exports = PlayerCurrency;
