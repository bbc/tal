define(
    'antie/devices/anim/css3transform/opacity',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options) {
            var el = options.el;

            function start () {
                Helpers.setStyle(el, 'opacity', options.to.opacity);

                if (options.onComplete) {
                    options.onComplete();
                }
            }

            function stop () {
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
