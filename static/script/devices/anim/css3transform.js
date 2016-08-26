define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3transform/animationfactory',

        // Static imports
        'antie/devices/anim/noanim'
    ],
    function (Device, getAnimator) {
        'use strict';

        Device.prototype.moveElementTo = function (options) {
            options.device = this;
            var animator = getAnimator(options);
            animator.start();
            return options.skipAnim ? null : animator;
        };

        Device.prototype.scrollElementTo = function (options) {
            if (!(/_mask$/.test(options.el.id) && options.el.childNodes.length > 0)) {
                return null;
            }

            options.device = this;
            options.el = options.el.childNodes[0];

            if (options.to.top) {
                options.to.top = parseInt(options.to.top, 10) * -1;
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
    }
);
