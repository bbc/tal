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
	['antie/widgets/widget'],
	function(Widget) {
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

                    this.outputElement.onAddedToVisibleDom = function() {
                        var el = self.outputElement;
                        var noLines = self._maxLines;
                        var txt = self._text;
            //            txt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit nibh sodales diam tempor, eget mattis dui semper. Donec egestas lectus at quam placerat tincidunt. Aenean vehicula magna condimentum massa dapibus ornare. Nulla a dui lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis augue velit, congue nec volutpat porta, pretium id mauris. Phasellus eget ligula dui.";
                        // if set to false then the text may be cut off midway through a word.
                        var cutOffWord = true;

                        // clear any text that's currently there
                        outputElement.innerHTML = "";

                        // put the text node that we will be working on inside a container in the target el.
                        // the container will be set to fill the main element
                        // this means we can set the visibility to hidden and overflow to hidden on this container to make sure any temporary work isn't visible and doesn't effect anything else on the page.
                        // the text node must be created under the el in the dom hireachy so that it inherits all the correct css styles.
                        var container = document.createElement("div");
                        container.style.display = "block";
                        container.style.margin = "0";
                        container.style.padding = "0";
                        container.style.width = "auto";
                        container.style.height = "100%";
                        container.style.overflow = "hidden";
                        container.style.visibility = "hidden";
                        el.appendChild(container);

                        // the text node that will contain text as it is worked on. Starts off empty
                        var txtTruncationElNode = document.createTextNode("");
                        container.appendChild(txtTruncationElNode);

                        // the width and height of the box that the text should be truncated to fit into.
                        var w = el.clientWidth;
                        var h = el.clientHeight;

                        // save copies of the current css values for the properties that will be changed
                        var cssWhiteSpace = el.style.whiteSpace;
                        var cssWidth = el.style.width;
                        var cssHeight = el.style.height;
                        var cssDisplay = el.style.display;
                        // the height should be set to auto so that we can use el.clientHeight to determine the height of the contents
                        el.style.height = "auto";
                        if (noLines !== 0) {
                            // we will be measuring the width that is taken up as text is added so set the width to auto and make sure no wrapping occurs.
                            el.style.whiteSpace = "nowrap";
                            el.style.width = "auto";
                            // must be inline-block. if it's just inline clientWidth seems to always return 0
                            el.style.display = "inline-block";
                        }
                        else {
                            el.style.whiteSpace = "normal";
                        }

                        // to contain the final text
                        var finalTxt = "";
                        // text to be appended at end of visible text
                        var txtEnd = "...";
                        // left at true at the end of the loop if part way through a word
                        var partThroughWord = false;
                        // true at the end of the loop if truncation has happened.
                        // truncation may not be needed if text fits in container already
                        var truncationHappened = false;

                        var startIndex = 0;

                        // returns true if the text is now overflowing the container
                        var isOver = function () {
                            if (noLines !== 0) {
                                return el.clientWidth > w;
                            }
                            else {
                                return el.clientHeight > h;
                            }
                        };

                        var tmp = noLines === 0 ? 1 : noLines;
                        for (var currentLine = 0; currentLine < tmp; currentLine++) {

                            // this will contain the number of characters that should be added/removed on each loop iteration. It halves on each iteration.
                            var pointer = 1;
                            while (pointer < txt.length - startIndex) {
                                pointer = pointer << 1;
                            }
                            var position = pointer;
                            var currentLineTxt = txt.slice(startIndex, txt.length);
                            txtTruncationElNode.nodeValue = currentLineTxt;
                            truncationHappened = false;

                            // perform a binary chop until found maximum amount of text that will fit on self line
                            // it is possible for the position to be increased by 1 (when the pointer is 1) which then results in the text not fitting again.
                            // in this case the isOver() call in the for loop condition causes the loop to execute again and reduce by one again.
                            for (; pointer > 0 || (isOver() && position > 0); pointer = pointer >> 1) {
                                if (isOver()) {
                                    position -= pointer > 0 ? pointer : 1;
                                }
                                else if (currentLineTxt.length === txt.length - startIndex) {
                                    // going to expand to allow for more text but we already have the whole txt so done.
                                    partThroughWord = false;
                                    break;
                                }
                                else if (pointer === 0 && !isOver()) {
                                    // text now fits container but don't continue because pointer is now 0
                                    break;
                                }
                                else {
                                    position += pointer;
                                }
                                currentLineTxt = txt.slice(startIndex, startIndex + position);
                                partThroughWord = currentLineTxt[currentLineTxt.length - 1] !== " ";
                                if (noLines === 0 || currentLine === noLines - 1) {
                                    // txtEnd should only be added on last line.
                                    txtTruncationElNode.nodeValue = currentLineTxt + txtEnd;
                                }
                                else {
                                    txtTruncationElNode.nodeValue = currentLineTxt;
                                }
                                truncationHappened = true;
                            }

                            if (noLines !== 0 && truncationHappened && currentLine < noLines - 1) {
                                // moving onto next line
                                // update startIndex to the index that the next line will start on.
                                // will be after the last space on line
                                var lastSpaceIndex = currentLineTxt.lastIndexOf(" ");
                                if (lastSpaceIndex !== -1) {
                                    startIndex = startIndex + (lastSpaceIndex + 1);
                                    // slice currentLineTxt so that it matches the text that will be on the line
                                    currentLineTxt = currentLineTxt.slice(0, lastSpaceIndex + 1);
                                }
                                else {
                                    startIndex = position;
                                }
                            }
                            finalTxt += currentLineTxt;

                            if (!truncationHappened) {
                                break;
                            }
                        }

                        if (cutOffWord && partThroughWord) {
                            // remove text after last space
                            var lastSpaceIndex = finalTxt.lastIndexOf(" ");
                            if (lastSpaceIndex !== -1) {
                                finalTxt = finalTxt.slice(0, lastSpaceIndex);
                            }
                        }

                        // trim trailing spaces
                        var lastSpaceIndex = -1;
                        var character;
                        while (finalTxt.length > 0 && finalTxt[finalTxt.length - 1] === "") {
                            finalTxt = finalTxt.slice(0, finalTxt.length - 1);
                        }

                        if (truncationHappened) {
                            // add txtEnd
                            finalTxt += txtEnd;
                        }

                        // remove the text node and container. This text node is only their temporarily to get the text that will fit. The final text will be set with setElementContent
                        container.removeChild(txtTruncationElNode); // TODO: might not be needed
                        el.removeChild(container);

                        // set css properties that have been modified back to their original values
                        el.style.whiteSpace = cssWhiteSpace;
                        el.style.width = cssWidth;
                        el.style.height = cssHeight;
                        el.style.display = cssDisplay;

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
