define(
    'antie/devices/anim/css3transform/translatex',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        var TRANSLATEX_REGEX = /\.*translateX\((.*)px\)/i;

        return function (options) {
            var el = options.el;
            var position = options.to.left;
            var onTransitionEnd;
            var animationComplete = false;

            function getTranslateXValue () {
                var res = TRANSLATEX_REGEX.exec(el.style.getPropertyValue('transform'));
                if (res) {
                    return parseInt(res[1], 10);
                }
            }

            function startAnimation () {
                if (Helpers.skipAnim(options) || getTranslateXValue() === position) {
                    el.classList.remove('animate');
                    Helpers.setStyle(el, 'transform', 'translateX(' + position + 'px)', true);
                    options.onComplete();
                    animationComplete = true;
                    return;
                }
                el.classList.add('animate');
                onTransitionEnd = Helpers.registerTransitionEndEvent(el, options.onComplete);
                Helpers.setStyle(el, 'transform', 'translateX(' + position + 'px)', true);
            }

            function stopAnimation () {
                options.el.classList.remove('animate');
                onTransitionEnd();
                animationComplete = true;
            }

            return {
                startAnimation: startAnimation,
                stopAnimation: stopAnimation,
                animationIsComplete: function () {
                    return animationComplete;
                }
            };
        };
    }
);
