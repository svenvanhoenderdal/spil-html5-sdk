function Shop(shopData) {
    var Tab = require("./Tab");

    this.tabs = [];
    if (!shopData || !shopData.length) {
        return;
    }
    for (i = 0; i < shopData.length; i++) {
        var tab = new Tab(shopData[i]);
        this.tabs.push(tab);
    }
}
Shop.prototype.getTabs = function () {
    return this.tabs;
};

module.exports = Shop;
