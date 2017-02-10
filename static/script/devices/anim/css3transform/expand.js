define(
    'antie/devices/anim/css3transform/expand',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options) {
            var onTransitionEnd;
            var el = options.el;

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
                    el.classList.remove('animate');
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
                // Avoid the 'animate' class being overwritten by TAL if any widget-class methods are called after animating. Sigh...
                el.offsetHeight;
                el.classList.add('animate');
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
