var Utils = require("../core_modules/Utils");

function ajax(method, data, success, failure) {
    var http = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status >= 200 && http.status < 300) {
            var response = JSON.parse(http.responseText);
            success(response);
        }else if (http.readyState === 4) {
            failure(JSON.parse(http.responseText));
        }
    };

    http.open(method, Utils.getUrl() + "/" + data.name, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(parseJsonToQuery(data));
}
function parseJsonToQuery(obj) {
    var str = [];
    for (var p in obj) {
        str.push(p + "=" + obj[p]);
    }
    return str.join("&");
}
function getEventData() {
    return {
        "uid": Utils.getUuid(),
        "locale": Utils.getLocale(),
        "appVersion": Utils.getAppVersion(),
        "apiVersion": Utils.getApiVersion(),
        "os": Utils.getOs(),
        "osVersion": "0.0.1",
        "deviceModel": "Web",
        "bundleId": Utils.getBundleId(),
        "timezoneOffset": Utils.getTimezoneOffset(),
        "tto": Utils.getTotalTimeOpen(),
        "sessionId": Utils.getSessionId()
    };
}
function createEvent(eventName, customData) {
    return {
        "name": eventName,
        "data": JSON.stringify(getEventData()),
        "customData": JSON.stringify(customData || {}),
        "ts": Utils.getCurrentTimestamp(false),
        "queued": 0
    };
}

function sendEvent(eventName, data, callback) {
    requestData = createEvent(eventName, data);
    if (!callback) {
        callback = function (responseData) {
            console.log("Got response from " + eventName + ": " + JSON.stringify(responseData));
        };
    }
    ajax("POST", requestData, callback, function (responseData) {
        console.log("Ajax request failed: ");
        console.log(responseData);
    });
}

module.exports = {
    sendEvent: sendEvent,
    "SpilSDK": {
        sendEvent: sendEvent,
        sendCustomEvent: function (eventName, data, callback) {
            sendEvent(eventName, data, callback);
        },
        getUuid: function () {
            return Utils.getUuid();
        }
    }
};
