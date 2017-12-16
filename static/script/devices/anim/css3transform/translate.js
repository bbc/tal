define(
    'antie/devices/anim/css3transform/translate',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3transform/transition'
    ],
    function (Helpers, Transition) {
        'use strict';

        return function (options, position, property) {
            var el = options.el;
            var onTransitionEnd, cancelledAnimation;
            var propertyTranslateMap = {
                left: 'translate3d({x}px, 0, 0)',
                top: 'translate3d(0, {x}px, 0)'
            };

            function getStyle () {
                var value = parseInt(el.style[property], 10);
                return value || 0;
            }

            function transform () {
                var distance = position - getStyle();
                var translate3d = propertyTranslateMap[property].replace('{x}', distance);
                Transition.set(el, ['transform'], options);
                Helpers.setStyle(el, 'transform', translate3d, true);
            }

            function endTransform () {
                Transition.clear(el);

                if (!cancelledAnimation) {
                    Helpers.setStyle(el, 'transform', '', true);
                    Helpers.setStyle(el, property, position + 'px', false);
                }

                if (options.onComplete) {
                    options.onComplete();
                }
            }

            function start () {
                if (Helpers.skipAnim(options)) {
                    endTransform();
                    return;
                }

                onTransitionEnd = Helpers.registerTransitionEndEvent(el, endTransform);
                transform();
            }

            function stop () {
                cancelledAnimation = true;
                onTransitionEnd();
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
