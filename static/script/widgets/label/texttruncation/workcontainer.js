require.def('antie/widgets/label/texttruncation/workcontainer',
    [
    ],
    function () {
        "use strict";

        // put the text node that we will be working on inside a container in the target el.
        // the container will be set to fill the main element
        // this means we can set the visibility to hidden and overflow to hidden on this container to make sure any temporary work isn't visible and doesn't effect anything else on the page.
        // the text node must be created under the el in the dom hireachy so that it inherits all the correct css styles.
        function WorkContainer(parentEl, measuringHorizontally) {
            this._parentEl = parentEl;
            this._measuringHorizontally = measuringHorizontally;
            this._container = null;
            this._txtTruncationElNode = null;
            this._create();
            // the width and height of the box that the text should be truncated to fit into.
            // use the container (which has width auto and height 100%) clientWidth and clientHeight to get this value, not the parent el, because this takes into consideration any padding on the parent el
            // clientWidth and clientHeight includes padding (but not border or margin), but we know that container will have padding of 0 and will sit within parents padding :)
            this.w = this._container.clientWidth;
            this.h = this._container.clientHeight;
        }

        WorkContainer.prototype._create = function() {
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

        WorkContainer.prototype.destroy = function() {
            this._container.removeChild(this._txtTruncationElNode); //TODO: check this is necessary
            this._parentEl.removeChild(this._container);
        };

        WorkContainer.prototype.setTxt = function(txt) {
            this._txtTruncationElNode.nodeValue = txt;
        };

        WorkContainer.prototype.isOver = function() {
            return this._measuringHorizontally ? this._container.clientWidth > this.w : this._container.clientHeight > this.h;
        };

        return WorkContainer;
    }
);