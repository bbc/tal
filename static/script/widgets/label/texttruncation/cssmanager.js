require.def('antie/widgets/label/texttruncation/cssmanager',
    [
    ],
    function () {
        "use strict";

        // save copies of the current css values for the properties that will be changed
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

        CssManager.prototype.save = function() {
            for (var prop in this._properties) {
                this._properties[prop] = this._el.style[prop];
            }
        };

        CssManager.prototype.restore = function() {
            for (var prop in this._properties) {
                this._el.style[prop] = this._properties[prop];
            }
        };

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