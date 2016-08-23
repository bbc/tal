define(
    'antie/devices/anim/css3transform/transformfactory',
    [
        'antie/devices/anim/css3transform/translatex',
    ],
    function (TranslateX) {
        'use strict';

        return function (options) {
            if (options.to.left) {
                return new TranslateX(options);
            }
        };
    }
);
