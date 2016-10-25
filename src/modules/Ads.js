var EventUtil = require("./EventUtil");

var adsCallbacks = {
        "AdAvailable": function (adType) {},
        "AdNotAvailable": function (adType) {},
        "AdStart": function (adType) {},
        "AdFinished": function (network, adType, reason) {},
};

module.exports = {
    "SpilSDK": {
        initAds: function (callback) {
            EventUtil.sendEvent("advertisementInit", {}, function (responseData) {
                if(responseData.data != undefined
                    && responseData.data.providers != undefined
                    && responseData.data.providers.DFP != undefined){

                        var SpilData = {
                            id: responseData.data.providers.DFP.adUnitID
                        };

                        GameAPI.loadAPI (function (apiInstance) {
                            if (window.console && window.console.log) {
                                console.log('GameAPI version ' + apiInstance.version + ' loaded!');
                            }
                            callback();
                        }, SpilData);
                }else{
                    callback();
                };

            });
        },
        setAdCallbacks: function (listeners) {
            for (var listenerName in listeners) {
                adsCallbacks[listenerName] = listeners[listenerName];
            }
        },
        RequestRewardVideo: function(){
            GameAPI.GameBreak.isRewardAvailable().then(function(){
                adsCallbacks.AdAvailable('rewardVideo');
            }, function(){
                adsCallbacks.AdNotAvailable('rewardVideo');
            });
        },
        PlayVideo: function(){
            GameAPI.GameBreak.isRewardAvailable().then(function(){
                GameAPI.GameBreak.reward(function(){
                    adsCallbacks.AdStart('rewardVideo');
                }, function(data){
                    reason = 'dismiss';
                    if(data.completed){
                        reason = 'close';
                    }
                    adsCallbacks.AdFinished('DFP', 'rewardVideo', reason);
                })
            });
        }
    }
};
