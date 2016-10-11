if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            // We must check against these specific cases.
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

var Config = require('./Config.js')();

var uuid = null,
    locale = null,
    timezone_offset = null,
    timestamp_opened = null,
    session_id = null,
    last_event_sent = null,
    bundle_id = Config.bundle_id,
    app_version = Config.app_version || '0.0.1',
    environment = Config.environment || 'prd';

module.exports = {
    get_current_timestamp: function(convert_to_seconds) {
        if (!Date.now) {
            Date.now = function() {
                return new Date().getTime();
            };
        }
        return convert_to_seconds ? Date.now() / 1000 | 0 : Date.now();
    },
    generate_uuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    get_uuid: function () {
        if (!uuid) {
            var UUID_KEY = 'uuid';
            if (!localStorage) {
                throw Error('No local storage available!');
            }
            uuid = localStorage.getItem(UUID_KEY);
            if (!uuid) {
                uuid = this.generate_uuid();
                localStorage.setItem(UUID_KEY, uuid);
            }
        }
        return uuid;
    },
    get_locale: function () {
        if (!locale) {
            locale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
        }
        return locale;
    },
    get_app_version: function () {
        return app_version;
    },
    get_api_version: function () {
        return '0.1.0';
    },
    get_os: function () {
        return 'html5';
    },
    get_bundle_id: function () {
        return bundle_id;
    },
    get_timezone_offset: function () {
        if (!timezone_offset) {
            timezone_offset = new Date().getTimezoneOffset().toString();
        }
        return timezone_offset;
    },
    get_total_time_open: function () {
        if (!timestamp_opened) {
            timestamp_opened = this.get_current_timestamp(true);
        }
        return (this.get_current_timestamp(true) - timestamp_opened).toString();
    },
    get_session_id:function () {
        var current_time = this.get_current_timestamp(true);
        if (!session_id) {
            session_id = this.generate_uuid();
            last_event_sent = current_time;
        }
        if (current_time - last_event_sent > 900) {
            session_id = this.generate_uuid();
        }
        last_event_sent = current_time;
        return session_id;
    },
    get_url: function() {
        return "http://api-" + environment + ".sap.dmz.ams1.spil/v1/native-events/event/html5/slottestgame";
    }

};