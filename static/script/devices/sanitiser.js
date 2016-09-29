/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define('antie/devices/sanitiser', [], function () {

    'use strict';

    function Sanitiser (string) {
        this._string = string;
    }

    Sanitiser.prototype.setElementContent = function (el) {
        el.innerHTML = this._string;
    };

    return Sanitiser;
});
