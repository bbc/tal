define(
    'antie/devices/anim/css3transform/opacity',
    [
        'antie/devices/anim/shared/helpers'
    ],
    function (Helpers) {
        'use strict';

        return function (options) {
            var el = options.el;
            var onTransitionEnd;

            function start () {
                function onComplete () {
                    // TODO: This doesn't get called for components being displayed for the
                    // TODO: first time and that makes me sad. And probably makes the browser
                    // TODO: sad as well. Why?
                    el.classList.remove('animate');
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }

                // TODO: Element class list gets overwritten if addClass() and removeClass()
                // TODO: are called on its related widget - even if device.addClassToElement()
                // TODO: has been used. SAD! This means the 'animate' class gets removed when
                // TODO: widget.setActiveChildWidget() is called by container.show()
                // TODO: immediately after device.showElement() the first time a component
                // TODO: appears.
                el.classList.add('animate');
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
