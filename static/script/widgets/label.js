/**
 * @fileOverview Requirejs module containing the antie.widgets.Label class.
 *
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

require.def('antie/widgets/label',
    [
        'antie/widgets/widget',
        'antie/widgets/label/texttruncation/truncator'
    ],
    function(Widget, Truncator) {
        /**
         * The Label widget displays text. It supports auto-truncation (with ellipsis) of text to fit.
         * @name antie.widgets.Label
         * @class
         * @extends antie.widgets.Widget
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {String} [text] The text content of this label.
         */
        var Label = Widget.extend(/** @lends antie.widgets.Label.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function(id, text) {
                // The current API states that if only one parameter is passed to
                // use that value as the text and auto generate an internal id
                if(arguments.length == 1) {
                    this._text = id;
                    this._super();
                } else {
                    this._text = text;
                    this._super(id);
                }
                this._truncationMode = Label.TRUNCATION_MODE_NONE;
                this._maxLines = null;
                this._ellipsisText = "...";
                this._splitAtWordBoundary = true;
                this.addClass('label');
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function(device) {

                var alreadyAddedToDom = !!this.outputElement;
                if (!this.outputElement) {
                    this.outputElement = device.createLabel(this.id, this.getClasses(), "");
                }

                if (this._truncationMode == Label.TRUNCATION_MODE_RIGHT_ELLIPSIS) {
                    var self = this;
                    var doTruncation = function() {
                        device.setElementContent(self.outputElement, self._truncateText());
                    };
                    // the element needs to already be on the dom for the truncation to work and this happens after the
                    // first render. So if this is the first render, ie this label is not in the dom yet, wait until this
                    // has happened by using a setTimeout with delay of 0. Otherwise do the truncation immediately.
                    if (alreadyAddedToDom) {
                        doTruncation()
                    }
                    else {
                        setTimeout(doTruncation, 0);
                    }
                }
                else {
                    device.setElementContent(this.outputElement, this._text);
                }
                return this.outputElement;
            },
            _truncateText: function() {
                var truncator = new Truncator(this.getCurrentApplication().getDevice());
                truncator.setSplitAtWordBoundary(this._splitAtWordBoundary);
                truncator.setEllipsisText(this._ellipsisText);
                return truncator.truncateText(this.outputElement, this._text, this._maxLines);
            },
            /**
             * Sets the text displayed by this label.
             * @param {String} text The new text to be displayed.
             */
            setText: function(text) {
                this._text = text;
                if(this.outputElement) {
                    this.render(this.getCurrentApplication().getDevice());
                }
            },
            /**
             * Gets the current text displayed by this label.
             * @returns The current text displayed by this label.
             */
            getText: function() {
                return this._text;
            },
            /**
             * Sets the truncation mode (currently {@link antie.widgets.Label.TRUNCATION_MODE_NONE} or {@link antie.widgets.Label.TRUNCATION_MODE_RIGHT_ELLIPSIS}).
             *
             * @param {String} mode The new truncation mode.
             */
            setTruncationMode: function(mode) {
                this._truncationMode = mode;
            },
            /**
             * Sets the maximum lines displayed when a truncation mode is set.
             * This is optional and if not specified the text will just be truncated when it no longer fits the box.
             * @param {String} lines The maximum number of lines to display.
             */
            setMaximumLines: function(numberLines) {
                this._maxLines = numberLines;
            },
            /**
             * Sets the text to append at the end of the truncated text. Defaults to "..."
             * @param {String} lines The text to append.
             */
            setEllipsisText: function(ellipsisText) {
                this._ellipsisText = ellipsisText;
            },
            /**
             * Set whether or not to allow truncating text part way through a word.
             * @param {Boolean} True means the truncated text will always end on a complete word. False means it may
             *                  occur after any character.
             */
            setSplitAtWordBoundary: function(splitAtWordBoundary) {
                this._splitAtWordBoundary = splitAtWordBoundary;
            },
            /**
             * @Deprecated
             * Sets the width of this label for use with truncation only.
             * No longer needed for current method of truncation.
             * @param {Integer} width The width of this label in pixels
             */
            setWidth: function(width) {
                throw "setWidth() called on Label but this method is now deprecated and has no effect.";
            }
        });

        /**
         * Do not truncate the text. Let the browser wrap to as many lines required to display all the text.
         * @name TRUNCATION_MODE_NONE
         * @memberOf antie.widgets.Label
         * @constant
         * @static
         */
        Label.TRUNCATION_MODE_NONE = 0;
        /**
         * Truncate text to fit into the number of lines specified by {@link antie.widgets.Label#setMaximumLines} by removing characters at the end of the string and append an ellipsis if text is truncated.
         * @constant
         * @name TRUNCATION_MODE_RIGHT_ELLIPSIS
         * @memberOf antie.widgets.Label
         * @static
         */
        Label.TRUNCATION_MODE_RIGHT_ELLIPSIS = 1;

        return Label;
    }
);