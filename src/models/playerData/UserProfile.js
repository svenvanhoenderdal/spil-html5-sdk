
var Wallet = require('./Wallet');
var Inventory = require('./Inventory');

function UserProfile(userProfileData, _gameData) {
    this.wallet = new Wallet(userProfileData.wallet, _gameData);
    this.inventory = new Inventory(userProfileData.inventory, _gameData);
}

UserProfile.prototype.getWallet = function(){
    return this.wallet;
};
UserProfile.prototype.getInventory = function(){
    return this.inventory;
};

module.exports = UserProfile;
