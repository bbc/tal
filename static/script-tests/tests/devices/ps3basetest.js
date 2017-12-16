/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

require(
    [
        'antie/devices/ps3base',
        'antie/devices/data/nativejson'
    ],
    function (PS3Base) {
        'use strict';

        describe('antie.devices.PS3Base', function () {
            var device;

            // accessfunction is the way playstation sends system events from the WebMAF to the DOM
            function example_accessfunction(json) {
                // See: https://github.com/bbc/tal-page-strategies/blob/master/playstation3/body
                device.nativeCallback(JSON.stringify(json));
            }

            beforeEach(function () {
                device = new PS3Base(antie.framework.deviceConfiguration);
            });

            it('should respond to a registered system event', function (done) {
                device.addNativeEventListener('externalParameter', function (data) {
                    expect(data.command).toEqual('externalParameter');
                    expect(data.value).toEqual('some data');
                    done();
                });
                example_accessfunction({
                    command: 'externalParameter',
                    value: 'some data'
                });
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

            it('should convert any system events into message events using window.postEvent', function (done) {
                window.addEventListener('message', function(event) {
                    expect(event.data.command).toEqual('externalParameter');
                    expect(event.data.value).toEqual('some data');
                    done();
                });
                example_accessfunction({
                    command: 'externalParameter',
                    value: 'some data'
                });
            });
        });
    });
