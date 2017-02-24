define(
    'antie/devices/anim/css3transform/animationfactory',
    [
        'antie/devices/anim/css3transform/translate',
        'antie/devices/anim/css3transform/expand',
        'antie/devices/anim/css3transform/opacity'
    ],
    function (Translate, Expand, Opacity) {
        'use strict';

        return function (options) {
            if (options.to.left !== undefined) {
                return new Translate(options, options.to.left, 'left');
            }
            if (options.to.top !== undefined) {
                return new Translate(options, options.to.top, 'top');
            }
            if (options.to.height || options.to.width) {
                return new Expand(options);
            }
            if (options.to.opacity !== undefined) {
                return new Opacity(options);
            }
        };
    }
);
