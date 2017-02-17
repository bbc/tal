/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview A set of polyfills for running tests under PhantomJS.
 */

(function() {
    /* PhantomJS somehow caches references to native-code global functions if they
     * are called more than once without change. Spying on calls to these functions
     * is then impossible, as the code under test always calls the originals
     * rather than the spies that replace them.
     *
     * Details (which suggests this will be fixed in PhantomJS 2.0):
     * https://github.com/ariya/phantomjs/issues/11364
     *
     * Somehow, assigning the window functions we need to spy on to themselves
     * is enough to break the caching behaviour.
     */
    window.addEventListener = window.addEventListener;
    window.removeEventListener = window.removeEventListener;
    window.getComputedStyle = window.getComputedStyle;

    Function.prototype.bind = Function.prototype.bind || function (thisObj) {
        var self = this;
        return function() {
            return self.apply(thisObj);
        };
    };

    window.CustomEvent = window.CustomEvent || function (eventType) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventType);
        return event;
    };

    window.HTMLMediaElement = window.HTMLMediaElement || {
        NETWORK_EMPTY: 0,
        NETWORK_IDLE: 1,
        NETWORK_LOADING: 2,
        NETWORK_NO_SOURCE: 3
    };
})();
