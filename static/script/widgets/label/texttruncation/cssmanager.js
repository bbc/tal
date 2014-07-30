require.def('antie/widgets/label/texttruncation/cssmanager',
    [
    ],
    function () {
        "use strict";

        /**
         * Saves the elements css and applies changes necessary for text truncation calculations. Then can restore back the original styles.
         * @name antie.widgets.label.texttruncation.cssmanager
         * @class
         * @param {DOMElement} [el] The DOMElement to make the changes on.
         * @param {Boolean} [configureForMeasuringWidth] Configures the css for measuring the width instead of height.
         */
        function CssManager(el, configureForMeasuringWidth) {
            this._el = el;
            this._configureForMeasuringWidth = configureForMeasuringWidth;
            this._properties = {
                whiteSpace: null,
                width: null,
                height: null,
                display: null
            };
            this.save();
            this.configureForAlgorithm();
        };

        /**
         * Saves the current css values on the element which can later be restored with "restore".
         */
        CssManager.prototype.save = function() {
            for (var prop in this._properties) {
                this._properties[prop] = this._el.style[prop];
            }
        };

        /**
         * Restores the original css properties on the element back to the element.
         */
        CssManager.prototype.restore = function() {
            for (var prop in this._properties) {
                this._el.style[prop] = this._properties[prop];
            }
        };

        /**
         * Applies the css properties to the element that are necessary for the text truncation algorithm.
         */
        CssManager.prototype.configureForAlgorithm = function() {
            // the height should be set to auto so that we can use el.clientHeight to determine the height of the contents
            this._el.style.height = "auto";
            this._el.style.display = "inline-block";
            if (this._configureForMeasuringWidth) {
                // we will be measuring the width that is taken up as text is added so set the width to auto and make sure no wrapping occurs.
                this._el.style.whiteSpace = "nowrap";
                this._el.style.width = "auto";
            }
            else {
                this._el.style.whiteSpace = "normal";
            }
        };
        return CssManager;
    }
);