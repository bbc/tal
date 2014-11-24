require.def('antie/sanitiser', [], function () {

    'use strict';

    function Sanitiser (string) {
        this._string = string;
    }

    Sanitiser.prototype.appendToElement = function (el) {
        el.innerHTML = this._string;
    }

    return Sanitiser;
});