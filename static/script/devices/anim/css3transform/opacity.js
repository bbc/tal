define(
    'antie/devices/anim/css3transform/opacity',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3transform/transition'
    ],
    function (Helpers, Transition) {
        'use strict';

        return function (options) {
            var el = options.el;
            var onTransitionEnd;

            function start () {
                function onComplete () {
                    Transition.clear(el);
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }

                if (Helpers.skipAnim(options)) {
                    Helpers.setStyle(el, 'opacity', options.to.opacity);
                    onComplete();
                    return;
                }

                Transition.set(el, 'opacity', options);
                Helpers.setStyle(el, 'opacity', options.to.opacity);
                onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
            }

            function stop () {
                onTransitionEnd();
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
