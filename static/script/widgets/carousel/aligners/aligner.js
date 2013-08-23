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
        "antie/events/afteralignevent"
    ],
    function (Class, BeforeAlignEvent, AfterAlignEvent) {
        "use strict";
        return Class.extend({
            init: function (mask) {
                this._mask = mask;
            },

            alignNext: function (navigator) {
                var startIndex, targetIndex;
                startIndex = navigator.currentIndex();
                targetIndex = navigator.nextIndex();
                if (navigator.nextIndex() !== null) {
                    this._bubbleBeforeAlign(targetIndex);

                    if (startIndex < targetIndex) {
                        this._moveNormally(targetIndex);
                    } else {
                        this._wrapForward(startIndex, targetIndex, navigator);
                    }
                }
            },

            alignPrevious: function (navigator) {
                var startIndex, targetIndex;
                startIndex = navigator.currentIndex();
                targetIndex = navigator.previousIndex();
                if (navigator.previousIndex() !== null) {
                    this._bubbleBeforeAlign(targetIndex);
                    if (startIndex > targetIndex) {
                        this._moveNormally(targetIndex);
                    } else {
                        this._wrapBackward(startIndex, targetIndex, navigator);
                    }
                }
            },

            alignToIndex: function (index, options) {
                this._bubbleBeforeAlign(index);
                this._moveNormally(index, options);
            },

            _bubbleBeforeAlign: function (index) {
                this._mask.bubbleEvent(new BeforeAlignEvent(this._mask, index));
            },

            _bubbleAfterAlign: function (index) {
                this._mask.bubbleEvent(new AfterAlignEvent(this._mask, index));
            },

            _wrapForward: function (fromIndex, toIndex, navigator) {
                var activeIndex;
                activeIndex = navigator.currentIndex();
                if (fromIndex === activeIndex) {
                    this._wrapForwardWhenActiveItemVisibleAtStart(fromIndex, toIndex, navigator);
                } else {
                    this._wrapForwardWhenActiveItemNotVisibleAtStart(fromIndex, toIndex, navigator);
                }
            },

            _wrapBackward: function (fromIndex, toIndex, navigator) {
                if (fromIndex === navigator.currentIndex()) {
                    this._wrapBackwardWhenActiveItemVisibleAtStart(fromIndex, toIndex, navigator);
                } else {
                    this._wrapBackwardWhenActiveItemNotVisibleAtStart(fromIndex, toIndex, navigator);
                }
            },

            _wrapForwardWhenActiveItemNotVisibleAtStart: function (fromIndex, toIndex, navigator) {
                var self;

                function alignAfterWrap() {
                    self._finalAlign(toIndex);
                }

                self = this;

                this._mask.alignToIndex(fromIndex - navigator.indexCount(), {
                    skipAnim: true,
                    onComplete: alignAfterWrap
                });
            },

            _wrapBackwardWhenActiveItemNotVisibleAtStart: function (fromIndex, toIndex, navigator) {
                var self, length;

                function alignAfterWrap() {
                    self._finalAlign(toIndex);
                }

                self = this;
                length = navigator.indexCount();
                this._mask.alignToIndex(length + fromIndex, {
                    skipAnim: true,
                    onComplete: alignAfterWrap
                });
            },

            _wrapForwardWhenActiveItemVisibleAtStart: function (fromIndex, toIndex, navigator) {
                var self;
                function wrapAfterAlign() {
                    self._finalAlign(toIndex, { skipAnim: true });
                }
                self = this;

                this._mask.alignToIndex(navigator.indexCount() + toIndex, { onComplete: wrapAfterAlign });
            },

            _wrapBackwardWhenActiveItemVisibleAtStart: function (fromIndex, toIndex, navigator) {
                var self;
                function wrapAfterAlign() {
                    self._finalAlign(toIndex, { skipAnim: true });
                }
                self = this;

                this._mask.alignToIndex(-navigator.indexCount() + toIndex, { onComplete: wrapAfterAlign });
            },

            _moveNormally: function (toIndex, options) {
                this._finalAlign(toIndex, options);
            },

            _finalAlign: function (toIndex,  options) {
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

                this._mask.alignToIndex(toIndex, optionsWithCallback);
            }
        });
    }
);