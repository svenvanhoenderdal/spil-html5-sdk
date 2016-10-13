
var Wallet = require("./Wallet");
var Inventory = require("./Inventory");

function UserProfile(userProfileData, gameData) {
    this.wallet = new Wallet(userProfileData.wallet, gameData);
    this.inventory = new Inventory(userProfileData.inventory, gameData);
}

UserProfile.prototype.getWallet = function () {
    return this.wallet;
};
UserProfile.prototype.getInventory = function () {
    return this.inventory;
};

module.exports = UserProfile;
