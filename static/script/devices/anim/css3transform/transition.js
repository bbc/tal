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

        function set (el, properties, options) {
            var duration = (options.duration || 840) + 'ms ';
            var easing = getEasing(options);
            var transitions = properties.map(function (property) {
                return property + ' ' + duration + easing;
            }).join(',');
            Helpers.setStyle(el, 'transition', transitions, true);
        }

        function clear (el) {
            Helpers.setStyle(el, 'transition', '', true);
        }

        return {
            set: set,
            clear: clear
        };
    }
);
