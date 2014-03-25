/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */
require.def('antie/widgets/carousel/strips/hidingstrip',
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
            createContext: function (widget, parent) {
                return new WidgetContext(widget, parent, VISIBILITY_STATES);
            }
        });
        return HidingStrip;
    }
);