define(
    'antie/devices/anim/css3transform/transition',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3/easinglookup'
    ],
    function (Helpers, EasingLookup) {
        'use strict';

        var easingLookup = new EasingLookup();

        function getEasing(options) {
            var easing = options.easing || 'easeFromTo';
            return easingLookup[easing];
        }

        function set (el, property, options) {
            var duration = options.duration || 840;
            var transition = property + ' ' + duration + 'ms ' + getEasing(options);
            Helpers.setStyle(el, 'transition', transition, true);
        }

        function clear (el) {
            Helpers.setStyle(el, 'transition', '', true);
        }

        return {
            getEasing: getEasing,
            set: set,
            clear: clear
        };
    }
);
