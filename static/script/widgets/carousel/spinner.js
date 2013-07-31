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

require.def('antie/widgets/carousel/spinner',
    [
        'antie/class'
    ],
    function (Class) {
        "use strict";
        /**
         * The Carousel widget extends the container widget to manage a carousel of any orientation
         * @name antie.widgets.carousel.spinner
         * @class
         * @extends antie.widgets.Class

         */
        var Spinner;
        Spinner = Class.extend(/** @lends antie.Class.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function (device, mask, orientation) {
                this._device = device;
                this._mask = mask;
                this._orientation = orientation;
            },

            moveContentsTo: function (relativePixels, animOptions) {
                var destination, moveElementOptions;
                destination = {};
                moveElementOptions = {};
                destination[this._getEdge()] = relativePixels;
                moveElementOptions.el = this._mask.getWidgetStrip().outputElement;
                moveElementOptions.to = destination;
                moveElementOptions.duration = 150;
                moveElementOptions.easing = 'linear';
                if (animOptions && animOptions.onComplete) {
                    moveElementOptions.onComplete = animOptions.onComplete;
                }
                if (animOptions && animOptions.skipAnim) {
                    moveElementOptions.skipAnim = animOptions.skipAnim;
                }

                this._device.moveElementTo(moveElementOptions);
            },

            _getEdge: function () {
                return this._orientation.edge();
            }
        });

        return Spinner;
    }
);
