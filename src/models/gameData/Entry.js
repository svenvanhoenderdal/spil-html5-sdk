function Entry(entryData, _gameData) {
    this.gameData = _gameData;
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
    return this.gameData.getBundle(this.bundleId);
};

module.exports = Entry;
