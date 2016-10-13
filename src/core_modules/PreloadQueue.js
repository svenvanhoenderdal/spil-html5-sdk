var ScriptLoader = require("./ScriptLoader");

module.exports = function (actions, onFinishCallback) {

    var counter = 0;

    function loadCallback() {
        counter--;

        if (counter === 0) {
            onFinishCallback();
        }
    }

    function preloadData(method, args) {
        counter++;
        args = args || [];
        args.push(loadCallback);
        method.apply(this, args);
    }

    for (var i = 0; i < actions.length; i++) {

        var preloadConfig = actions[i];

        if (preloadConfig.action === "loadscript") {
            preloadData(ScriptLoader, preloadConfig.args);
        }else {
            preloadData(preloadConfig.action, preloadConfig.args);
        }
    }
};
