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
            var mockXMLHttpRequest;
            var device;

            beforeEach(function() {
                mockXMLHttpRequest = jasmine.createSpyObj('mockXMLHttpRequest', ['open', 'send', 'setRequestHeader']);
                mockXMLHttpRequest.readyState = 0;
                mockXMLHttpRequest.responseText = '';
                mockXMLHttpRequest.status = 0;

                device = new Device(antie.framework.deviceConfiguration);
                spyOn(device, '_newXMLHttpRequest').andReturn(mockXMLHttpRequest);
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

            it('calls exit() on default exitToBroadcast()', function() {
                spyOn(device, 'exit');

                // Method under test
                device.exitToBroadcast();

                expect(device.exit).toHaveBeenCalledWith();
            });

            it('sends xhr request with specified method and data', function() {
                var opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: '<submit>Data</submit>'
                };

                // Method under test
                var xhr = device.loadURL('http://test.uri/', opts);

                expect(xhr).toBe(mockXMLHttpRequest);
                expect(mockXMLHttpRequest.open).toHaveBeenCalledWith('POST', 'http://test.uri/', true);
                expect(mockXMLHttpRequest.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
                expect(mockXMLHttpRequest.send).toHaveBeenCalledWith('<submit>Data</submit>');
            });

            it('uses GET if there is no opts.method', function() {
                spyOn(XMLHttpRequest.prototype, 'open');
                spyOn(XMLHttpRequest.prototype, 'send');

                var opts = { };

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(mockXMLHttpRequest.open).toHaveBeenCalledWith('GET', 'http://test.uri/', true);
            });

            it('sends null if there is no opts.data', function() {
                var opts = { };

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(mockXMLHttpRequest.send).toHaveBeenCalledWith(null);
            });

            it('does not set any headers if there is no opts.headers property', function() {
                var opts = { };

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(mockXMLHttpRequest.setRequestHeader).not.toHaveBeenCalled();
            });

            it('only inspects the opts.headers object for headers, not its whole prototype chain', function() {
                function HeadersBase() { }
                HeadersBase.prototype.notOwnProperty = 'gibberish';   // notOwnProperty is on the headers prototype chain

                var opts = {
                    headers: new HeadersBase()
                };
                opts.headers['Content-Type'] = 'application/json';    // Content-Type is on the headers object itself

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(mockXMLHttpRequest.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
                expect(mockXMLHttpRequest.setRequestHeader).not.toHaveBeenCalledWith('notOwnProperty', 'gibberishn');
                expect(mockXMLHttpRequest.setRequestHeader.calls.length).toBe(1);
            });

            it('calls onError if XMLHttpRequest open() throws an error', function() {
                var SECURITY_ERR = {type: 'SECURITY_ERR'};
                mockXMLHttpRequest.open.andCallFake(function() {
                    throw(SECURITY_ERR);
                });

                var opts = jasmine.createSpyObj('opts', ['onLoad', 'onError']);

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(opts.onError).toHaveBeenCalledWith(SECURITY_ERR);
                expect(opts.onLoad).not.toHaveBeenCalled();
                expect(mockXMLHttpRequest.send).not.toHaveBeenCalled();
            });

            it('still does not call onLoad if XMLHttpRequest open() throws an error, even if no onError has been supplied', function() {
                var SECURITY_ERR = {type: 'SECURITY_ERR'};
                mockXMLHttpRequest.open.andCallFake(function() {
                    throw(SECURITY_ERR);
                });

                var opts = jasmine.createSpyObj('opts', ['onLoad']);

                // Method under test
                device.loadURL('http://test.uri/', opts);

                expect(opts.onLoad).not.toHaveBeenCalled();
                expect(mockXMLHttpRequest.send).not.toHaveBeenCalled();
            });

            it('calls onLoad with success response', function() {
                var opts = jasmine.createSpyObj('opts', ['onLoad', 'onError']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 4;
                xhr.status = 200;
                xhr.responseText = '{"status":"done"}';

                // Method under test
                xhr.onreadystatechange();

                expect(xhr.onreadystatechange).toBeNull();
                expect(opts.onLoad).toHaveBeenCalledWith('{"status":"done"}', 200);
                expect(opts.onError).not.toHaveBeenCalled();
            });

            it('does not call onError with success response, even if there is no onLoad callback', function() {
                var opts = jasmine.createSpyObj('opts', ['onError']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 4;
                xhr.status = 200;
                xhr.responseText = '{"status":"done"}';

                // Method under test
                xhr.onreadystatechange();

                expect(xhr.onreadystatechange).toBeNull();
                expect(opts.onError).not.toHaveBeenCalled();
            });

            it('does not call onLoad if readyState is not 4', function() {
                var opts = jasmine.createSpyObj('opts', ['onLoad', 'onError']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 3;
                xhr.status = 200;
                xhr.responseText = '{"status":"done"}';

                // Method under test
                xhr.onreadystatechange();

                expect(xhr.onreadystatechange).not.toBeNull();
                expect(opts.onLoad).not.toHaveBeenCalled();
                expect(opts.onError).not.toHaveBeenCalled();
            });

            it('calls onError with non 2xx response', function() {
                var opts = jasmine.createSpyObj('opts', ['onLoad', 'onError']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 4;
                xhr.status = 300;
                xhr.responseText = '{"status":"redirect"}';

                // Method under test
                xhr.onreadystatechange(xhr);

                expect(xhr.onreadystatechange).toBeNull();
                expect(opts.onLoad).not.toHaveBeenCalled();
                expect(opts.onError).toHaveBeenCalledWith('{"status":"redirect"}', 300);
            });

            it('does not call onLoad with non 2xx response, even if there is no onError callback', function() {
                var opts = jasmine.createSpyObj('opts', ['onLoad']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 4;
                xhr.status = 300;
                xhr.responseText = '{"status":"redirect"}';

                // Method under test
                xhr.onreadystatechange();

                expect(xhr.onreadystatechange).toBeNull();
                expect(opts.onLoad).not.toHaveBeenCalled();
            });

            it('does not call onError if readyState is not 4', function() {
                var opts = jasmine.createSpyObj('opts', ['onLoad', 'onError']);

                var xhr = device.loadURL('http://test.uri/', opts);
                xhr.readyState = 2;
                xhr.status = 300;
                xhr.responseText = '{"status":"redirect"}';

                // Method under test
                xhr.onreadystatechange();

                expect(xhr.onreadystatechange).not.toBeNull();
                expect(opts.onLoad).not.toHaveBeenCalled();
                expect(opts.onError).not.toHaveBeenCalled();
            });

        });
    }
);
