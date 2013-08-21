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
        return Class.extend({
            init: function (mask) {
                this._mask = mask;
                this._setSkip(false);
                this._queue = [];
            },

            add: function (index, options) {
                var self = this;

                function cloneOptions() {
                    function ShallowClone() {}
                    ShallowClone.prototype = options;
                    return new ShallowClone();
                }

                function wrappedOptions() {
                    var options, originalOnComplete;
                    options = cloneOptions();
                    originalOnComplete = options.onComplete;
                    options.onComplete = function () {
                        if (typeof originalOnComplete === 'function') {
                            originalOnComplete();
                        }
                        self._next();
                    };
                    if (self._skip) {
                        options.skipAnim = true;
                    }
                    return options;
                }

                function align() {
                    self._mask.alignToIndex(index, wrappedOptions());
                }

                this._queue.push(align);
            },

            start: function () {
                this._runFirstInQueue();
            },

            complete: function () {
                this._setSkip(true);
                this._mask.stopAnimation();
            },

            _runFirstInQueue: function () {
                if (this._queue.length > 0) {
                    this._queue[0]();
                } else {
                    this._setSkip(false);
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
)