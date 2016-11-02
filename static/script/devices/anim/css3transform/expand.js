define(
    'antie/devices/anim/css3transform/expand',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options) {
            var onTransitionEnd;
            var onComplete = options.onComplete || function () {};

            var el = options.el;

            function start () {
                if (options.to.width) {
                    Helpers.setStyle(el, 'width', options.to.width + 'px');
                }
                if (options.to.height) {
                    Helpers.setStyle(el, 'height', options.to.height + 'px');
                }

                onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
                el.classList.remove('willChange');
            }

            function stop () {
                el.classList.add('willChange');
                onTransitionEnd();
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
