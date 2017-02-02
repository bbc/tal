define(
    'antie/devices/anim/css3transform/expand',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3transform/transition'
    ],
    function (Helpers, Transition) {
        'use strict';

        return function (options) {
            var onTransitionEnd;
            var el = options.el;

            function start () {
                function setDimensions () {
                    if (options.to.width) {
                        Helpers.setStyle(el, 'width', options.to.width + 'px');
                    }
                    if (options.to.height) {
                        Helpers.setStyle(el, 'height', options.to.height + 'px');
                    }
                }

                function onComplete () {
                    Transition.clear(el);
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }

                if (Helpers.skipAnim(options)) {
                    setDimensions();
                    onComplete();
                    return;
                }

                // TODO: Only set the property that's changing
                Transition.set(el, 'width', options);
                Transition.set(el, 'height', options);
                setDimensions();
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
