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
            },

            alignNext: function (navigator) {
                this._align(navigator, Aligner.directions.FORWARD);
            },

            alignPrevious: function (navigator) {
                this._align(navigator, Aligner.directions.BACKWARD);
            },

            alignToIndex: function (index, options) {
                this._bubbleBeforeAlign(index);
                this._moveNormally(index, options);
            },

            _align: function (navigator, direction) {
                var startIndex, targetIndex;
                startIndex = navigator.currentIndex();
                targetIndex = this._subsequentIndexInDirection(navigator, direction);
                this._bubbleBeforeAlign(targetIndex);
                if (targetIndex !== null) {
                    if (this._isWrap(startIndex, targetIndex, direction)) {
                        this._wrap(startIndex, targetIndex, navigator, direction);
                    } else {
                        this._moveNormally(targetIndex);
                    }
                }
            },

            _subsequentIndexInDirection: function (navigator, direction) {
                if (direction === Aligner.directions.FORWARD) {
                    return navigator.nextIndex();
                } else {
                    return navigator.previousIndex();
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
            },

            _bubbleAfterAlign: function (index) {
                this._mask.bubbleEvent(new AfterAlignEvent(this._mask, index));
            },

            _wrap: function (fromIndex, toIndex, navigator, direction) {
                if (this._fromIndexActive(fromIndex, navigator)) {
                    this._visibleActiveItemWrap(fromIndex, toIndex, navigator, direction);
                } else {
                    this._invisibleActiveItemWrap(fromIndex, toIndex, navigator, direction);
                }
            },

            _fromIndexActive: function (fromIndex, navigator) {
                var activeIndex;
                activeIndex = navigator.currentIndex();
                return fromIndex === activeIndex;
            },

            _invisibleActiveItemWrap: function (fromIndex, toIndex, navigator, direction) {
                var index = this._firstIndexToAlignForInvisibleActiveItemWrap(fromIndex, navigator, direction);
                this._queue.add(index, {skipAnim: true});
                this._queueFinalAlign(toIndex);
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

            _visibleActiveItemWrap: function (fromIndex, toIndex, navigator, direction) {
                var firstAlignIndex;
                firstAlignIndex = this._firstIndexToAlignForVisibleActiveItemWrap(toIndex, navigator, direction);
                this._queue.add(firstAlignIndex, {});
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
                function bubbleAfterAlign() {
                    self._bubbleAfterAlign(toIndex);
                }

                self = this;
                OptionsClone.prototype = options;
                optionsWithCallback = new OptionsClone();
                if (options && options.onComplete) {
                    optionsWithCallback.onComplete = function () {
                        options.onComplete();
                        bubbleAfterAlign();
                    };
                } else {
                    optionsWithCallback.onComplete = bubbleAfterAlign;
                }

                this._queue.add(toIndex, optionsWithCallback);
            }
        });

        Aligner.directions = { FORWARD: 0, BACKWARD: 1 };

        return Aligner;
    }
);