/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.mask class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/mask',
    [
        'antie/widgets/container',
        'antie/widgets/carousel/spinner',
        'antie/events/beforealignevent',
        'antie/events/afteralignevent'
    ],
    function (Container, Spinner, BeforeAlignEvent, AfterAlignEvent) {
        'use strict';
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
            init: function init (id, widgetStrip, orientation) {
                init.base.call(this, id);
                this.addClass(orientation.styleClass());
                this._orientation = orientation;
                this.addClass('carouselmask');
                this.setWidgetStrip(widgetStrip);
                this._alignmentPoint = 0;
                this._normalisedWidgetAlignPoint = 0;
                this._normalisedAlignmentPoint = 0;
                this._spinner = new Spinner(this.getCurrentApplication().getDevice(), this, orientation);
                this._lastAlignIndex = null;
                this._length = undefined;
            },

            /**
             * Moves the masked widget strip such that the alignment point of the mask and the alignment
             * point of the indexed widget are the same place
             * @param index Index of the widget to be aligned
             * @param options
             */
            alignToIndex: function alignToIndex (index, options) {
                this._doAlign(index, options, this._alignmentPoint);
            },

            _doAlign: function _doAlign (index, options, alignPoint) {
                var distanceContentsMustMoveBack;
                distanceContentsMustMoveBack = this._widgetStrip.getLengthToIndex(index);
                distanceContentsMustMoveBack -= this._getAlignmentPoint();
                distanceContentsMustMoveBack += this._getWidgetAlignmentPoint(index);
                this._moveContentsTo(-distanceContentsMustMoveBack, options);
                this._currentAlignPoint = alignPoint;

            },

            _resetAlignment: function _resetAlignment () {
                if (this._lastAlignIndex !== null) {
                    this._doAlign(this._lastAlignIndex, {skipAnim: true}, this._currentAlignPoint);
                }
            },


            /**
             * Sets the alignment point of the mask in terms of pixels from its primary edge
             * (left for horizontal, top for vertical)
             * @param {Number} pixelsFromEdge
             */
            setAlignPoint: function setAlignPoint (pixelsFromEdge) {
                this._alignmentPoint = pixelsFromEdge;
                this._normalisedAlignmentPoint = 0;
            },

            /**
             * Sets the alignment point of the mask in terms of a value between 0 and 1,
             * with 0 being the top or left edge and 1 being the bottom or right edge
             * @param fractionOfMaskLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
             */
            setNormalisedAlignPoint: function setNormalisedAlignPoint (fractionOfMaskLength) {
                var clampedFraction = this._clampBetweenZeroAndOne(fractionOfMaskLength);
                this._normalisedAlignmentPoint = clampedFraction;
            },

            /**
             * Sets the alignment point of the widget in terms of a value between 0 and 1,
             * with 0 being the top or left of the widget and 1 being the bottom or right.
             * @param fractionOfWidgetLength Value between 0 and 1, will be clamped to 0 or 1 if outside this range.
             */
            setNormalisedWidgetAlignPoint: function setNormalisedWidgetAlignPoint (fractionOfWidgetLength) {
                this._normalisedWidgetAlignPoint = this._clampBetweenZeroAndOne(fractionOfWidgetLength);
            },

            /**
             * @returns {Object} the widget strip currently being masked
             */
            getWidgetStrip: function getWidgetStrip () {
                return this._widgetStrip;
            },

            /**
             * Sets the widget strip to mask and align
             * @param widgetStrip an instance of antie.widgets.carousel.strips.WidgetStrip
             */
            setWidgetStrip: function setWidgetStrip (widgetStrip) {
                if (this._widgetStrip) {
                    this.removeChildWidget(this._widgetStrip);
                }
                this._widgetStrip = widgetStrip;
                this.appendChildWidget(this._widgetStrip);
            },

            setLength: function setLength (length) {
                this._length = length;
            },

            /**
             * @returns {Number} The length in pixels of the primary dimension of the mask
             * (Width for horizontal, height for vertical)
             */
            getLength: function getLength () {
                var device, size;
                if (this._length) {
                    return this._length;
                } else {
                    device = this.getCurrentApplication().getDevice();
                    size = device.getElementSize(this.outputElement || this.render(device));
                    return size[this._getDimension()];
                }
            },

            /**
             * @param index
             * @returns {Array} An array of indices corresponding to the widgets visible
             * when the specified index is aligned to the current alignment point.
             */
            indicesVisibleWhenAlignedToIndex: function indicesVisibleWhenAlignedToIndex (index) {
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
            stopAnimation: function stopAnimation () {
                this._spinner.stopAnimation();
            },

            beforeAlignTo: function beforeAlignTo (currentIndex, newIndex) {
                if (this._widgetStrip.needsVisibleIndices()) {
                    this._widgetStrip.attachIndexedWidgets(this._visibleIndicesBetween(currentIndex, newIndex));
                    this._resetAlignment();
                }
                this._widgetStrip.bubbleEvent(new BeforeAlignEvent(this._widgetStrip, newIndex));
            },

            afterAlignTo: function afterAlignTo (index) {
                this._lastAlignIndex = index;
                if (this._widgetStrip.needsVisibleIndices()) {
                    this._widgetStrip.attachIndexedWidgets(this.indicesVisibleWhenAlignedToIndex(index));
                    this.alignToIndex(index, {skipAnim: true});
                }
                this._widgetStrip.bubbleEvent(new AfterAlignEvent(this._widgetStrip, index));
            },

            _clampBetweenZeroAndOne: function _clampBetweenZeroAndOne (value) {
                var clampedValue = value;
                clampedValue = Math.max(0, clampedValue);
                clampedValue = Math.min(1, clampedValue);
                return clampedValue;
            },

            _getWidgetAlignmentPoint: function _getWidgetAlignmentPoint (index) {
                var widgetLength, widgetAlignmentPoint;
                if (this._normalisedWidgetAlignPoint === 0) {
                    widgetAlignmentPoint = 0;
                } else {
                    widgetLength = this._widgetStrip.lengthOfWidgetAtIndex(index);
                    widgetAlignmentPoint = widgetLength * this._normalisedWidgetAlignPoint;
                }

                return widgetAlignmentPoint;
            },

            _getAlignmentPoint: function _getAlignmentPoint () {
                var alignmentPoint;
                if (this._normalisedAlignmentPoint === 0) {
                    alignmentPoint = this._alignmentPoint;
                } else {
                    alignmentPoint  = this.getLength() * this._normalisedAlignmentPoint;
                }
                return alignmentPoint;
            },

            _visibleIndixesBefore: function _visibleIndixesBefore (index, maskLength) {
                var distanceToMaskStart, currentIndex, indices;
                indices = [];
                currentIndex = index - 1;
                distanceToMaskStart = this._getAlignmentPoint() - this._getWidgetAlignmentPoint(index);
                while (currentIndex !== -1 && distanceToMaskStart > 0) {
                    if (distanceToMaskStart <= maskLength) {
                        indices.unshift(currentIndex);
                    }
                    distanceToMaskStart -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
                    currentIndex -= 1;
                }
                return indices;
            },

            _visibleIndicesFrom: function _visibleIndicesFrom (index, maskLength) {
                var widgetCount, distanceToMaskEnd, currentIndex, indices;
                indices = [];
                widgetCount = this.getWidgetStrip().getChildWidgetCount();
                currentIndex = index;
                distanceToMaskEnd = maskLength - this._getAlignmentPoint() + this._getWidgetAlignmentPoint(index);
                while (currentIndex !== widgetCount && distanceToMaskEnd > 0) {
                    if (distanceToMaskEnd <= maskLength) {
                        indices.push(currentIndex);
                    }
                    distanceToMaskEnd -= this.getWidgetStrip().lengthOfWidgetAtIndex(currentIndex);
                    currentIndex += 1;
                }
                return indices;
            },

            _visibleIndicesBetween: function _visibleIndicesBetween (start, end) {
                var startIndices, endIndices, combinedIndices, visibleIndices, first, last, i;

                startIndices = (start === null) ? [] : this.indicesVisibleWhenAlignedToIndex(start);
                endIndices = this.indicesVisibleWhenAlignedToIndex(end);
                combinedIndices = startIndices.concat(endIndices);
                combinedIndices = this._deDuplicateAndSortArray(combinedIndices);
                visibleIndices = [];
                if (combinedIndices.length > 0) {
                    first = combinedIndices[0];
                    last = combinedIndices[combinedIndices.length - 1];
                    for (i = first; i !== last + 1; i += 1) {
                        visibleIndices.push(i);
                    }
                }
                return visibleIndices;
            },

            _deDuplicateAndSortArray: function _deDuplicateAndSortArray (arr) {
                var i, deDuped;
                arr.sort(this._numericalSort);
                deDuped = [];
                for (i = 0; i !== arr.length; i += 1) {
                    if (arr[i] !== arr[i + 1]) {
                        deDuped.push(arr[i]);
                    }
                }
                return deDuped;
            },

            _numericalSort: function _numericalSort (a, b) {
                return a - b;
            },

            _moveContentsTo: function _moveContentsTo (relativePixels, options) {
                this._spinner.moveContentsTo(relativePixels, options);
            },

            _getDimension: function _getDimension () {
                return this._orientation.dimension();
            }
        });

        return Mask;
    }
);
