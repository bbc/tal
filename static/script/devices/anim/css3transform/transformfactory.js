define(
    'antie/devices/anim/css3transform/transformfactory',
    [
        'antie/devices/anim/css3transform/translate'
    ],
    function (Translate) {
        'use strict';

        return function (options) {
            if (options.to.left) {
                return new Translate(options, options.to.left, 'X');
            }
            if (options.to.top !== undefined) {
                return new Translate(options, options.to.top, 'Y');
            }
            /*
            if (options.to.height || options.to.width) {

            }
            */
        };
    }
);
