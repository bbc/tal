/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */
require(
    [
        'antie/class',
        'antie/devices/browserdevice',
        'antie/devices/device'
    ],
    function(Class, BrowserDevice, Device) {
        'use strict';

        describe('antie.devices.Device', function() {
            var device;

            beforeEach(function() {
                device = new Device(antie.framework.deviceConfiguration);
            });

            it('should extend from Class', function() {
                expect(device).toEqual(jasmine.any(Class));
            });

            it('does not support broadcastSource', function() {
                expect(device.isBroadcastSourceSupported()).toBe(false);
            });

            it('chokes on call to Broadcast API', function() {
                // expect(function() {
                //     // Method under test
                //     device.createBroadcastSource();
                // }).toThrowError('Broadcast API not available on this device.');   // Jasmine 2.0

                // In the absence of Jasmine 2.0 toThrowError() we must check all this manually in a try/catch
                try {
                    // Method under test
                    device.createBroadcastSource();
                    expect('Error not thrown').toBe('Error thrown');  // Fail the test (in the absence of the Jasmine 2.4 fail() method)
                } catch (e) {
                    expect(e.message).toBe('Broadcast API not available on this device.');
                }
            });

            it('asynchronously calls onSuccess callback when valid config is passed to Device.load', function() {
                var done = false;

                var callbacks = jasmine.createSpyObj('callbacks', ['onSuccess', 'onError']);
                callbacks.onSuccess.andCallFake(function() {
                    done = true;
                });
                callbacks.onError.andCallFake(function() {
                    done = true;
                });

                // This is the class that will be instantiated and passed to onSuccess
                expect(antie.framework.deviceConfiguration.modules.base).toBe('antie/devices/browserdevice');

                runs(function() {
                    // Method under test
                    Device.load(antie.framework.deviceConfiguration, callbacks);
                });

                // Wait for onSuccess to set done.  More verbose than Jasmine 2.0 but works fine.
                waitsFor(
                    function() {
                        return done;
                    },
                    'timed out waiting for onSuccess callback',
                    500
                );

                runs(function() {
                    expect(callbacks.onSuccess).toHaveBeenCalledWith(jasmine.any(BrowserDevice));  // New instance of device named in antie.framework.deviceConfiguration.modules.base
                    expect(callbacks.onSuccess.calls[0].args[0].getConfig()).toBe(antie.framework.deviceConfiguration);
                    expect(callbacks.onError).not.toHaveBeenCalled();
                });
            });

            it('imediately calls onError callback when invalid config is passed to Device.load', function() {
                var callbacks = jasmine.createSpyObj('callbacks', ['onSuccess', 'onError']);

                expect(function() {
                    // Method under test
                    Device.load({}, callbacks);
                }).not.toThrow();

                expect(callbacks.onSuccess).not.toHaveBeenCalled();
                expect(callbacks.onError).toHaveBeenCalledWith(jasmine.any(Object));
                expect(callbacks.onError.calls[0].args[0].message).toMatch(/'undefined' is not an object/);
            });

            it('chokes on default exit()', function() {
                // expect(function() {
                //     // Method under test
                //     device.exit();
                // }).toThrowError('Not supported on this device.');   // Jasmine 2.0

                // In the absence of Jasmine 2.0 toThrowError() we must check all this manually in a try/catch
                try {
                    // Method under test
                    device.exit();
                    expect('Error not thrown').toBe('Error thrown');  // Fail the test (in the absence of the Jasmine 2.4 fail() method)
                } catch (e) {
                    expect(e.message).toBe('Not supported on this device.');
                }
            });

            it('calls exit() on default exitToBroadcast(', function() {
                spyOn(device, 'exit');

                // Method under test
                device.exitToBroadcast();

                expect(device.exit).toHaveBeenCalledWith();
            });

        });
    }
);
