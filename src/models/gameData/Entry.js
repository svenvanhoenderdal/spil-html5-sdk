var GameData;

function Entry(entryData) {
    GameData = require("../../modules/GameData").SpilSDK;
    this.bundleId = entryData.bundleId;
    this.label = entryData.label;
    this.position = entryData.position;
}
Entry.prototype.getBundleId = function () {
    return this.bundleId;
};
Entry.prototype.getLabel = function () {
    return this.label;
};
Entry.prototype.getPosition = function () {
    return this.position;
};
Entry.prototype.getBundle = function () {
    return GameData.getGameData().getBundle(this.bundleId);
};

module.exports = Entry;
