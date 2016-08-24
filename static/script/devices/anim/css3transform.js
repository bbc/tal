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

        Device.prototype.scrollElementTo = function (options) {
            // Stu: Not my fault
            if (new RegExp('_mask$').test(options.el.id)) {
                if(options.el.childNodes.length === 0)  {
                    return null;
                }
                options.el.style.position = 'relative';
                options.el = options.el.childNodes[0];
                options.el.style.position = 'relative';
            } else {
                return null;
            }

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
