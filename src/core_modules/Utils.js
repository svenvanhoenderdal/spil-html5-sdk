if (typeof Object.assign !== "function") {
    (function () {
        Object.assign = function (target) {
            "use strict";
            // We must check against these specific cases.
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert undefined or null to object");
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

var config = require("./Config")(),
    meta = document.querySelector("meta[property=\"portal:site:id\"]"),
    siteId = (meta === null) ? 186 : meta.getAttribute("content"),
    uuid = null,
    locale = null,
    timezoneOffset = null,
    timestampOpened = null,
    sessionId = null,
    lastEventSent = null,
    bundleId = config.bundleId,
    appVersion = config.appVersion || "0.0.1",
    environment = config.environment || "prd";

module.exports = {
    getSiteId: function () {
        return siteId;
    },
    getCurrentTimestamp: function (convertToSeconds) {
        if (!Date.now) {
            Date.now = function () {
                return new Date().getTime();
            };
        }
        return convertToSeconds ? Date.now() / 1000 | 0 : Date.now();
    },
    generateUuid: function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    getUuid: function () {
        if (!uuid) {
            var UUID_KEY = "uuid";
            uuid = this.getFromStorage(UUID_KEY);

            if (!uuid) {
                uuid = this.generateUuid();
                this.storeInStorage(UUID_KEY, uuid);
            }
        }
        return uuid;
    },
    getLocale: function () {
        if (!locale) {
            locale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
        }
        return locale;
    },
    getAppVersion: function () {
        return appVersion;
    },
    getApiVersion: function () {
        return "0.1.0";
    },
    getOs: function () {
        return "html5";
    },
    getBundleId: function () {
        return bundleId;
    },
    getTimezoneOffset: function () {
        return (timezoneOffset) ? timezoneOffset : new Date().getTimezoneOffset().toString();
    },
    getTotalTimeOpen: function () {
        if (!timestampOpened) {
            timestampOpened = this.getCurrentTimestamp(true);
        }
        return (this.getCurrentTimestamp(true) - timestampOpened).toString();
    },
    getSessionId: function () {
        var currentTime = this.getCurrentTimestamp(true);
        if (!sessionId) {
            sessionId = this.generateUuid();
            lastEventSent = currentTime;
        }
        if (currentTime - lastEventSent > 900) {
            sessionId = this.generateUuid();
            timestampOpened = currentTime;
        }
        lastEventSent = currentTime;
        return sessionId;
    },
    getUrl: function () {
        return "http://api-" + environment + ".sap.dmz.ams1.spil/v1/native-events/event/html5/slottestgame";
    },
    getFromStorage: function (key) {
        if (!localStorage) {
            throw Error("No local storage available!");
        }
        return localStorage.getItem(key);
    },
    storeInStorage: function (key, value) {
        if (!localStorage) {
            throw Error("No local storage available!");
        }
        localStorage.setItem(key, value);
    }
};
