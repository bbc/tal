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

require.def('antie/widgets/label/texttruncation/workcontainer',
    [
        "antie/class",
        'antie/widgets/label/texttruncation/cssmanager',
        'antie/widgets/label/texttruncation/positiongenerator'
    ],
    function (Class, CssManager, PositionGenerator) {
        "use strict";

        /**
         * A wrapper for the container which will contain the textnode which will be used for calculations.
         * The container will be set to fill the parent element and the visibility will be set to hidden and overflow to
         * hidden on this container to make sure any temporary work isn't visible and doesn't effect anything else on the page.
         * Because the text node is being created under the parent element in the dom hireachy so that it inherits all of the correct css styles.
         * @name antie.widgets.label.texttruncation.WorkContainer
         * @class
         * @param {antie.devices.Device} [device] The antie.devices.Device object currently running this application.
         * @param {DOMElement} parentEl The DOMElement that should contain this.
         * @param {Boolean} measuringHorizontally True if this container is being used to compare the width of the text to the width of the container.
         *                                        False if the container is being used to compare the height of the text to the height of the container.
         */
         var WorkContainer = Class.extend(/** @lends antie.widgets.label.texttruncation.workcontainer.prototype */ {

            /**
             * @constructor
             * @ignore
             */
            init: function(device, parentEl, measuringHorizontally) {
                this._device = device;
                this._parentEl = parentEl;
                this._measuringHorizontally = measuringHorizontally;
                this._container = this._createContainer();
                this._txtTruncationElNode = this._createTxtTruncationElNode();
                // clear any text that's currently there
                this._parentEl.innerHTML = "";
                this._container.appendChild(this._txtTruncationElNode);
                this._parentEl.appendChild(this._container);
                // the width and height of the box that the text should be truncated to fit into.
                // use the container (which has width auto and height 100%) to get these values, not the parent el, because this takes into consideration any padding on the parent el
                // clientWidth and clientHeight includes padding (but not border or margin), but we know that container will have padding of 0 and will sit within parents padding :)
                var size = this._device.getElementSize(this._container);
                this._w = size.width;
                this._h = size.height;
                this._cssManager = new CssManager(this._parentEl, this._measuringHorizontally);
            },

            _createContainer: function() {
                var container = document.createElement("div");
                container.style.display = "block";
                container.style.margin = "0";
                container.style.padding = "0";
                container.style.width = "auto";
                container.style.height = "100%";
                container.style.overflow = "hidden";
                container.style.visibility = "hidden";
                return container;
            },

            _createTxtTruncationElNode: function() {
                return document.createTextNode("");
            },

            /**
             * Destroy the container and the text node contained in it.
             */
            destroy: function() {
                this._parentEl.removeChild(this._container);
                this._cssManager.restore();
            },

            /**
             * Determine if some text overflows the width if measuring horizontally, or height otherwise.
             * @param {String} txt The text to measure.
             * @returns True if the text is overflowing the container.
             */
            isOver: function(txt) {
                // make sure only update the dom if necessary
                if (this._currentTxtNodeTxt !== txt) {
                    this._currentTxtNodeTxt = txt;
                    this._txtTruncationElNode.nodeValue = txt;
                }
                var size = this._device.getElementSize(this._container);
                // getElementSize() returns a measurement rounded to an integer so >= instead of > compensates for this
                return this._measuringHorizontally ? size.width >= this._w : size.height >= this._h;
            },

            /**
             * Perform a binary chop to calculate the number of characters that fit into this WorkContainer.
             * @param {String} txt The source string to work on.
             * @param {String} txtEnd The text that would be added after the truncated text. E.g "...".
             *                        The length of this is not included in the returned value.
             * @returns The number of characters that fit in this WorkContainer.
             */
            getNumCharactersThatFit: function(txt, txtEnd) {
                var positionGenerator = new PositionGenerator(txt.length);
                var position = txt.length;
                var txtWorkingOn = txt;
                while(positionGenerator.hasNext(this.isOver(txtWorkingOn))) {
                    position = positionGenerator.next(this.isOver(txtWorkingOn));
                    txtWorkingOn = txt.slice(0, position) + txtEnd;
                }
                return position;
            }

        });
        return WorkContainer;
    }
);