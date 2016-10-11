var ScriptLoader = require('./ScriptLoader.js');



module.exports = function(callbacks, onFinishCallback){

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

    for(var i=0;i<callbacks.length;i++){

        var callback_config = callbacks[i];

        if(callback_config.callback == 'loadscript'){
            preloadData(ScriptLoader, callback_config.args);
        }else{
            preloadData(callback_config.callback, callback_config.args);
        }

    }

};