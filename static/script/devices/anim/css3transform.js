define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3transform/transformfactory',

        // Static imports
        'antie/devices/anim/noanim'
    ],
    function (Device, getTransformer) {
        'use strict';

        Device.prototype.moveElementTo = function (options) {
            options.device = this;
            var transformer = getTransformer(options);
            transformer.start();
            return transformer.animationIsComplete () ? null : transformer;
        };

        Device.prototype.scrollElementTo = function (options) {
            if (!(/_mask$/.test(options.el.id) && options.el.childNodes.length > 0)) {
                return null;
            }

            options.device = this;
            options.el = options.el.childNodes[0];

            if (options.to.top) {
                options.to.top = parseInt(options.to.top) * -1;
            }

            var transformer = getTransformer(options);
            transformer.start();
            return transformer.animationIsComplete () ? null : transformer;
        };

        Device.prototype.stopAnimation = function (transformer) {
            transformer && transformer.stop();
        };

        /*
        Device.prototype.tweenElementStyle = function (options) {
            var transformer = getTransformer(options);
            transformer.start();
        };
        */
    }
);
