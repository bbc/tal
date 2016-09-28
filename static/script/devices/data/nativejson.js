/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

/*
 * @fileOverview Requirejs modifier to use native JSON decoding/encoding if supported by the browser
 */
define(
    'antie/devices/data/nativejson',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /* Patch Device.prototype.encodeJson and Device.prototype.decodeJson */
        Device.prototype.decodeJson = function(json) {
            return JSON.parse(json);
        };
        Device.prototype.encodeJson = function(obj) {
            return JSON.stringify(obj);
        };
    }
);
