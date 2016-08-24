define(
    'antie/devices/anim/css3transform/translate',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        var TRANSLATE_REGEX = /\.*translate[XY]\((.*)px\)/i;

        return function (options, position, axis) {
            var el = options.el;
            var onTransitionEnd;
            var animationComplete = false;

            function getTranslateValue () {
                var res = TRANSLATE_REGEX.exec(el.style.getPropertyValue('transform'));
                if (res) {
                    return parseInt(res[1], 10);
                }
            }

            function setStyle () {
                var translate = 'translateX';
                if (axis === 'Y') {
                    translate = 'translateY';
                    position = '-' + position;
                }
                Helpers.setStyle(el, 'transform', translate + '(' + position + 'px)', true);
            }

            function startAnimation () {
                if (Helpers.skipAnim(options) || getTranslateValue() === position) {
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
