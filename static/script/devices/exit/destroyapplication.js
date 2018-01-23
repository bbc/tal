/**
 * @fileOverview    Requirejs module containing the class for the destroyApplication exit strategy.
 *                  If following the OIPF spec, devices should do the same on a call to window.close()
 *                  as when using Application.destroyApplication, so this exit strategy is ONLY
 *                  necessary when a device does not follow the spec.
 *                  Otherwise, use the closewindow strategy. It's much simpler.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/destroyapplication',
    [
        'antie/devices/browserdevice',
        'antie/lib/tal-exit-strategies'
    ],
    function (Device, Exit) {
        'use strict';

        Exit.destroyApplication();
    }
);
