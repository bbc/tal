define(
    'antie/devices/anim/css3transform/animationfactory',
    [
        'antie/devices/anim/css3transform/translate',
        'antie/devices/anim/css3transform/tween'
    ],
    function (Translate, Tween) {
        'use strict';

        return function (options) {
            if (options.to.left !== undefined) {
                return new Translate(options, options.to.left, 'left');
            }
            if (options.to.top !== undefined) {
                return new Translate(options, options.to.top, 'top');
            }
            return new Tween(options);
        };
    }
);
