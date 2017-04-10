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
                    el.classList.remove('animate');
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }

                if (Helpers.skipAnim(options)) {
                    Helpers.setStyle(el, 'opacity', options.to.opacity);
                    onComplete();
                    return;
                }

                /* Run the opacity animation after a 0-ms timeout to tackle the following problems:
                   - 'animate' element class can be overwritten by TAL widget operations running
                     immediately after this method (e.g. setActiveChildWidget() overwrites
                     the element's classes with only the set that the widget knows about).
                     With the timeout, we add the 'animate' class after that stuff happens.
                   - without the timeout, the transitionend event does not run for some elements
                     that have just been added to the page (unclear why).
                   - some fade-ins look different without the timeout. Again, don't know why!
                 */
                setTimeout(function() {
                    el.classList.add('animate');
                    Helpers.setStyle(el, 'opacity', options.to.opacity);
                    onTransitionEnd = Helpers.registerTransitionEndEvent(el, onComplete);
                }, 0);
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
