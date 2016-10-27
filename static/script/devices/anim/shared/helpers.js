define(
    'antie/devices/anim/shared/helpers',
    [
        'antie/runtimecontext'
    ],
    function (RuntimeContext) {
        'use strict';

        var VENDOR_PREFIXES = ['-webkit-', '-moz-', '-o-'];
        var TRANSITION_END_EVENTS = ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];

        function setStyle (el, prop, val, prefixed) {
            el.style.setProperty(prop, val);
            if (prefixed) {
                for (var i = 0, len = VENDOR_PREFIXES.length; i < len; i++) {
                    el.style.setProperty(VENDOR_PREFIXES[i] + prop, val);
                }
            }
        }

        function skipAnim (options) {
            return RuntimeContext.getDevice().getConfig().animationDisabled || options.skipAnim;
        }

        function addTransitionEvent (el, callback) {
            for (var i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
                el.addEventListener(TRANSITION_END_EVENTS[i], callback);
            }
        }

        function removeTransitionEvent (el, callback) {
            for (var i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
                el.removeEventListener(TRANSITION_END_EVENTS[i], callback);
            }
        }

        function registerTransitionEndEvent (el, callback) {
            var onComplete = function () {
                removeTransitionEvent(el, onComplete);
                callback();
            };
            addTransitionEvent(el, onComplete);
            return onComplete;
        }

        return {
            setStyle: setStyle,
            skipAnim: skipAnim,
            addTransitionEvent: addTransitionEvent,
            removeTransitionEvent: removeTransitionEvent,
            registerTransitionEndEvent: registerTransitionEndEvent
        };
    }
);
