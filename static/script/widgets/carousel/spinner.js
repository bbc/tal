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

require.def('antie/widgets/carousel/spinner',
    [
        'antie/class'
    ],
    function (Class) {
        "use strict";
        /**
         * Manages communication with device for carousel animations
         * @name antie.widgets.carousel.spinner
         * @class
         * @extends antie.widgets.Class
         * @param {Object} device The device abstraction object
         * @param {Object} mask A carousel mask
         * @param {Object} The orientation object of the carousel
         */
        var Spinner;
        Spinner = Class.extend(/** @lends antie.widgets.carousel.Spinner.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function (device, mask, orientation) {
                this._device = device;
                this._mask = mask;
                this._orientation = orientation;
                this._animating = false;
                this._currentAnimation = null;
            },

            /**
             * Moves the widget strip's left or top edge relative to the mask's top or left edge
             * by the specified number of pixels via the framework's animation methods.
             * Note that on a browser device the mask will need to have overflow set and the strip will need position: relative
             * for this to work.
             * @param relativePixels
             * @param animOptions
             */
            moveContentsTo: function (relativePixels, animOptions) {
                var moveElementOptions;
                moveElementOptions = this._getOptions(animOptions, relativePixels);
                this.stopAnimation();
                this._animating = true;
                this._currentAnimation = this._device.moveElementTo(moveElementOptions);
            },

            /**
             * Completes any currently animating alignment, firing any associated callback.
             */
            stopAnimation: function () {
                if (this._animating) {
                    this._device.stopAnimation(this._currentAnimation);
                    this._clearAnimating();
                }
            },

            _getOptions: function (options, relativePixels) {
                var destination, clonedOptions;
                destination = {};
                destination[this._getEdge()] = relativePixels;
                clonedOptions = this._shallowCloneOptions(options);
                clonedOptions.el = this._mask.getWidgetStrip().outputElement;
                clonedOptions.to = destination;
                clonedOptions.duration = clonedOptions.duration || 150;
                clonedOptions.easing = clonedOptions.easing || 'linear';
                clonedOptions.fps = clonedOptions.fps || '25';
                clonedOptions.skipAnim = (clonedOptions.skipAnim === undefined) ? true : clonedOptions.skipAnim;
                clonedOptions.onComplete = this._getWrappedOnComplete(options);
                return clonedOptions;
            },

            _getWrappedOnComplete: function (options) {
                var self;
                self = this;
                function wrappedComplete() {
                    self._clearAnimating();
                    if (options.onComplete && typeof options.onComplete === 'function') {
                        options.onComplete();
                    }

                }
                return wrappedComplete;
            },

            _clearAnimating: function () {
                this._animating = false;
                this._currentAnimation = null;
            },

            _shallowCloneOptions: function (options) {
                options = options || {};
                function Cloner() {}
                Cloner.prototype = options;
                return new Cloner();
            },

            _getEdge: function () {
                return this._orientation.edge();
            }
        });

        return Spinner;
    }
);
