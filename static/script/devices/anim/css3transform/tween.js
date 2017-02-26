define(
    'antie/devices/anim/css3transform/tween',
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
                function triggerReflowFor (element) {
                    element.offsetHeight;
                }

                function setDimensions (dimensions, units) {
                    units = units || {};
                    var defaultUnits = {
                        width: 'px',
                        height: 'px'
                    };

                    Object.keys(dimensions).forEach(function (key) {
                        var unit = units[key] || defaultUnits[key] || '';
                        Helpers.setStyle(el, key, dimensions[key] + unit);
                    });
                }

                function onComplete () {
                    Transition.clear(el);
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }

                if (Helpers.skipAnim(options)) {
                    setDimensions(options.to, options.units);
                    onComplete();
                    return;
                }

                if (options.from) {
                    setDimensions(options.from, options.units);
                    triggerReflowFor(el);
                }

                onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
                Transition.set(el, Object.keys(options.to), options);
                setDimensions(options.to, options.units);
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
