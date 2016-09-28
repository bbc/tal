/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
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

(function() {
    this.DefaultNetworkTest = AsyncTestCase('Network (Default)');

    this.DefaultNetworkTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        this.xhr = sinon.useFakeXMLHttpRequest();

        var requests = [];
        this.requests = requests;

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
    };

    this.DefaultNetworkTest.prototype.tearDown = function() {
        this.sandbox.restore();
        this.xhr.restore();
    };

    // make sure test hangs in there until after timeouts and responses have all completed
    this.DefaultNetworkTest.prototype.waitFor = function(callbacks, timeInMillis) {
        var notify = callbacks.add(function() { });
        setTimeout(notify, timeInMillis);
    };

    this.DefaultNetworkTest.prototype.testLoadScriptWithTimedOutResponse = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var clock = sinon.useFakeTimers();

            var opts = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };
            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, opts, 100, 'test1');

            clock.tick(1000);

            assert(opts.onSuccess.notCalled);
            assert(opts.onError.called);

            clock.restore();
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptWithDefaultFiveSecondTimedOutResponse = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var clock = sinon.useFakeTimers();

            var opts = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/timedoutdynamicscript.js?callback=%callback%', /%callback%/, opts, undefined, 'test');

            clock.tick(6000);

            assert(opts.onSuccess.notCalled);
            assert(opts.onError.called);

            clock.restore();
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptWithSuccessResponse = function(queue) {
        expectAsserts(6);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var opts = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, opts, 1000, 'test1');

            assert(head.appendChild.calledOnce);
            var script = head.appendChild.args[0][0];
            var url = script.src;

            // Some browsers return the host name/port rather than the relative URL we pass in. which is why we only
            // check the end of the string here:
            var expectedURL = '/test/script-tests/fixtures/dynamicscript1.js?callback=_antie_callback_test1';
            assertEquals(expectedURL, url.substr(url.length - expectedURL.length));

            assertFunction(window._antie_callback_test1);

            var resultData = { };

            window._antie_callback_test1(resultData);

            assert(opts.onSuccess.calledOnce);
            assert(opts.onError.notCalled);
            assertSame(resultData, opts.onSuccess.args[0][0]);
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptMultipleRequestsWithDifferentSuffixes = function(queue) {
        expectAsserts(11);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var opts1 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            var opts2 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, opts1, 1000, 'test1');
            device.loadScript('/test/script-tests/fixtures/dynamicscript2.js?callback=%callback%', /%callback%/, opts2, 1000, 'test2');

            assert(head.appendChild.calledTwice);

            var script1 = head.appendChild.args[0][0];
            var url1 = script1.src;

            // Some browsers return the host name/port rather than the relative URL we pass in. which is why we only
            // check the end of the string here:
            var expectedURL1 = '/test/script-tests/fixtures/dynamicscript1.js?callback=_antie_callback_test1';
            assertEquals(expectedURL1, url1.substr(url1.length - expectedURL1.length));

            var script2 = head.appendChild.args[1][0];
            var url2 = script2.src;

            var expectedURL2 = '/test/script-tests/fixtures/dynamicscript2.js?callback=_antie_callback_test2';
            assertEquals(expectedURL2, url2.substr(url2.length - expectedURL2.length));

            assertFunction(window._antie_callback_test1);
            assertFunction(window._antie_callback_test2);

            var resultData1 = { };
            var resultData2 = { };

            window._antie_callback_test1(resultData1);
            window._antie_callback_test2(resultData2);

            assert(opts1.onSuccess.calledOnce);
            assert(opts1.onError.notCalled);
            assertSame(resultData1, opts1.onSuccess.args[0][0]);

            assert(opts2.onSuccess.calledOnce);
            assert(opts2.onError.notCalled);
            assertSame(resultData2, opts2.onSuccess.args[0][0]);
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptMultipleRequestsWithSameSuffixThrowsError = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var exceptionReceived = false;

            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, {}, 1000, 'test1');
            try {
                device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, {}, 1, 'test1');
            } catch (e){
                exceptionReceived = true;
            }

            assert(exceptionReceived);

            // Clean up
            assertFunction(window._antie_callback_test1);
            window._antie_callback_test1('');
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptSequentialRequestsWithSameSuffixAreAllowed = function(queue) {
        expectAsserts(13);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var opts1 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, opts1, 1000, 'test1');

            assert(head.appendChild.calledOnce);

            var script1 = head.appendChild.args[0][0];
            var url1 = script1.src;

            // Some browsers return the host name/port rather than the relative URL we pass in. which is why we only
            // check the end of the string here:
            var expectedURL1 = '/test/script-tests/fixtures/dynamicscript1.js?callback=_antie_callback_test1';
            assertEquals(expectedURL1, url1.substr(url1.length - expectedURL1.length));

            assertFunction(window._antie_callback_test1);

            var resultData1 = { };

            window._antie_callback_test1(resultData1);

            assert(opts1.onSuccess.calledOnce);
            assert(opts1.onError.notCalled);
            assertSame(resultData1, opts1.onSuccess.args[0][0]);

            assertUndefined(window._antie_callback_test1);

            var opts2 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%', /%callback%/, opts2, 1000, 'test1');

            assert(head.appendChild.calledTwice);

            var script2 = head.appendChild.args[1][0];
            var url2 = script2.src;
            assertEquals(expectedURL1, url2.substr(url2.length - expectedURL1.length));

            assertFunction(window._antie_callback_test1);

            var resultData2 = { };

            window._antie_callback_test1(resultData2);

            assert(opts2.onSuccess.calledOnce);
            assert(opts2.onError.notCalled);
            assertSame(resultData2, opts2.onSuccess.args[0][0]);
        });
    };

    this.DefaultNetworkTest.prototype.testLoadScriptSubsequentRequestWithSameSuffixIsAllowedAfterTimeout = function(queue) {
        expectAsserts(9);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var getElementStub = this.sandbox.stub(document, 'getElementsByTagName');
            var head = { appendChild: this.sandbox.stub() };
            getElementStub.returns([ head ]);

            var clock = sinon.useFakeTimers();

            var opts1 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/timedoutdynamicscript.js?callback=%callback%', /%callback%/, opts1, 10, 'test1');

            clock.tick(20);

            assert(opts1.onSuccess.notCalled);
            assert(opts1.onError.called);

            assertUndefined(window._antie_callback_test1);

            var opts2 = {
                onError: this.sandbox.stub(),
                onSuccess: this.sandbox.stub()
            };

            device.loadScript('/test/script-tests/fixtures/timedoutdynamicscript.js?callback=%callback%', /%callback%/, opts2, 10, 'test1');

            assert(head.appendChild.calledTwice);

            var script2 = head.appendChild.args[1][0];
            var url2 = script2.src;

            var expectedURL = '/test/script-tests/fixtures/timedoutdynamicscript.js?callback=_antie_callback_test1';

            assertEquals(expectedURL, url2.substr(url2.length - expectedURL.length));

            assertFunction(window._antie_callback_test1);

            var resultData2 = { };

            window._antie_callback_test1(resultData2);

            assert(opts2.onSuccess.calledOnce);
            assert(opts2.onError.notCalled);
            assertSame(resultData2, opts2.onSuccess.args[0][0]);

            clock.restore();

        });
    };

    this.DefaultNetworkTest.prototype.testLoadAuthenticatedURL = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadAuthenticatedURL('/test/script-tests/fixtures/test.json', opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(200, { 'Content-Type': 'application/json' }, '{"hello":"world"}');

            assert(opts.onError.notCalled);
            assert(opts.onLoad.calledOnce);
            assert(opts.onLoad.calledWith('{"hello":"world"}', 200));
        });
    };

    this.DefaultNetworkTest.prototype.testLoadAuthenticatedURLError = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadAuthenticatedURL('/test/script-tests/fixtures/doesnotexist.json', opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(404, { 'Content-Type': 'application/json' }, '{"hello":"world"}');

            assert(opts.onLoad.notCalled);
            assert(opts.onError.calledOnce);
            assert(opts.onError.calledWith('{"hello":"world"}', 404));
        });
    };


    this.DefaultNetworkTest.prototype.testCrossDomainPost = function(queue) {
        expectAsserts(35);

        // FIXME - This is an awful, awful test introduced to replace a queue.call based JSTestDriver test that mocked
        // some, but not all, of the network traffic involved. Both this test and the production code that it is testing
        // need a heap of refactoring and re-writing to clean them up.

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var setTimeoutSpy = this.sandbox.spy(window, 'setTimeout');
            var clearTimeoutSpy = this.sandbox.spy(window, 'clearTimeout');

            var form = {
                submit: this.sandbox.stub(),
                appendChild: this.sandbox.stub()
            };
            var iframe = {
                style: { },
                document: {
                    createElement: this.sandbox.stub(),
                    appendChild: this.sandbox.stub()
                },
                parentNode: {
                    removeChild: this.sandbox.stub()
                }
            };
            var inputs = [ ];
            var createElementStub = this.sandbox.stub(document, 'createElement', function(type) {
                if (type === 'iframe') {
                    return iframe;
                } else if (type === 'input') {
                    var input = { };
                    inputs.push(input);
                    return input;
                }
                throw 'Unexpected creation';
            });
            var appendChildStub = this.sandbox.stub(document.body, 'appendChild');

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub(),
                blankUrl: '/test/script-tests/fixtures/blank.html'
            };

            var postData = {'goodbye':'salford', 'hello':'world'};

            var url = 'http://10.1.1.255/';

            device.crossDomainPost(url, postData, opts);

            assert(createElementStub.calledOnce);
            assert(createElementStub.calledWith('iframe'));
            assert(appendChildStub.calledWith(iframe));
            assertEquals('/test/script-tests/fixtures/blank.html#1', iframe.src);
            assertFunction(iframe.onload);
            assert(iframe.document.createElement.notCalled);
            assert(setTimeoutSpy.calledOnce);

            iframe.contentWindow = {
                location: { href: '/test/script-tests/fixtures/blank.html#1' },
                document: {
                    body: { appendChild: this.sandbox.stub() },
                    createElement: this.sandbox.stub()
                }
            };

            iframe.contentWindow.document.createElement.returns(form);

            // Simulate loading of blank URL
            iframe.onload();

            assert(iframe.contentWindow.document.createElement.calledOnce);
            assert(iframe.contentWindow.document.createElement.calledWith('form'));
            assert(iframe.contentWindow.document.body.appendChild.calledOnce);
            assert(iframe.contentWindow.document.body.appendChild.calledWith(form));
            assertEquals(3,createElementStub.callCount);
            assertEquals(2, inputs.length);

            assertEquals('goodbye', inputs[0].name);
            assertEquals('salford', inputs[0].value);
            assertEquals('hidden', inputs[0].type);
            assertEquals('hello', inputs[1].name);
            assertEquals('world', inputs[1].value);
            assertEquals('hidden', inputs[1].type);

            assertEquals('POST', form.method);
            assertEquals(url, form.action);
            assert(form.appendChild.calledTwice);
            assert(form.appendChild.calledWith(inputs[0]));
            assert(form.appendChild.calledWith(inputs[1]));

            assert(form.submit.calledOnce);
            assertFunction(iframe.onload);

            var response = { };
            iframe.contentWindow.name = response;

            // Simulate success of POST
            iframe.onload();

            assertNull(iframe.onload);
            assert(iframe.parentNode.removeChild.calledOnce);
            assert(iframe.parentNode.removeChild.calledWith(iframe));
            assert(opts.onLoad.calledOnce);
            assert(opts.onLoad.calledWith(response));
            assert(opts.onError.notCalled);
            assert(setTimeoutSpy.calledOnce);
            assert(clearTimeoutSpy.calledOnce);
            assert(clearTimeoutSpy.calledWith(setTimeoutSpy.returnValues[0]));
        });

    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetParsesJsonResponseFromLoadUrlWhenCorsIsSupported = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': true }});
            var testUrl = 'http://test';
            var successSpy = this.sandbox.stub();

            device.executeCrossDomainGet(testUrl, {onSuccess: successSpy});

            assertEquals(1, this.requests.length);

            this.requests[0].respond(200, { 'Content-Type': 'application/json' }, '{ "test" : "myValue" }');

            assert(successSpy.calledOnce);
            assert(successSpy.calledWith({ 'test' : 'myValue' }));
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetHandlesErrorFromLoadUrlWhenCorsIsSupported = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': true }});
            var testUrl = 'http://test';
            var errorSpy = this.sandbox.stub();

            device.executeCrossDomainGet(testUrl, {onError: errorSpy});

            assertEquals(1, this.requests.length);

            this.requests[0].respond(500, {}, '{}');

            assert(errorSpy.calledOnce);
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetDelegatesToLoadScriptWhenCorsIsNotSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});
            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();
            var myId = 'test';
            var testTimeout = 1;
            var testUrl = 'http://test';
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, {onSuccess: successSpy, onError: errorSpy}, {timeout: testTimeout, id: myId});
            assert(loadScriptStub.calledWith(testUrl + '?callback=%callback%', /%callback%/, {onSuccess : successSpy, onError : errorSpy}, testTimeout, myId));
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainDelegationToLoadScriptWhenCorsIsNotSupportedAllowsCallbackNameChange = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});
            var testUrl = 'http://test';
            var callbackKey = 'jsonpCallback';
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, {}, {callbackKey: callbackKey});
            assertEquals(testUrl + '?jsonpCallback=%callback%', loadScriptStub.getCall(0).args[0]);
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainDelegationToLoadScriptWhenCorsIsNotSupportedRespectsExistingQueryParameters = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});
            var testUrl = 'http://test?existingQueryString=blah';
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, {});
            assertEquals('http://test?callback=%callback%&existingQueryString=blah', loadScriptStub.getCall(0).args[0]);
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostCallsLoadUrlWithJsonPayloadWhenCorsIsSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': true }});
            var loadUrlStub = this.sandbox.stub(BrowserDevice.prototype, 'loadURL');

            var message = { test : 'myValue' };
            var payload = '{"test":"myValue"}';
            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();

            var expectedArgs = {
                onLoad : successSpy,
                onError : errorSpy,
                headers : {
                    'Content-Type' : 'application/json'
                },
                method : 'POST',
                data : payload
            };

            var testUrl = 'http://test';
            var opts = {
                onLoad : successSpy,
                onError : errorSpy
            };
            device.executeCrossDomainPost(testUrl, message, opts);

            assert(loadUrlStub.calledWith(testUrl, expectedArgs));
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetWithBearerTokenOptionWhenCorsIsSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': true }});

            var message = { test : 'myValue' };
            var payload = JSON.stringify(message);

            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();

            var testUrl = 'http://test';
            var opts = {
                onSuccess : successSpy,
                onError : errorSpy,
                bearerToken : 'abc123'
            };
            device.executeCrossDomainGet(testUrl, opts);

            assertEquals(1, this.requests.length);

            assertEquals('http://test', this.requests[0].url);
            assertEquals('GET', this.requests[0].method);
            assertEquals(null, this.requests[0].requestBody);
            assertEquals('Bearer abc123', this.requests[0].requestHeaders.Authorization);

            this.requests[0].respond(200, { 'Content-Type': 'application/json;charset=utf-8' }, payload);
            assert(errorSpy.notCalled);
            assert(successSpy.calledOnce);
            assert(successSpy.calledWith(message));
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetWithBearerTokenOptionWhenCorsIsNotSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});
            var testUrl = 'http://test?existingQueryString=blah';
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, { bearerToken: 'abc123' });
            assertEquals('http://test?callback=%callback%&existingQueryString=blah&bearerToken=abc123', loadScriptStub.getCall(0).args[0]);
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostWithBearerTokenOptionWhenCorsIsSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': true }});

            var message = { test : 'myValue' };
            var payload = JSON.stringify(message);

            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();

            var testUrl = 'http://test';
            var callbacks = {
                onLoad : successSpy,
                onError : errorSpy,
                bearerToken : 'abc123'
            };
            device.executeCrossDomainPost(testUrl, message, callbacks);

            assertEquals(1, this.requests.length);

            assertEquals('http://test', this.requests[0].url);
            assertEquals('POST', this.requests[0].method);
            assertEquals(payload, this.requests[0].requestBody);
            assertEquals('Bearer abc123', this.requests[0].requestHeaders.Authorization);
            assertEquals('application/json;charset=utf-8', this.requests[0].requestHeaders['Content-Type']);

            this.requests[0].respond(200);

            assert(errorSpy.notCalled);
            assert(successSpy.calledOnce);
            assert(successSpy.calledWith(''));
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostWithBearerTokenOptionWhenCorsIsNotSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});

            var testUrl = 'http://test';
            var message = { test : 'myValue' };
            var payload = '{"test":"myValue"}';
            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();
            var opts = {
                onLoad : successSpy,
                onError : errorSpy,
                fieldName : 'myField',
                bearerToken : 'abc123'
            };

            var crossDomainPostStub = this.sandbox.stub(BrowserDevice.prototype, 'crossDomainPost');

            device.executeCrossDomainPost(testUrl, message, opts);
            assert(crossDomainPostStub.calledWith(testUrl, { 'myField' : payload, 'bearerToken' : 'abc123' }, { onLoad : successSpy, onError : errorSpy, blankUrl: undefined } ) );
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostCallsCrossDomainPostWhenCorsIsNotSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});

            var testUrl = 'http://test';
            var message = { test : 'myValue' };
            var payload = '{"test":"myValue"}';
            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();
            var opts = { onLoad : successSpy, onError : errorSpy, fieldName : 'myField' };

            var crossDomainPostStub = this.sandbox.stub(BrowserDevice.prototype, 'crossDomainPost');

            device.executeCrossDomainPost(testUrl, message, opts);
            assert(crossDomainPostStub.calledWith(testUrl, { 'myField' : payload }, { onLoad : successSpy, onError : errorSpy, blankUrl: undefined } ) );
        });
    };

    this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostCallsCrossDomainPostWithaCustomIframeWhenCorsIsNotSupported = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            var device = new BrowserDevice({'networking': { 'supportsCORS': false }});

            var testUrl = 'http://test';
            var message = { test : 'myValue' };
            var payload = '{"test":"myValue"}';
            var successSpy = this.sandbox.spy();
            var errorSpy = this.sandbox.spy();
            var opts = { onLoad : successSpy, onError : errorSpy, fieldName : 'myField', blankUrl: '/not-blank.html' };

            var crossDomainPostStub = this.sandbox.stub(BrowserDevice.prototype, 'crossDomainPost');

            device.executeCrossDomainPost(testUrl, message, opts);
            assert(crossDomainPostStub.calledWith(testUrl, { 'myField' : payload }, { onLoad : successSpy, onError : errorSpy, blankUrl: '/not-blank.html' } ) );
        });
    };


}());
