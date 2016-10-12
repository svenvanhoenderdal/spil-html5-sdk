var ScriptLoader = require('./ScriptLoader.js');

module.exports = function(actions, onFinishCallback){

    var counter = 0;

    function loadCallback(){
        counter--;

        if(counter == 0){
            onFinishCallback();
        }
    }

    function preloadData(method, args) {
        counter++;
        args = args || [];
        args.push(loadCallback);
        method.apply(this, args);
    }

    for(var i=0;i<actions.length;i++){

        var preload_config = actions[i];

        if(preload_config.action == 'loadscript'){
            preloadData(ScriptLoader, preload_config.args);
        }else{
            preloadData(preload_config.action, preload_config.args);
        }
    }
};