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
            var whitelistWithDefaultUnits = {
                width: 'px',
                height: 'px',
                opacity: ''
            };

            function start () {
                function triggerReflowFor (element) {
                    element.offsetHeight;
                }

                function filterDimensionKeys (dimensions) {
                    dimensions = dimensions || {};
                    return Object.keys(dimensions).filter(function (dimension) {
                        return whitelistWithDefaultUnits[dimension] !== undefined;
                    });
                }

                function setDimensions (dimensions, units) {
                    units = units || {};
                    var filteredDimensionKeys = filterDimensionKeys(dimensions);

                    filteredDimensionKeys.forEach(function (key) {
                        var unit = units[key] || whitelistWithDefaultUnits[key];
                        Helpers.setStyle(el, key, dimensions[key] + unit);
                    });
                    return filteredDimensionKeys.length > 0;
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

                if (setDimensions(options.from, options.units)) {
                    triggerReflowFor(el);
                }

                onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
                Transition.set(el, filterDimensionKeys(options.to), options);
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
