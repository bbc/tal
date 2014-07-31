require.def('antie/widgets/label/texttruncation/workcontainer',
    [
        'antie/widgets/label/texttruncation/cssmanager',
        'antie/widgets/label/texttruncation/positiongenerator'
    ],
    function (CssManager, PositionGenerator) {
        "use strict";

        /**
         * A wrapper for the container which will contain the textnode which will be used for calculations.
         * The container will be set to fill the parent element and the visibility will be set to hidden and overflow to
         * hidden on this container to make sure any temporary work isn't visible and doesn't effect anything else on the page.
         * Because the text node is being created under the parent element in the dom hireachy so that it inherits all of the correct css styles.
         * @name antie.widgets.label.texttruncation.workcontainer
         * @class
         * @param {DOMElement} [parentEl] The DOMElement that should contain this.
         * @param {Boolean} [measuringHorizontally] True if this container is being used to compare the width of the text to the width of the container.
         *                                          False if the container is being used to compare the height of the text to the height of the container.
         */
        function WorkContainer(parentEl, measuringHorizontally) {
            this._parentEl = parentEl;
            this._measuringHorizontally = measuringHorizontally;
            this._container = null;
            this._txtTruncationElNode = null;
            this._currentTxtNodeTxt = "";
            this._create();
            // the width and height of the box that the text should be truncated to fit into.
            // use the container (which has width auto and height 100%) clientWidth and clientHeight to get this value, not the parent el, because this takes into consideration any padding on the parent el
            // clientWidth and clientHeight includes padding (but not border or margin), but we know that container will have padding of 0 and will sit within parents padding :)
            this._w = this._container.clientWidth;
            this._h = this._container.clientHeight;
            this._cssManager = new CssManager(this._parentEl, this._measuringHorizontally);
        }

        WorkContainer.prototype._create = function() {

            // TODO: try and use framework
            this._container = document.createElement("div");
            this._container.style.display = "block";
            this._container.style.margin = "0";
            this._container.style.padding = "0";
            this._container.style.width = "auto";
            this._container.style.height = "100%";
            this._container.style.overflow = "hidden";
            this._container.style.visibility = "hidden";
            this._txtTruncationElNode = document.createTextNode("");
            this._container.appendChild(this._txtTruncationElNode);
            this._parentEl.appendChild(this._container);
        };

        /**
         * Destroy the container and the text node contained in it.
         */
        WorkContainer.prototype.destroy = function() {
            this._parentEl.removeChild(this._container);
            this._cssManager.restore();
        };

        /**
         * Determine if some text overflows the width if measuring horizontally, or height otherwise.
         * @param {String} [txt] The text to measure.
         * @returns True if the text is overflowing the container.
         */
        WorkContainer.prototype.isOver = function(txt) {
            // make sure only update the dom if necessary
            if (this._currentTxtNodeTxt !== txt) {
                this._currentTxtNodeTxt = txt;
                this._txtTruncationElNode.nodeValue = txt;
            }
            return this._measuringHorizontally ? this._container.clientWidth > this._w : this._container.clientHeight > this._h;
        };

        /**
         * Perform a binary chop to calculate the number of characters that fit into this WorkContainer.
         * @param {String} txt The source string to work on.
         * @param {String} txtEnd The text that would be added after the truncated text. E.g "...".
         *                        The length of this is not included in the returned value.
         * @returns The number of characters that fit in this WorkContainer.
         */
        WorkContainer.prototype.getNumCharactersThatFit = function(txt, txtEnd) {
            var positionGenerator = new PositionGenerator(txt.length);
            var position = txt.length;
            var txtWorkingOn = txt;
            while(positionGenerator.hasNext(this.isOver(txtWorkingOn))) {
                position = positionGenerator.next(this.isOver(txtWorkingOn));
                txtWorkingOn = txt.slice(0, position) + txtEnd;
            }
            return position;
        };
        return WorkContainer;
    }
);