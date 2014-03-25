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
require.def('antie/widgets/carousel/keyhandlers/keyhandler',
    [
        'antie/class'
    ],
    function (Class) {
        "use strict";
        /**
         * The base KeyHandler class moves alignment of the carousel on LEFT and RIGHT key presses
         * when attached to a Carousel with Horizontal orientation, and moves alignment on UP and
         * DOWN key presses when attached to a Carousel with Vertical orientation.
         * @name antie.widgets.carousel.keyhandlers.KeyHandler
         * @class
         * @extends antie.widgets.Widget
         */
        return Class.extend(/** @lends antie.widgets.carousel.keyhandlers.KeyHandler.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function () {
                this._animationOptions = {};
            },

            /**
             * Adds listeners to the supplied carousel to provided behaviour when navigation keys are pressed
             * @param carousel
             */
            attach: function (carousel) {
                this._carousel = carousel;
                this._addKeyListeners();
                this._addAlignmentListeners();
            },

            /**
             * Sets default animation options for key handled alignments
             * @param options {Object} Animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            setAnimationOptions: function (options) {
                this._animationOptions = options;
            },

            _addKeyListeners: function () {
                var previousKey, nextKey, carousel, self;
                self = this;
                carousel = this._carousel;
                previousKey = carousel.orientation().defaultKeys().PREVIOUS;
                nextKey = carousel.orientation().defaultKeys().NEXT;
                carousel.addEventListener('keydown', function (ev) {
                    switch (ev.keyCode) {
                    case previousKey:
                        if (carousel.previousIndex() !== null) {
                            carousel.completeAlignment();
                            carousel.alignPrevious(self._animationOptions);
                            ev.stopPropagation();
                        }
                        break;
                    case nextKey:
                        if (carousel.nextIndex() !== null) {
                            carousel.completeAlignment();
                            carousel.alignNext(self._animationOptions);
                            ev.stopPropagation();
                        }
                        break;
                    }
                });
            },

            _addAlignmentListeners: function () {

            }
        });
    }
);