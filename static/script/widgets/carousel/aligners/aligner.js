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
require.def('antie/widgets/carousel/aligners/aligner',
    [
        'antie/class',
        "antie/events/beforealignevent",
        "antie/events/afteralignevent",
        "antie/widgets/carousel/aligners/alignmentqueue"
    ],
    function (Class, BeforeAlignEvent, AfterAlignEvent, AlignmentQueue) {
        "use strict";
        var Aligner;
        Aligner = Class.extend({
            init: function (mask) {
                this._mask = mask;
                this._queue = new AlignmentQueue(this._mask);
                this._alignedIndex = null;
            },

            alignNext: function (navigator, options) {
                this._align(navigator, Aligner.directions.FORWARD, options);
            },

            alignPrevious: function (navigator, options) {
                this._align(navigator, Aligner.directions.BACKWARD, options);
            },

            alignToIndex: function (index, options) {
                this._bubbleBeforeAlign(index);
                this._moveNormally(index, options);
            },

            complete: function () {
                this._queue.complete();
            },

            _align: function (navigator, direction, options) {
                var startIndex, targetIndex;

                startIndex = this._alignedIndex;
                targetIndex = this._subsequentIndexInDirection(navigator, direction);

                if (targetIndex !== null) {
                    this._bubbleBeforeAlign(targetIndex);
                    if (this._isWrap(startIndex, targetIndex, direction)) {
                        this._wrap(startIndex, targetIndex, navigator, direction, options);
                    } else {
                        this._moveNormally(targetIndex, options);
                    }
                }
            },

            _subsequentIndexInDirection: function (navigator, direction) {
                var startPoint;
                startPoint = (this._alignedIndex === null) ? 0 : this._alignedIndex;
                if (direction === Aligner.directions.FORWARD) {
                    return navigator.indexAfter(startPoint);
                } else {
                    return navigator.indexBefore(startPoint);
                }
            },

            _isWrap: function (startIndex, targetIndex, direction) {
                if (direction === Aligner.directions.FORWARD && startIndex > targetIndex) {
                    return true;
                }
                if (direction === Aligner.directions.BACKWARD && startIndex < targetIndex) {
                    return true;
                }
                return false;
            },

            _bubbleBeforeAlign: function (index) {
                this._mask.bubbleEvent(new BeforeAlignEvent(this._mask, index));
                this._alignedIndex = index;
            },

            _bubbleAfterAlign: function (index) {

                this._mask.bubbleEvent(new AfterAlignEvent(this._mask, index));
            },

            _wrap: function (fromIndex, toIndex, navigator, direction, options) {
                if (this._fromIndexActive(fromIndex, navigator)) {
                    this._visibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
                } else {
                    this._invisibleActiveItemWrap(fromIndex, toIndex, navigator, direction, options);
                }
            },

            _fromIndexActive: function (fromIndex, navigator) {
                var activeIndex;
                activeIndex = navigator.currentIndex();
                return fromIndex === activeIndex;
            },

            _invisibleActiveItemWrap: function (fromIndex, toIndex, navigator, direction, options) {
                var index = this._firstIndexToAlignForInvisibleActiveItemWrap(fromIndex, navigator, direction);
                this._queue.add(index, {skipAnim: true});
                this._queueFinalAlign(toIndex, options);
                this._queue.start();
            },

            _firstIndexToAlignForInvisibleActiveItemWrap: function (fromIndex, navigator, direction) {
                var widgetCount;
                widgetCount = navigator.indexCount();
                if (direction === Aligner.directions.FORWARD) {
                    return fromIndex - navigator.indexCount();
                } else {
                    return widgetCount + fromIndex;
                }
            },

            _visibleActiveItemWrap: function (fromIndex, toIndex, navigator, direction, options) {
                var firstAlignIndex;
                firstAlignIndex = this._firstIndexToAlignForVisibleActiveItemWrap(toIndex, navigator, direction);
                this._queue.add(firstAlignIndex, options);
                this._queueFinalAlign(toIndex, { skipAnim: true });
                this._queue.start();
            },

            _firstIndexToAlignForVisibleActiveItemWrap: function (toIndex, navigator, direction) {
                if (direction === Aligner.directions.FORWARD) {
                    return navigator.indexCount() + toIndex;
                } else {
                    return -navigator.indexCount() + toIndex;
                }
            },

            _moveNormally: function (toIndex, options) {
                this._queueFinalAlign(toIndex, options);
                this._queue.start();
            },

            _queueFinalAlign: function (toIndex,  options) {
                var optionsWithCallback, self;

                function OptionsClone() {}

                function unwrappedComplete() {
                    //self._alignedIndex = toIndex;
                    self._bubbleAfterAlign(toIndex);
                }

                function wrappedComplete() {

                    options.onComplete();
                    self._bubbleAfterAlign(toIndex);
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