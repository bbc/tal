define(
    'antie/devices/anim/css3transform/expand',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options) {
            var el = options.el;

            function start () {
                if (options.to.width) {
                    Helpers.setStyle(el, 'width', options.to.width + 'px');
                }
                if (options.to.height) {
                    Helpers.setStyle(el, 'height', options.to.height + 'px');
                }
                el.classList.remove('willChange');
            }

            function stop () {
                el.classList.add('willChange');
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
