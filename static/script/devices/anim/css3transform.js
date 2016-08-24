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
            transformer.startAnimation();
            return transformer.animationIsComplete () ? null : transformer;
        };

        Device.prototype.stopAnimation = function (transformer) {
            transformer && transformer.stopAnimation();
        };
    }
);
