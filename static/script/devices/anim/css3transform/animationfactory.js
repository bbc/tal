define(
    'antie/devices/anim/css3transform/animationfactory',
    [
        'antie/devices/anim/css3transform/translate',
        'antie/devices/anim/css3transform/expand'
    ],
    function (Translate, Expand) {
        'use strict';

        return function (options) {
            if (options.to.left) {
                return new Translate(options, options.to.left, 'X');
            }
            if (options.to.top !== undefined) {
                return new Translate(options, options.to.top, 'Y');
            }
            if (options.to.height && options.to.width) {
                return new Expand(options);
            }
        };
    }
);
