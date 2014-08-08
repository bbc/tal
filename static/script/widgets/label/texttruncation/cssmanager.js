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

require.def('antie/widgets/label/texttruncation/cssmanager',
    [
        "antie/class"
    ],
    /**
     * Saves the elements css and applies changes necessary for text truncation calculations. Then can restore back the original styles.
     * @name antie.widgets.label.texttruncation.CssManager
     * @class
     * @param {DOMElement} el The DOMElement to make the changes on.
     * @param {Boolean} configureForMeasuringWidth Configures the css for measuring the width instead of height.
     */
    function (Class) {
        "use strict";
        var CssManager = Class.extend(/** @lends antie.widgets.label.texttruncation.cssmanager*/ {

            /**
             * @constructor
             * @ignore
             */
            init: function(el, configureForMeasuringWidth) {
                this._el = el;
                this._configureForMeasuringWidth = configureForMeasuringWidth;
                this._properties = {
                    position: null,
                    whiteSpace: null,
                    width: null,
                    minWidth: null,
                    maxWidth: null,
                    height: null,
                    minHeight: null,
                    maxHeight: null,
                    display: null
                };
                this._save();
            },

            /**
             * Saves the current css values on the element which can later be restored with "restore".
             */
            _save: function() {
                for (var prop in this._properties) {
                    if (this._properties.hasOwnProperty(prop)) {
                        this._properties[prop] = this._el.style[prop];
                    }
                }
            },

            /**
             * Restores the original css properties on the element back to the element.
             */
            restore: function() {
                for (var prop in this._properties) {
                    if (this._properties.hasOwnProperty(prop)) {
                        this._el.style[prop] = this._properties[prop];
                    }
                }
            },

            /**
             * Set the display mode to block. This means we get the actual width the element could take up even if it's set to 'inline'.
             */
            configureForMeasuring: function() {
                this._el.style.position = "static";
                this._el.style.display = "block";
            },

            /**
             * Applies the css properties to the element that are necessary for the text truncation algorithm.
             */
            configureForAlgorithm: function() {
                this._el.style.maxHeight = null;
                this._el.style.minHeight = null;
                // the height should be set to auto so that we can use el.clientHeight to determine the height of the contents
                this._el.style.height = "auto";
                this._el.style.display = "inline-block";
                this._el.style.position = "static";
                if (this._configureForMeasuringWidth) {
                    // we will be measuring the width that is taken up as text is added so set the width to auto and make sure no wrapping occurs.
                    this._el.style.whiteSpace = "nowrap";
                    this._el.style.width = "auto";
                    this._el.style.maxWidth = null;
                    this._el.style.minWidth = null;
                }
                else {
                    this._el.style.whiteSpace = "normal";
                }
            }
        });
        return CssManager;
    }
);