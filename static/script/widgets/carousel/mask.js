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
         * The masking container of a carousel that the widget strip moves within.
         * @name antie.widgets.carousel.Mask
         * @class
         * @extends antie.widgets.Container
         * @param {String} id The id of the mask
         * @param {Object} widgetStrip the strip to be masked
         * @param {Object} orientation the orientation of the mask, one of
         * antie.widgets.carousel.orientations.Horizontal or antie.widgets.carousel.orientations.Vertical
         */
        var Mask;
        Mask = Container.extend(/** @lends antie.widgets.carousel.Mask.prototype */ {
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
                this._normalisedWidgetAlignPoint = 0;
                this._spinner = new Spinner(this.getCurrentApplication().getDevice(), this, orientation);
            },

            /**
             * Moves the masked widget strip such that the alignment point of the mask and the alignment
             * point of the indexed widget are the same place
             * @param index Index of the widget to be aligned
             * @param options
             */
            alignToIndex: function (index, options) {
                var distanceContentsMustMoveBack;
                distanceContentsMustMoveBack = this._widgetStrip.getLengthToIndex(index);
                distanceContentsMustMoveBack -= this._alignmentPoint;
                distanceContentsMustMoveBack += this._getWidgetAlignmentPoint(index);
                this._moveContentsTo(-distanceContentsMustMoveBack, options);
            },

            /**
             * Sets the alignment point of the mask in terms of pixels from its primary edge
             * (left for horizontal, top for vertical)
             * @param {Number} pixelsFromEdge
             */
            setAlignPoint: function (pixelsFromEdge) {
                this._alignmentPoint = pixelsFromEdge;
            },

            /**
             * Sets the alignment point of the mask in terms of a value between 0 and 1,
             * with 0 being the top or left edge and 1 being the bottom or right edge
             * @param fractionOfMaskLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
             */
            setNormalisedAlignPoint: function (fractionOfMaskLength) {
                var clampedFraction = this._clampBetweenZeroAndOne(fractionOfMaskLength);
                this._alignmentPoint = this.getLength() * clampedFraction;
            },

            /**
             * Sets the alignment point of the widget in terms of a value between 0 and 1,
             * with 0 being the top or left of the widget and 1 being the bottom or right.
             * @param fractionOfWidgetLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
             */
            setNormalisedWidgetAlignPoint: function (fractionOfWidgetLength) {
                this._normalisedWidgetAlignPoint = this._clampBetweenZeroAndOne(fractionOfWidgetLength);
            },

            /**
             * @returns {Object} the widget strip currently being masked
             */
            getWidgetStrip: function () {
                return this._widgetStrip;
            },

            /**
             * Sets the widget strip to mask and align
             * @param widgetStrip an instance of antie.widgets.carousel.strips.WidgetStrip
             */
            setWidgetStrip: function (widgetStrip) {
                if (this._widgetStrip) {
                    this.removeChildWidget(this._widgetStrip);
                }
                this._widgetStrip = widgetStrip;
                this.appendChildWidget(this._widgetStrip);
            },

            /**
             * @returns {Number} The length in pixels of the primary dimension of the mask
             * (Width for horizontal, height for vertical)
             */
            getLength: function () {
                var device, size;
                device = this.getCurrentApplication().getDevice();
                size = device.getElementSize(this.outputElement || this.render(device));
                return size[this._getDimension()];
            },

            /**
             * @param index
             * @returns {Array} An array of indices corresponding to the widgets visible
             * when the specified index is aligned to the current alignment point.
             */
            indicesVisibleWhenAlignedToIndex: function (index) {
                var maskLength, visibleIndices;
                maskLength = this.getLength();
                visibleIndices = this._visibleIndixesBefore(index, maskLength).concat(
                    this._visibleIndicesFrom(index, maskLength)
                );
                return visibleIndices;
            },

            /**
             * Completes any current alignment operation instantly, firing any associated
             * onComplete callback
             */
            stopAnimation: function () {
                this._spinner.stopAnimation();
            },

            _clampBetweenZeroAndOne: function (value) {
                var clampedValue = value;
                clampedValue = Math.max(0, clampedValue);
                clampedValue = Math.min(1, clampedValue);
                return clampedValue;
            },

            _getWidgetAlignmentPoint: function (index) {
                var widgetLength, widgetAlignmentPoint;
                if (this._normalisedWidgetAlignPoint === 0) {
                    widgetAlignmentPoint = 0;
                } else {
                    widgetLength = this._widgetStrip.lengthOfWidgetAtIndex(index);
                    widgetAlignmentPoint = widgetLength * this._normalisedWidgetAlignPoint;
                }

                return widgetAlignmentPoint;
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
