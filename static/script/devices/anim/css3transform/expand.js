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

            function expand(options) {
              var duration = (options.duration || 840) + "ms ";
              var easing = Transition.getEasing(options);
              var props = duration + easing;
              var transition = 'width ' + props + ', height ' + props;
              Helpers.setStyle(el, 'transition', transition, true);
            }

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

                expand(options);
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
