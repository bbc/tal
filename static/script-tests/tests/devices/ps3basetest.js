/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

require(
    [
        'antie/devices/ps3base'
    ],
    function (PS3Base) {
        'use strict';

        describe('antie.devices.PS3Base', function () {
            var device;

            beforeEach(function () {
                device = new PS3Base(antie.framework.deviceConfiguration);
            });

            it('should expose nativeCallback as a method', function () {
                expect(typeof device.nativeCallback).toEqual('function');
            });

            it('should expose addNativeEventListener as a method', function () {
                expect(typeof device.addNativeEventListener).toEqual('function');
            });

            it('should expose removeNativeEventListener as a method', function () {
                expect(typeof device.removeNativeEventListener).toEqual('function');
            });

            it('should expose nativeCommand as a method', function () {
                expect(typeof device.nativeCommand).toEqual('function');
            });

            it('should expose loadAuthenticatedURL as a method', function () {
                expect(typeof device.loadAuthenticatedURL).toEqual('function');
            });

            it('should expose isHDEnabled as a method', function () {
                expect(typeof device.isHDEnabled).toEqual('function');
            });
        });
    });
