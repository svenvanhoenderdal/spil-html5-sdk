var _events = {};

module.exports = {
    publish: function (eventName, args) {
        if (!_events.hasOwnProperty(eventName)) {
            _events[eventName] = {
                subscribers: [],
                args: args,
                published: true
            };
        }
        var event = _events[eventName];
        for (var i = 0; i < event.subscribers.length; i++) {
            subscriber = event.subscribers[i];
            subscriber.fn(args);
            if (subscriber.hasOwnProperty("once")) {
                _events[eventName].subscribers.splice(i, 1);
            }
        }
        event.args = args;
    },
    subscribe: function (eventName, fn) {
        if (!_events.hasOwnProperty(eventName)) {
            _events[eventName] = {
                subscribers: [],
                published: false
            };
        }
        var event = _events[eventName];
        event.subscribers.push({fn: fn});
        if (event.published) {
            fn(event.args);
        }
    },
    subscribeOnce: function (eventName, fn) {
        if (!_events.hasOwnProperty(eventName)) {
            _events[eventName] = {
                subscribers: [],
                published: false
            };
        }
        var event = _events[eventName],
            key = event.subscribers.push({fn: fn, once: true});

        if (event.published) {
            fn(event.args);
            _events[eventName].subscribers.splice(key, 1);
        }
    }
};
