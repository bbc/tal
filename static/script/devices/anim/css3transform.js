define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3transform/animationfactory'
    ],
    function (Device, getAnimator) {
        'use strict';

        Device.prototype.moveElementTo = function (options) {
            var animator = getAnimator(options);
            animator.start();
            return options.skipAnim ? null : animator;
        };

        Device.prototype.scrollElementTo = function (options) {
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

        Device.prototype.tweenElementStyle = function (options) {
            var animator = getAnimator(options);
            if (!animator) {
                return;
            }
            animator.start();
            return options.skipAnim ? null : animator;
        };

        Device.prototype.stopAnimation = function (animator) {
            if (animator) {
                animator.stop();
            }
        };

        Device.prototype.showElement = function (options) {
            var fadeOptions = {
                el: options.el,
                to: {
                    opacity: 1
                },
                onComplete: options.onComplete,
                skipAnim: options.skipAnim
            };

            options.el.style.opacity = 0;
            options.el.style.visibility = 'visible';
            return this.tweenElementStyle(fadeOptions);
        };

        Device.prototype.hideElement = function (options) {
            options.el.style.visibility = 'hidden';
            options.el.style.opacity = 0;
            if (options.onComplete) {
                options.onComplete();
            }
        };

        Device.prototype.isAnimationDisabled = function () {
            return false;
        };
    }
);
