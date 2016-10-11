var Utils = require('../core_modules/Utils.js');

function ajax(method, data, success, failure) {
    var http = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP"): new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status >= 200 && http.status < 300){
            var response = JSON.parse(http.responseText);
            success(response);
        }else if (http.readyState === 4) {
            failure(JSON.parse(http.responseText));
        }
    };

    http.open(method, Utils.get_url()+'/'+data.name, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(parse_json_to_query(data));
}
function parse_json_to_query(obj) {
    var str = [];
    for(var p in obj) {
        str.push(p + '=' + obj[p]);
    }
    return str.join("&");
}
function get_event_data() {
    return {
        "uid": Utils.get_uuid(),
        "locale": Utils.get_locale(),
        "appVersion": Utils.get_app_version(),
        "apiVersion": Utils.get_api_version(),
        "os": Utils.get_os(),
        "osVersion": "0.0.1",
        "deviceModel": "Web",
        "bundleId": Utils.get_bundle_id(),
        "timezoneOffset": Utils.get_timezone_offset(),
        "tto": Utils.get_total_time_open(),
        "sessionId": Utils.get_session_id()
    };
}
function createEvent(event_name, custom_data) {
    return {
        'name': event_name,
        'data': JSON.stringify(get_event_data()),
        'customData': JSON.stringify(custom_data || {}),
        'ts': Utils.get_current_timestamp(false),
        'queued':0
    };
}

function sendEvent(event_name, data, callback) {
    request_data = createEvent(event_name, data);
    if(!callback) {
        callback = function(response_data) {
            console.log('Got response from ' + event_name + ': ' + JSON.stringify(response_data));
        };
    }
    ajax('POST', request_data, callback, function(response_data){
        console.log('Ajax request failed: ');
        console.log(response_data)
    });
}

module.exports = {
    sendEvent: sendEvent,
    'SpilSDK': {
        sendEvent: sendEvent,
        sendCustomEvent: function(event_name, data, callback) {
            sendEvent(event_name, data, callback);
        }
    }
};
