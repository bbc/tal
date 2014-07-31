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
        'antie/widgets/label/texttruncation/workcontainer',
        'antie/widgets/label/texttruncation/helpers'
    ],
	function(Widget, WorkContainer, TruncationHelpers) {
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
				this._maxLines = 0;
                this._truncationEndText = "...";
                this._allowTruncationPartThroughWord = false;
				this.addClass('label');
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {

                if (!this.outputElement) {
                    this.outputElement = device.createLabel(this.id, this.getClasses(), "");
                }

				if (this._truncationMode == Label.TRUNCATION_MODE_RIGHT_ELLIPSIS) {

                    var self = this;

                    // TODO: Check if this is a TAL supported mechanism for checking when the element has been added to the DOM
                    this.outputElement.onAddedToVisibleDom = function() {
                        // TODO? Extract this to a truncator(?) class that is instantiated when required
                        var el = self.outputElement;
                        var noLines = self._maxLines;
                        var txt = self._text;
                        // if set to false then the text may be cut off midway through a word.
                        var cutOffWord = !self._allowTruncationPartThroughWord;
                        // text to be appended at end of visible text
                        var txtEnd = self._truncationEndText;

                        // clear any text that's currently there
                        el.innerHTML = "";

                        var workContainer = new WorkContainer(el, noLines !== 0);

                        // to contain the final text
                        var finalTxt = "";
                        // flag that's set to true if truncation was needed
                        var truncationHappened = false;
                        // the index of the text where the current line starts
                        var currentLineStartIndex = 0;

                        // the loop will run for each line. If this is run with noLines as 0 this means fit the height of the label.
                        // in this case the loop should only run once as it's the height that's being measured.
                        var numLoopIterations = noLines === 0 ? 1 : noLines;
                        for (var currentLine = 0; currentLine < numLoopIterations; currentLine++) {

                            var remainingTxt = txt.slice(currentLineStartIndex, txt.length);
                            var numCharsThatFit = workContainer.getNumCharactersThatFit(remainingTxt, noLines === 0 || currentLine === noLines - 1 ? txtEnd : "", noLines !== 0);
                            truncationHappened = numCharsThatFit !== remainingTxt.length;
                            remainingTxt = remainingTxt.slice(0, numCharsThatFit);

                            if (noLines !== 0 && truncationHappened && currentLine < noLines - 1) {
                                // moving onto next line
                                // update startIndex to the index that the next line will start on.
                                // will be after the last space on line
                                var lastWordBoundary = TruncationHelpers.getLastWordBoundaryIndex(remainingTxt);
                                if (lastWordBoundary !== -1) {
                                    currentLineStartIndex = currentLineStartIndex + (lastWordBoundary + 1);
                                    // slice currentLineTxt so that it matches the text that will be on the line
                                    remainingTxt = remainingTxt.slice(0, lastWordBoundary + 1);
                                }
                                else {
                                    currentLineStartIndex = numCharsThatFit;
                                }
                            }
                            finalTxt += remainingTxt;

                            if (!truncationHappened) {
                                // no point carrying on if not had to truncate on this line as this will be the same for the rest
                                break;
                            }
                        }

                        if (truncationHappened) {
                            if (cutOffWord && !TruncationHelpers.isAtWordBoundary(txt, finalTxt.length)) {
                                finalTxt = TruncationHelpers.trimToWord(finalTxt);
                            }
                            // trim trailing spaces
                            finalTxt = TruncationHelpers.trimTrailingWhitespace(finalTxt);
                            // add txtEnd
                            finalTxt += txtEnd;
                        }

                        workContainer.destroy();
                        device.setElementContent(self.outputElement, finalTxt);
                    };

				} else {
                    device.setElementContent(this.outputElement, this._text);
				}

				return this.outputElement;
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
			setMaximumLines: function(lines) {
				this._maxLines = lines;
			},
            /**
             * Sets the text to append at the end of the truncated text. Default to "..."
             * @param {String} lines The text to append.
             */
            setTruncationEndTxt: function(endTxt) {
                this._truncationEndText = endTxt;
            },
            /**
             * Allow the text to be truncated part way through a word. Defaults to false.
             * @param {Boolean} Whether to allow truncating text part way through a word or not.
             */
            setAllowTruncationPartThroughWord: function(val) {
                this._allowTruncationPartThroughWord = val;
            },
            /**
             * @Deprecated
             * Sets the width of this label for use with truncation only.
             * No longer needed for current method of truncation.
             * @param {Integer} width The width of this label in pixels
             */
            setWidth: function(width) {
                // TODO: throw deprecated msg
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
