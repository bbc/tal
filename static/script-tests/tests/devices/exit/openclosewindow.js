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
    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/openclosewindow"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
    // jshint newcap: false
    this.ExitOpenCloseWindowTest = AsyncTestCase("ExitOpenCloseWindow"); 

    this.ExitOpenCloseWindowTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ExitOpenCloseWindowTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    /**
     * Test that window.open() is called.
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenCalled = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            // Stub out window.open() to do nothing
            var windowOpenStub = this.sandbox.stub(window, "open");
            
            // Call exit strategy and ensure window.open() was called
            application.getDevice().exit();
            assertEquals("window.open call count", windowOpenStub.callCount, 1);
        }, config);
    };
    
    /**
     * Test that window.open() is called with no destination URL and _self as the target window.
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenCalledWithCorrectParams = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            // Stub out window.open() with some assertions
            this.sandbox.stub(window, "open", function(url, windowName, windowFeatures) {
                assertFalse("window.open destination URL specified", !!url);
                assertEquals("window.open with _self as target", '_self', windowName);
                assertFalse("window.open features specified", !!windowFeatures);
            });
            
            // Call exit strategy.
            application.getDevice().exit();
        }, config);
    };
    
    /**
     * Test that window.open() is called, followed by window.close().
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenThenCloseCalled = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            // Stub out window.open() and window.close()
            var windowOpenStub = this.sandbox.stub(window, "open");
            var windowCloseStub = this.sandbox.stub(window, "close");
            
            // Call exit strategy and assert call sequence
            application.getDevice().exit();
            assert("window.close() called after window.open()", windowCloseStub.calledAfter(windowOpenStub));
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/openclosewindow'], this.ExitOpenCloseWindowTest);
})();