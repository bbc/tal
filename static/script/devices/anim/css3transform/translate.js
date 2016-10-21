define(
    'antie/devices/anim/css3transform/translate',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options, position, axis) {
            var el = options.el;
            var onTransitionEnd;

            function transform () {
                if (axis === 'X') {
                    Helpers.setStyle(el, 'transform', 'translate3d(' + position + 'px, 0, 0)', true);
                } else {
                    Helpers.setStyle(el, 'transform', 'translate3d(0, ' + position + 'px, 0)', true);
                }
            }

            function start () {
                if (Helpers.skipAnim(options)) {
                    el.classList.remove('animate');
                    transform();
                    options.onComplete();
                    return;
                }

                el.classList.add('animate');
                onTransitionEnd = Helpers.registerTransitionEndEvent(el, options.onComplete);
                transform();
            }

            function stop () {
                el.classList.remove('animate');
                onTransitionEnd();
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
