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

require.def('antie/widgets/label/texttruncation/truncator',
    [
        "antie/class",
        'antie/widgets/label/texttruncation/workcontainer',
        'antie/widgets/label/texttruncation/helpers'
    ],
    function (Class, WorkContainer, TruncationHelpers) {
        "use strict";

        /**
         * The Truncator manages truncating text.
         * @name antie.widgets.label.texttruncation.Truncator
         * @class
         * @param {antie.devices.Device} [device] The antie.devices.Device object currently running this application.
         * @extends antie.Class
         */
        var Truncator = Class.extend(/** @lends antie.widgets.label.texttruncation.truncator.prototype */ {

            /**
             * @constructor
             * @ignore
             */
            init: function(device) {
                this._device = device;
                this._splitAtWordBoundary = true;
                this._ellipsisText = "...";
            },

            /**
             * Set whether or not the text should truncate at a word boundary or any character.
             * @param {Boolean} splitAtWordBoundary True if you want the text to truncate at a word boundary.
             */
            setSplitAtWordBoundary: function(splitAtWordBoundary) {
                this._splitAtWordBoundary = splitAtWordBoundary;
            },

            /**
             * Set the text that you want to be appended after the truncated text. This will not be appended if no
             * truncation occurs.
             * @param {String} ellipsisText The text to use. E.g. "...".
             */
            setEllipsisText: function(ellipsisText) {
                this._ellipsisText = ellipsisText;
            },

            /**
             * Truncates text.
             * @param {DOMElement} element The DOMElement that the text will be placed into. The dimensions of this
             *                             DOMElement are used to determine where the text will truncate.
             * @param {String} text The source text.
             * @param {Number} [numberOfLinesRequired] The number of lines the text should be truncated to. A value of null
             *                                         (or omitting this parameter) means the text should be truncated to
             *                                         fit the container.
             */
            truncateText: function (element, text, numberOfLinesRequired) {

                numberOfLinesRequired = numberOfLinesRequired || 0;

                var measuringHorizontally = numberOfLinesRequired !== 0;
                var workContainer = new WorkContainer(this._device, element, measuringHorizontally);
                var finalTxt = this._doTruncation(text, workContainer, numberOfLinesRequired);
                var truncationHappened = finalTxt.length !== text.length;

                if (truncationHappened) {
                    // ensure string cuts off after a complete word (if that option enabled)
                    if (this._splitAtWordBoundary && !TruncationHelpers.isAtWordBoundary(text, finalTxt.length)) {
                        finalTxt = TruncationHelpers.trimToWord(finalTxt);
                    }
                    // trim trailing spaces
                    finalTxt = TruncationHelpers.trimTrailingWhitespace(finalTxt);
                    // add txtEnd
                    finalTxt += this._ellipsisText;
                }
                workContainer.destroy();
                return finalTxt;
            },

            _doTruncation: function(text, workContainer, numberOfLinesRequired) {

                // determine if the text actually needs to be truncated
                if (workContainer.getNumCharactersThatFit(text, "") === text.length) {
                    // text does not need truncating
                    return text;
                }

                // to contain the final text
                var finalTxt = "";
                // the index of the text where the current line starts
                var currentLineStartIndex = 0;
                var numLoopIterations = numberOfLinesRequired === 0 ? 1 : numberOfLinesRequired;

                // the loop will run for each line. If this is run with noLines as 0 this means fit the height of the label.
                // in this case the loop should only run once as it's the height that's being measured.
                for (var currentLineNumber = 0; currentLineNumber < numLoopIterations; currentLineNumber++) {
                    var remainingTxt = text.slice(currentLineStartIndex, text.length);
                    var numCharsThatFit = workContainer.getNumCharactersThatFit(remainingTxt, this._getEllipsisIfNecessary(numberOfLinesRequired, currentLineNumber));
                    // whether or not truncation actually happened/was necessary on this line
                    var truncationHappened = numCharsThatFit !== remainingTxt.length;
                    var currentLineTxt = remainingTxt.slice(0, numCharsThatFit);

                    if (numberOfLinesRequired !== 0 && truncationHappened && currentLineNumber < numberOfLinesRequired - 1) {
                        // moving onto next line
                        // update startIndex to the index that the next line will start on.
                        // will be after the last space on line
                        var lastWordBoundary = TruncationHelpers.getLastWordBoundaryIndex(currentLineTxt);
                        if (lastWordBoundary !== -1) {
                            currentLineStartIndex = currentLineStartIndex + (lastWordBoundary + 1);
                            // slice currentLineTxt so that it matches the text that will be on the line
                            currentLineTxt = currentLineTxt.slice(0, lastWordBoundary + 1);
                        }
                        else {
                            currentLineStartIndex = numCharsThatFit;
                        }
                    }
                    finalTxt += currentLineTxt;

                    if (!truncationHappened) {
                        // no point carrying on if not had to truncate on this line as this will be the same for the rest
                        break;
                    }
                }
                return finalTxt;
            },

            _getEllipsisIfNecessary: function(numberOfLinesRequired, currentLineNumber) {
                return numberOfLinesRequired === 0 || currentLineNumber === numberOfLinesRequired - 1 ? this._ellipsisText : "";
            }
        });

        return Truncator;
    }
);