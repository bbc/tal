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

            function setExpansion () {
                var duration = (options.duration || 840) + 'ms ';
                var easing = Transition.getEasing(options);
                var props = duration + easing;
                var transition = 'width ' + props + ', height ' + props;
                Helpers.setStyle(el, 'transition', transition, true);
            }

            function start () {
                function setDimensions (dimensions, units) {
                    dimensions = dimensions || {};

                    if (dimensions.width !== undefined) {
                        Helpers.setStyle(el, 'width', dimensions.width + (units ? units.width: 'px'));
                    }
                    if (dimensions.height !== undefined) {
                        Helpers.setStyle(el, 'height', dimensions.height + (units ? units.height: 'px'));
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

                setDimensions(options.from, options.units);
                setExpansion();
                el.offsetHeight;
                setDimensions(options.to, options.units);
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
