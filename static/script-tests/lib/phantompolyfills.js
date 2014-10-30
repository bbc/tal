
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