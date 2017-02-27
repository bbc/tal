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
            if (prefixed) {
                for (var i = 0, len = VENDOR_PREFIXES.length; i < len; i++) {
                    var prefix = VENDOR_PREFIXES[i];
                    el.style.setProperty(prefix + prop, val.replace('transform', prefix + 'transform'));
                }
            }
            el.style.setProperty(prop, val);
        }

        function skipAnim (options) {
            return options.skipAnim || RuntimeContext.getDevice().getConfig().animationDisabled;
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
            var onComplete = function (evt) {
                if (!evt || evt.target === el) {
                    removeTransitionEvent(el, onComplete);
                    callback();
                }
            };
            addTransitionEvent(el, onComplete);
            return onComplete;
        }

        return {
            setStyle: setStyle,
            skipAnim: skipAnim,
            registerTransitionEndEvent: registerTransitionEndEvent
        };
    }
);
