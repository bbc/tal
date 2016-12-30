define(
    'antie/devices/anim/css3transform/translate',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3transform/transition'
    ],
    function (Helpers, Transition) {
        'use strict';

        return function (options, position, axis) {
            var el = options.el;
            var onTransitionEnd;

            function getStyle (name) {
                var value = parseInt(el.style[name], 10);
                return value || 0;
            }

            function getDifference (direction) {
                return position - getStyle(direction);
            }

            function transform () {
                Transition.set(el, 'transform', options);
                if (axis === 'X') {
                    Helpers.setStyle(el, 'transform', 'translate3d(' + getDifference('left') + 'px, 0, 0)', true);
                } else {
                    Helpers.setStyle(el, 'transform', 'translate3d(0, ' + getDifference('top') + 'px, 0)', true);
                }
            }

            function endTransform () {
                var axis2Direction = {
                    X: 'left',
                    Y: 'top'
                };

                Helpers.setStyle(el, 'transform', '', true);
                Helpers.setStyle(el, axis2Direction[axis], position + 'px', false);
                Transition.clear(el);

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
                onTransitionEnd();
            }

            return {
                start: start,
                stop: stop
            };
        };
    }
);
