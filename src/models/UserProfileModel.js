function UserProfile(_profileData) {
    var profileData = _profileData,
        wallet,
        inventory;

    function init() {
        wallet = profileData.walley;
        inventory = profileData.inventory;
    }

    init();

    return {
        getWallet: function() {
            return wallet;
        },
        getInventory: function() {
            return inventory;
        }
    };
}
