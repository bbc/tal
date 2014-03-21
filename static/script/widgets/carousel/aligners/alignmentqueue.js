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
require.def('antie/widgets/carousel/aligners/alignmentqueue',
    [
        'antie/class'
    ],
    function (Class) {
        "use strict";

        function createAlignFunction(self, index, options) {
            return function () {
                options = options || {};
                var oldComplete = options.onComplete;
                var newOptions = {
                    el: options.el,
                    to: options.to,
                    from: options.from,
                    duration: options.duration,
                    easing: options.easing,
                    skipAnim: options.skipAnim,
                    fps: options.fps,
                    onComplete: function () {
                        if (oldComplete) {
                            oldComplete();
                        }
                        self._next();
                    }
                };

                if (self._skip) {
                    newOptions.skipAnim = true;
                }

                self._mask.alignToIndex(index, newOptions);
            };
        }

        /**
         * A class to handle queue multiple alignments for execution in sequence
         * @class
         * @extends antie.Class
         * @param {Object} mask The carousel's mask object
         */
        return Class.extend({
            init: function (mask) {
                this._mask = mask;
                this._setSkip(false);
                this._queue = [];
                this._started = false;
            },

            /**
             * Queues an alignment operation
             * @param {Number} index The index of the widget to align on.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            add: function (index, options) {
                var self = this;

                var alignFunction = createAlignFunction(self, index, options);

                this._queue.push(alignFunction);
            },

            /**
             * Begins executing the alignment operations in the queue. If the
             * queue has already been started, but has not completed, this will
             * do nothing.
             */
            start: function () {
                if (!this._started) {
                    this._runFirstInQueue();
                }
            },

            /**
             * Completes all queued alignments in order, skipping any animation and
             * firing any associated callbacks in sequence.
             */
            complete: function () {
                if (this._started) {
                    this._setSkip(true);
                    this._mask.stopAnimation();
                }
            },

            _runFirstInQueue: function () {
                if (this._queue.length > 0) {
                    this._started = true;
                    this._queue[0]();
                } else {
                    this._setSkip(false);
                    this._started = false;
                }
            },

            _next: function () {
                this._queue.shift();
                this._runFirstInQueue();
            },

            _setSkip: function (skip) {
                this._skip = skip;
            }
        });
    }
);