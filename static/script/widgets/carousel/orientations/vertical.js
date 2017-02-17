/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.orientations.vertical class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/orientations/vertical',
    [
        'antie/class',
        'antie/events/keyevent'
    ],
    /**
     * Class to encapsulate any data specific to a vertical orientation
     * @name antie.widgets.carousel.orientations.Vertical
     * @extends antie.Class
     * @class
     */
    function (Class, KeyEvent) {
        'use strict';
        var Vertical = Class.extend(/** @lends antie.widgets.carousel.orientations.Vertical.prototype */{
            dimension: function () {
                return 'height';
            },
            edge: function () {
                return 'top';
            },
            styleClass: function () {
                return 'vertical';
            },
            defaultKeys: function () {
                return {
                    PREVIOUS: KeyEvent.VK_UP,
                    NEXT: KeyEvent.VK_DOWN
                };
            }
        });

        return new Vertical();
    }
);
