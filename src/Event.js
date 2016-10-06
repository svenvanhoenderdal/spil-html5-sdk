function Event(_statics) {
    var statics = _statics,
        http = null;
    function ajax(method, data, success, failure) {
        if (!http){
            http = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP"): new XMLHttpRequest();
        }

        var self = http;
        self.onreadystatechange = function () {
            if (self.readyState === 4 && self.status >= 200 && self.status < 300){
                var response = JSON.parse(self.responseText);
                success(response);
            }else if (self.readyState === 4) {
                failure(JSON.parse(self.responseText));
            }
        };
        http.open(method, statics.get_url()+'/'+data.name, true);
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
            "uid": statics.get_uuid(),
            "locale": statics.get_locale(),
            "appVersion": statics.get_app_version(),
            "apiVersion": statics.get_api_version(),
            "os": statics.get_os(),
            "osVersion": "0.0.1",
            "deviceModel": "Web",
            "bundleId": statics.get_bundle_id(),
            "timezoneOffset": statics.get_timezone_offset(),
            "tto": statics.get_total_time_open(),
            "sessionId": statics.get_session_id()
        };
    }
    function createEvent(event_name, custom_data) {
        return {
            'name': event_name,
            'data': JSON.stringify(get_event_data()),
            'customData': JSON.stringify(custom_data || {}),
            'ts': statics.get_current_timestamp(false),
            'queued':0
        };
    }

    return {
        sendEvent: function(event_name, data, callback) {
            request_data = createEvent(event_name, data);
            if(!callback) {
                callback = function(response_data) {
                    console.log('Got response from ' + event_name + ': ' + JSON.stringify(response_data));
                };
            }
            ajax('POST', request_data, callback, function(response_data){
                console.log('Ajax request failed: ' + response_data);
            });
        }
    };
}
