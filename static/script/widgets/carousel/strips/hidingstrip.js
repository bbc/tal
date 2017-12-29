/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.hidingstrip class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/widgets/carousel/strips/hidingstrip',
    [
        'antie/widgets/carousel/strips/cullingstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext',
        'antie/widgets/carousel/strips/utility/visibilitystates'
    ],
    function (CullingStrip, WidgetContext, VISIBILITY_STATES) {
        'use strict';
        var HidingStrip;
        /**
         * A container for the widgets displayed within a carousel, in which widgets are only created when they
         * come into view, and that sets widgets to visibility: hidden and opacity: 0 when they go out of view
         * @name antie.widgets.carousel.strips.HidingStrip
         * @class
         * @extends antie.widgets.carousel.strips.CullingStrip
         * @param {String} id The unique ID of the widget.
         * @param {Object} orientation an object representing the strip's orientation.
         * One of antie.widgets.carousel.orientations.Horizontal or antie.widgets.carousel.orientations.Vertical
         */
        HidingStrip = CullingStrip.extend(/** @lends antie.widgets.carousel.strips.HidingStrip.prototype */{
            createContext: function createContext (widget, parent) {
                return new WidgetContext(widget, parent, VISIBILITY_STATES);
            }
        });
        return HidingStrip;
    }
);
