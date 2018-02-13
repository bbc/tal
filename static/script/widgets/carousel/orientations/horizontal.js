/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.orientations.horizontal class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/orientations/horizontal',
    [
        'antie/class',
        'antie/events/keyevent'
    ],
    /**
     * Class to encapsulate any data specific to a horizontal orientation
     * @name antie.widgets.carousel.orientations.Horizontal
     * @extends antie.Class
     * @class
     */
    function (Class, KeyEvent) {
        'use strict';
        var Horizontal = Class.extend(/** @lends antie.widgets.carousel.orientations.Horizontal.prototype */ {
            dimension: function dimension () {
                return 'width';
            },
            edge: function edge () {
                return 'left';
            },
            styleClass: function styleClass () {
                return 'horizontal';
            },
            defaultKeys: function defaultKeys () {
                return {
                    PREVIOUS: KeyEvent.VK_LEFT,
                    NEXT: KeyEvent.VK_RIGHT
                };
            }
        });

        return new Horizontal();
    }
);
