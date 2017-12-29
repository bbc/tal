/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.aligners.aligner class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/aligners/aligner',
    [
        'antie/class',
        'antie/widgets/carousel/aligners/alignmentqueue'
    ],
    function (Class, AlignmentQueue) {
        'use strict';
        /**
         * Converts simple index based alignment instructions to combinations of
         * one or more pixel based alignments to be performed on the mask
         * @name antie.widgets.carousel.aligners.Aligner
         * @class
         * @extends antie.Class
         * @param {antie.widgets.carousel.Mask} mask The carousel's mask object
         */
        var Aligner;
        Aligner = Class.extend(/** @lends antie.widgets.carousel.aligners.Aligner.prototype */{
            init: function init (mask) {
                this._mask = mask;
                this._queue = new AlignmentQueue(this._mask);
                this._lastAlignIndex = null;
            },

            /**
             * Aligns the mask and widget strip to the next enabled widget after that currently aligned.
             * If no alignment has been performed previously it will align to the next enabled widget after that at index 0
             * If a wrapping strip and navigator are used the alignment will wrap to the start after the last widget is reached.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {antie.widgets.carousel.navigators.Navigator} navigator The carousel's current navigator
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            alignNext: function alignNext (navigator, options) {
                this._align(navigator, Aligner.directions.FORWARD, options);
            },

            /**
             * Aligns the mask and widget strip to the next enabled widget before that currently aligned.
             * If no alignment has been performed previously it will align to the next enabled widget before that at index 0
             * If a wrapping strip and navigator are used the alignment will wrap to the end after the first widget is reached.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {antie.widgets.carousel.navigators.Navigator} navigator The carousel's current navigator
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            alignPrevious: function alignPrevious (navigator, options) {
                this._align(navigator, Aligner.directions.BACKWARD, options);
            },

            /**
             * Aligns the mask and widget strip to the widget at the specified index
             * Will always move forward if the index is after that currently aligned and backwards if index is before
             * that currently aligned.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {Number} index The index of the widget to align on.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            alignToIndex: function alignToIndex (index, options) {
                this._informMaskBeforeAlign(index);
                this._moveNormally(index, options);
            },

            /**
             * Get the last index the carousel was asked to align to
             * @returns {Number} The last index the carousel was asked to align to, or null if no alignments have completed.
             */
            indexOfLastAlignRequest: function indexOfLastAlignRequest () {
                return this._lastAlignIndex;
            },

            /**
             * Instantly completes any in-flight alignment animations, firing any callbacks that were provided.
             * If several alignments have been queued, all will complete in order.
             */
            complete: function complete () {
                this._queue.complete();
            },

            _align: function _align (navigator, direction, options) {
                var startIndex, targetIndex;

                startIndex = this.indexOfLastAlignRequest();
                targetIndex = this._subsequentIndexInDirection(navigator, direction);

                if (targetIndex !== null) {
                    this._informMaskBeforeAlign(targetIndex);
                    if (this._isWrap(startIndex, targetIndex, direction)) {
                        this._wrap(startIndex, targetIndex, navigator, direction, options);
                    } else {
                        this._moveNormally(targetIndex, options);
                    }
                }
            },

            _subsequentIndexInDirection: function _subsequentIndexInDirection (navigator, direction) {
                var startPoint, lastAligned;
                lastAligned = this.indexOfLastAlignRequest();
                startPoint = (lastAligned === null) ? 0 : lastAligned;
                if (direction === Aligner.directions.FORWARD) {
                    return navigator.indexAfter(startPoint);
                } else {
                    return navigator.indexBefore(startPoint);
                }
            },

            _isWrap: function _isWrap (startIndex, targetIndex, direction) {
                if (direction === Aligner.directions.FORWARD && startIndex > targetIndex) {
                    return true;
                }
                if (direction === Aligner.directions.BACKWARD && startIndex < targetIndex) {
                    return true;
                }
                return false;
            },

            _informMaskBeforeAlign: function _informMaskBeforeAlign (index) {
                this._mask.beforeAlignTo(this._lastAlignIndex, index);
                this._lastAlignIndex = index;
            },

            _informMaskAfterAlign: function _informMaskAfterAlign (index) {
                this._mask.afterAlignTo(index);
            },

            _wrap: function _wrap (fromIndex, toIndex, navigator, direction, options) {
                if (this._fromIndexActive(fromIndex, navigator)) {
                    this._visibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
                } else {
                    this._invisibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
                }
            },

            _fromIndexActive: function _fromIndexActive (fromIndex, navigator) {
                var activeIndex;
                activeIndex = navigator.currentIndex();
                return fromIndex === activeIndex;
            },

            _invisibleActiveItemWrap: function _invisibleActiveItemWrap (fromIndex, toIndex, navigator, direction, options) {
                var index = this._firstIndexToAlignForInvisibleActiveItemWrap(fromIndex, navigator, direction);
                this._queue.add(index, {skipAnim: true});
                this._queueFinalAlign(toIndex, options);
                this._queue.start();
            },

            _firstIndexToAlignForInvisibleActiveItemWrap: function _firstIndexToAlignForInvisibleActiveItemWrap (fromIndex, navigator, direction) {
                var widgetCount;
                widgetCount = navigator.indexCount();
                if (direction === Aligner.directions.FORWARD) {
                    return fromIndex - navigator.indexCount();
                } else {
                    return widgetCount + fromIndex;
                }
            },

            _visibleActiveItemWrap: function _visibleActiveItemWrap (fromIndex, toIndex, navigator, direction, options) {
                var firstAlignIndex;
                firstAlignIndex = this._firstIndexToAlignForVisibleActiveItemWrap(toIndex, navigator, direction);
                this._queue.add(firstAlignIndex, options);
                this._queueFinalAlign(toIndex, { skipAnim: true });
                this._queue.start();
            },

            _firstIndexToAlignForVisibleActiveItemWrap: function _firstIndexToAlignForVisibleActiveItemWrap (toIndex, navigator, direction) {
                if (direction === Aligner.directions.FORWARD) {
                    return navigator.indexCount() + toIndex;
                } else {
                    return -navigator.indexCount() + toIndex;
                }
            },

            _moveNormally: function _moveNormally (toIndex, options) {
                this._queueFinalAlign(toIndex, options);
                this._queue.start();
            },

            _queueFinalAlign: function _queueFinalAlign (toIndex,  options) {
                var optionsWithCallback, self;

                function OptionsClone() {}

                function unwrappedComplete() {
                    self._informMaskAfterAlign(toIndex);
                }

                function wrappedComplete() {
                    options.onComplete();
                    self._informMaskAfterAlign(toIndex);
                }

                self = this;
                OptionsClone.prototype = options;
                optionsWithCallback = new OptionsClone();
                if (options && options.onComplete) {
                    optionsWithCallback.onComplete = wrappedComplete;
                } else {
                    optionsWithCallback.onComplete = unwrappedComplete;
                }

                this._queue.add(toIndex, optionsWithCallback);
            }
        });

        Aligner.directions = { FORWARD: 0, BACKWARD: 1 };

        return Aligner;
    }
);
