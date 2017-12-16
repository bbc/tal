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
            dimension: function dimension () {
                return 'height';
            },
            edge: function edge () {
                return 'top';
            },
            styleClass: function styleClass () {
                return 'vertical';
            },
            defaultKeys: function defaultKeys () {
                return {
                    PREVIOUS: KeyEvent.VK_UP,
                    NEXT: KeyEvent.VK_DOWN
                };
            }
        });

        return new Vertical();
    }
);
