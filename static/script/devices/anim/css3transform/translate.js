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

            function setStyle () {
                var translate = axis === 'X' ? 'translateX' : 'translateY';
                Helpers.setStyle(el, 'transform', translate + '(' + position + 'px)', true);
            }

            function start () {
                if (Helpers.skipAnim(options)) {
                    el.classList.remove('animate');
                    setStyle();
                    options.onComplete();
                    return;
                }
                setTimeout(function () {
                    el.classList.add('animate');
                    onTransitionEnd = Helpers.registerTransitionEndEvent(el, options.onComplete);
                    setStyle();
                }, 0);
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
