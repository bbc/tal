define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice',

        // Static imports
        'antie/devices/anim/noanim'
    ],
    function (Device) {
        'use strict';

        function Transformer (options, device) {
            var VENDOR_PREFIXES = ['-webkit-', '-moz-', '-o-'];
            var TRANSITION_END_EVENTS = ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];
            var TRANSLATEX_REGEX = /\.*translateX\((.*)px\)/i;

            var el = options.el;
            var onTransitionEnd;

            function setStyle (prop, val, prefixed) {
                el.style.setProperty(prop, val);
                if (prefixed) {
                    for (var i = 0, len = VENDOR_PREFIXES.length; i < len; i++) {
                        el.style.setProperty(VENDOR_PREFIXES[i] + prop, val);
                    }
                }
            }

            function skipAnim (options, device) {
                return device.getConfig().animationDisabled || options.skipAnim;
            }

            function addTransitionEvent (callback) {
                for (var i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
                    el.addEventListener(TRANSITION_END_EVENTS[i], callback);
                }
            }

            function removeTransitionEvent (callback) {
                for (var i = 0, len = TRANSITION_END_EVENTS.length; i < len; i++) {
                    el.removeEventListener(TRANSITION_END_EVENTS[i], callback);
                }
            }

            function registerTransitionEndEvent (callback) {
                function onComplete () {
                    callback();
                    removeTransitionEvent(onComplete);
                }
                onTransitionEnd = onComplete;
                addTransitionEvent(onComplete);
            }

            function getTranslateXValue () {
                var res = TRANSLATEX_REGEX.exec(el.style.getPropertyValue('transform'));
                if (res) {
                    return parseInt(res[1], 10);
                }
            }

            function init() {
                if (skipAnim(options, device) || getTranslateXValue() === options.to.left) {
                    el.classList.remove('animate');
                    setStyle('transform', 'translateX(' + options.to.left + 'px)', true);
                    options.onComplete();
                    return;
                }
                el.classList.add('animate');
                registerTransitionEndEvent(options.onComplete);
                setStyle('transform', 'translateX(' + options.to.left + 'px)', true);
            }

            this.stopAnimation = function () {
                el.classList.remove('animate');
                setStyle('transform', 'translateX(' + options.to.left + 'px)', true);
                onTransitionEnd();
            };

            init();
        }

        Device.prototype.moveElementTo = function (options) {
            return new Transformer(options, this);
        };

        Device.prototype.stopAnimation = function (transformer) {
            transformer.stopAnimation();
        };
    }
);
