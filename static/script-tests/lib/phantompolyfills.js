
// From https://github.com/ractivejs/ractive/issues/679 by binarykitchen
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var self = this;
    return function () {
        return self.apply(thisp, arguments);
    };
};

this.CustomEvent = this.CustomEvent || function (eventType) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType);
    return event;
};

this.HTMLMediaElement = this.HTMLMediaElement || {
    NETWORK_EMPTY: 0,
    NETWORK_IDLE: 1,
    NETWORK_LOADING: 2,
    NETWORK_NO_SOURCE: 3
};