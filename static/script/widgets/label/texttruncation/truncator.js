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
    /**
     * TODO: this
     *
     */
    function (Class, WorkContainer, TruncationHelpers) {
        "use strict";
        var Truncator = Class.extend(/** @lends antie.widgets.label.texttruncation.truncator.prototype */ {

            // TODO: doc
            setSplitAtWordBoundary: function(splitAtWordBoundary) {
                this._splitAtWordBoundary = splitAtWordBoundary;
            },

            // TODO: doc
            setEllipsisText: function(ellipsisText) {
                this._ellipsisText = ellipsisText;
            },

            // TODO: doc
            truncateText: function (element, text, numberOfLinesRequired) {

                numberOfLinesRequired = numberOfLinesRequired || 0;

                // clear any text that's currently there
                element.innerHTML = "";

                var measuringHorizontally = numberOfLinesRequired !== 0;
                var workContainer = new WorkContainer(element, measuringHorizontally);
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

                // to contain the final text
                var finalTxt = "";
                // whether or not truncation actually happened/was necessary
                var truncationHappened = false;
                // the index of the text where the current line starts
                var currentLineStartIndex = 0;
                var numLoopIterations = numberOfLinesRequired === 0 ? 1 : numberOfLinesRequired;

                // the loop will run for each line. If this is run with noLines as 0 this means fit the height of the label.
                // in this case the loop should only run once as it's the height that's being measured.
                for (var currentLineNumber = 0; currentLineNumber < numLoopIterations; currentLineNumber++) {
                    var remainingTxt = text.slice(currentLineStartIndex, text.length);
                    var numCharsThatFit = workContainer.getNumCharactersThatFit(remainingTxt, this._getEllipsisIfNecessary(numberOfLinesRequired, currentLineNumber));
                    truncationHappened = numCharsThatFit !== remainingTxt.length;
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