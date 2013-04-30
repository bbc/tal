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


(function() {
    /* jshint newcap: false */
    this.ApplicationExitTest = AsyncTestCase("Application (Exit)");

    this.ApplicationExitTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationExitTest.prototype.tearDown = function() {
        this.sandbox.restore();

        if(this.application) {
            this.application.destroy();
            this.application = null;
        }
    };

    this.ApplicationExitTest.prototype.testExitWithNoHistoryCallsDeviceExit = function(queue) {
        
        queuedApplicationInit(
            queue, 
            "lib/mockapplication", 
            [
                "antie/devices/browserdevice"
            ], 
            function(application, BrowserDevice) {
                var device, exitStub;
                
                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: "http://www.test.com/"
                    };
                });
                
                device = application.getDevice();
                exitStub = this.sandbox.stub(device, 'exit', function() {});
                
                application.exit();
                assert(exitStub.calledOnce);
                
            }
        );
    };
    
    this.ApplicationExitTest.prototype.testExitHistoryCallsLastHistory = function(queue) {
        
        queuedApplicationInit(
            queue, 
            "lib/mockapplication", 
            [
                "antie/devices/browserdevice"
            ], 
            function(application, BrowserDevice) {
                var setUrlStub;
                
                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: "http://www.test.com/#&history=http://www.back.com/"
                    };
                });
                
                setUrlStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl', function() {});

                application.exit();
                assert(setUrlStub.calledOnce);
                assert(setUrlStub.calledWith('http://www.back.com/'));
            }
        );
    };
}());