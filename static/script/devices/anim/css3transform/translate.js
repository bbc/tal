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
            var animationComplete = false;

            function setStyle () {
                var translate = axis === 'X' ? 'translateX' : 'translateY';
                Helpers.setStyle(el, 'transform', translate + '(' + position + 'px)', true);
            }

            function start () {
                if (Helpers.skipAnim(options)) {
                    el.classList.remove('animate');
                    setStyle();
                    options.onComplete();
                    animationComplete = true;
                    return;
                }
                el.classList.add('animate');
                onTransitionEnd = Helpers.registerTransitionEndEvent(el, options.onComplete);
                setStyle();
            }

            function stop () {
                options.el.classList.remove('animate');
                onTransitionEnd();
                animationComplete = true;
            }

            return {
                start: start,
                stop: stop,
                animationIsComplete: function () {
                    return animationComplete;
                }
            };
        };
    }
);
