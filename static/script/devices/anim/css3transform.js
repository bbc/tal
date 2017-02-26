define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3transform/animationfactory'
    ],
    function (Device, getAnimator) {
        'use strict';

        function assignMethodsTo (target) {
            target.moveElementTo = function (options) {
                var animator = getAnimator(options);
                animator.start();
                return options.skipAnim ? null : animator;
            };

            target.scrollElementTo = function (options) {
                if (!(/_mask$/.test(options.el.id) && options.el.childNodes.length > 0)) {
                    return null;
                }

                options.el = options.el.childNodes[0];

                if (options.to.top) {
                    options.to.top = parseInt(options.to.top, 10) * -1;
                }
                if (options.to.left) {
                    options.to.left = parseInt(options.to.left, 10) * -1;
                }

                var animator = getAnimator(options);
                animator.start();
                return options.skipAnim ? null : animator;
            };

            target.tweenElementStyle = function (options) {
                var animator = getAnimator(options);
                if (!animator) {
                    return;
                }
                animator.start();
                return options.skipAnim ? null : animator;
            };

            target.stopAnimation = function (animator) {
                if (animator) {
                    animator.stop();
                }
            };

            target.showElement = function (options) {
                var fadeOptions = {
                    el: options.el,
                    to: {
                        opacity: 1
                    },
                    from: {
                        opacity: 0
                    },
                    duration: options.duration,
                    easing: options.easing || 'linear',
                    onComplete: options.onComplete,
                    skipAnim: options.skipAnim
                };

                options.el.style.visibility = 'visible';
                return this.tweenElementStyle(fadeOptions);
            };

            target.hideElement = function (options) {
                function onComplete () {
                    options.el.style.visibility = 'hidden';
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }
                var fadeOptions = {
                    el: options.el,
                    to: {
                        opacity: 0
                    },
                    duration: options.duration,
                    easing: options.easing || 'linear',
                    onComplete: onComplete,
                    skipAnim: options.skipAnim
                };

                return this.tweenElementStyle(fadeOptions);
            };

            target.isAnimationDisabled = function () {
                return false;
            };
        }

        assignMethodsTo(Device.prototype);

        return {
            // Allows for easier unit testing
            assignMethodsTo: assignMethodsTo
        };
    }
);
