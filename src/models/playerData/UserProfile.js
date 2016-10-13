function UserProfile(userProfileData) {
    var Wallet = require("./Wallet");
    var Inventory = require("./Inventory");
    this.wallet = new Wallet(userProfileData.wallet);
    this.inventory = new Inventory(userProfileData.inventory);
}

UserProfile.prototype.getWallet = function () {
    return this.wallet;
};
UserProfile.prototype.getInventory = function () {
    return this.inventory;
};

module.exports = UserProfile;
