/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 *           (http://www.bbc.co.uk) and TAL Contributors (1)
 * 
 * (1) TAL Contributors are listed in the AUTHORS file and at
 * https://github.com/fmtvp/TAL/AUTHORS - please extend this file, not this
 * notice.
 * 
 * @license Licensed under the Apache License, Version 2.0 (the "License"); you
 *          may not use this file except in compliance with the License. You may
 *          obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 * All rights reserved Please contact us for an alternative licence
 */

(function() {
    // jshint newcap: false
    this.ApplicationLaunchAppTest = AsyncTestCase("Application_LaunchApp");

    this.ApplicationLaunchAppTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationLaunchAppTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    /**
     * Test that getCurrentAppURL() returns the correct base URL.
     */
    this.ApplicationLaunchAppTest.prototype.testGetCurrentAppURL = function(queue) {
        expectAsserts(1);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Configure BrowserDevice.getWindowLocation() to return canned data
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', getWindowLocationStub);
            
            assertEquals('Correct URL returned', 'https://test.invalid:12345/testurl/', application.getCurrentAppURL());
        });
    };

    /**
     * Test that getCurrentAppURLParameters() returns the correct set of query string data.
     */
    this.ApplicationLaunchAppTest.prototype.testGetCurrentAppURLParameters = function(queue) {
        expectAsserts(1);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Configure BrowserDevice.getWindowLocation() to return canned data
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', getWindowLocationStub);
            
            assertEquals('Correct query data returned', {
                a: 'x=0',
                b: '',
                z: undefined
            }, application.getCurrentAppURLParameters());
        });
    };

    /**
     * Test that launchAppFromURL() with just a URL attempts to navigate to the correct URL.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppFromURL = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Replace BrowserDevice.setWindowLocation() with a stub.
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');
            
            // Replace BrowserDevice.getWindowLocation() with a stub.
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation',
                function() {
                    return {
                        href: ''
                    };
                }
            );
            
            application.launchAppFromURL('http://example.com:55555/path/to/test.html');
                
            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html', setWindowLocationStub.getCall(0).args[0]);
        });
    };

    /**
     * Test that launchAppFromURL() with just a URL attempts to navigate to the correct URL with appended history.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppFromURLWithHistory = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Replace BrowserDevice.setWindowLocation() with a stub.
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');
            
            // Replace BrowserDevice.getWindowLocation() with a stub.
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation',
                function() {
                    return {
                        href: 'http://www.test.com/original/'
                    };
                }
            );
            
            application.launchAppFromURL('http://example.com:55555/path/to/test.html');
                
            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html#&*history=http://www.test.com/original/', setWindowLocationStub.getCall(0).args[0]);
        });
    };

    /**
     * Test that launchAppFromURL() with a URL and query only (appending new query params) attempts to navigate to the correct URL.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppFromURLQueryAppend = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Configure BrowserDevice.getWindowLocation() to return canned data
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                return {
                    search: '?device=sample&config=precert', 
                    href: 'http://www.test.com/?device=sample&config=precert'
                };
            });
            
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');
            application.launchAppFromURL('http://example.com:55555/path/to/test.html', {
                a: 'x=0',
                b: '',
                z: undefined
            });

            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html?device=sample&config=precert&a=x%3D0&b=&z#&*history=http://www.test.com/?device=sample&config=precert', setWindowLocationStub.getCall(0).args[0]);
        });
    };

    /**
     * Test that launchAppFromURL() with a URL and query only (appending new query params) attempts to navigate to the correct URL.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppFromURLQueryOverride = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Configure BrowserDevice.getWindowLocation() to return canned data
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                return {
                    search: '?device=sample&config=precert',
                    href: 'http://www.test.com/?device=sample&config=precert'
                };
            });
            
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');

            application.launchAppFromURL('http://example.com:55555/path/to/test.html', {
                a: 'x=0',
                b: '',
                z: undefined
            }, null, true);
            
            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html?a=x%3D0&b=&z#&*history=http://www.test.com/?device=sample&config=precert', setWindowLocationStub.getCall(0).args[0]);
        });
    };

    /**
     * Test that launchAppFromURL() with a URL and route only attempts to navigate to the correct URL.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppWithRoute = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Replace BrowserDevice.setWindowLocation() with a stub.
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');
            
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation',
                function() {
                    return {
                        href: 'http://www.test.com/original/'
                    };
                }
            );
            
            application.launchAppFromURL('http://example.com:55555/path/to/test.html', {}, ['here', 'is', 'a', 'route']);
            
            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html#here/is/a/route&*history=http://www.test.com/original/', setWindowLocationStub.getCall(0).args[0]);
            });
    };

    /**
     * Test that launchAppFromURL() with a URL, query and route attempts to navigate to the correct URL.
     */
    this.ApplicationLaunchAppTest.prototype.testLaunchAppFull = function(queue) {
        expectAsserts(2);
        
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            // Replace BrowserDevice.setWindowLocation() with a stub.
            var setWindowLocationStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl');
                       
            this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation',
                function() {
                    return {
                        href: 'http://www.test.com/original/'
                    };
                }
            );
            
            application.launchAppFromURL('http://example.com:55555/path/to/test.html', {
                a: 'x=0',
                b: '',
                z: undefined
            },
            ['here', 'is', 'a', 'route']);
       
            assert('window.location.assign() called', setWindowLocationStub.calledOnce);
            assertEquals('Correct URL', 'http://example.com:55555/path/to/test.html?a=x%3D0&b=&z#here/is/a/route&*history=http://www.test.com/original/', setWindowLocationStub.getCall(0).args[0]);
            });
    };

    /**
     * Helper function for testGetCurrentAppURL(), etc. A stub of window.location data.
     */
    function getWindowLocationStub() {
        return {
            protocol: 'https:',
            host: 'test.invalid:12345',
            pathname: '/testurl/',
            hash: '#route',
            search: '?a=x%3D0&b=&z'
        };
    }
})();
