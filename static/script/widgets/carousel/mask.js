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
require.def('antie/widgets/carousel/mask',
    [
        'antie/widgets/container',
        'antie/widgets/carousel/spinner'
    ],
    function (Container, Spinner) {
        "use strict";
        /**
         * @name antie.widgets.carousel.mask
         * @class
         * @extends antie.widgets.Container

         */
        var Mask;
        Mask = Container.extend(/** @lends antie.Container.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function (id, widgetStrip, orientation) {
                this._super(id);
                this.addClass(orientation.styleClass());
                this._orientation = orientation;
                this.addClass('carouselmask');
                this.setWidgetStrip(widgetStrip);
                this._alignmentPoint = 0;
                this._spinner = new Spinner(this.getCurrentApplication().getDevice(), this, orientation);
            },

            alignToIndex: function (index, options) {
                var distanceContentsMustMoveBack = this._widgetStrip.getLengthToIndex(index);
                distanceContentsMustMoveBack -= this._alignmentPoint;
                this._moveContentsTo(-distanceContentsMustMoveBack, options);
            },

            setAlignPoint: function (pixelsFromEdge) {
                this._alignmentPoint = pixelsFromEdge;
            },

            getWidgetStrip: function () {
                return this._widgetStrip;
            },

            setWidgetStrip: function (widgetStrip) {
                if (this._widgetStrip) {
                    this.removeChildWidget(this._widgetStrip);
                }
                this._widgetStrip = widgetStrip;
                this.appendChildWidget(this._widgetStrip);
            },

            getLength: function () {
                var device, size;
                device = this.getCurrentApplication().getDevice();
                size = device.getElementSize(this.outputElement || this.render(device));
                return size[this._getDimension()];
            },

            indicesVisibleWhenAlignedToIndex: function (index) {
                var maskLength, visibleIndices;
                maskLength = this.getLength();
                visibleIndices = this._visibleIndixesBefore(index, maskLength).concat(
                    this._visibleIndicesFrom(index, maskLength)
                );
                return visibleIndices;
            },

            _visibleIndixesBefore: function (index, maskLength) {
                var distanceToMaskStart, currentIndex, indices;
                indices = [];
                currentIndex = index - 1;
                distanceToMaskStart = this._alignmentPoint;
                while (currentIndex !== -1 && distanceToMaskStart > 0) {
                    if (distanceToMaskStart <= maskLength) {
                        indices.unshift(currentIndex);
                    }
                    distanceToMaskStart -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
                    currentIndex -= 1;
                }
                return indices;
            },

            _visibleIndicesFrom: function (index, maskLength) {
                var widgetCount, distanceToMaskEnd, currentIndex, indices;
                indices = [];
                widgetCount = this.getWidgetStrip().getChildWidgetCount();
                currentIndex = index;
                distanceToMaskEnd = maskLength - this._alignmentPoint;
                while (currentIndex !== widgetCount && distanceToMaskEnd > 0) {
                    if (distanceToMaskEnd <= maskLength) {
                        indices.push(currentIndex);
                    }
                    distanceToMaskEnd -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
                    currentIndex += 1;
                }
                return indices;
            },

            _moveContentsTo: function (relativePixels, options) {
                this._spinner.moveContentsTo(relativePixels, options);
            },

            _getDimension: function () {
                return this._orientation.dimension();
            }
        });

        return Mask;
    }
);
