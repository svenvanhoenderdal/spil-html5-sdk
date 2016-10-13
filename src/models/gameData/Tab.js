var Entry = require("./Entry");

function Tab(tabData) {
    this.entries = []
    for (var i = 0; i < tabData.entries.length; i++) {
        var entry = tabData.entries[i];
        this.entries.push(new Entry(entry));
    }
    this.name = tabData.name;
    this.position = tabData.position;
}
Tab.prototype.getEntries = function () {
    return this.entries;
};
Tab.prototype.getName = function () {
    return this.name;
};
Tab.prototype.getPosition = function () {
    return this.position;
};

module.exports = Tab;
