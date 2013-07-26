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
    /* jshint newcap: false */
    this.BroadcastExitSamsungTest = AsyncTestCase("Broadcast Exit (Samsung)");

    this.BroadcastExitSamsungTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.BroadcastExitSamsungTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        "modules" : {
            "base" : "antie/devices/browserdevice",
            "modifiers" : [ "antie/devices/exit/broadcast/samsung_maple" ]
        },
        "input" : {
            "map" : {}
        },
        "layouts" : [ {
            "width" : 960,
            "height" : 540,
            "module" : "fixtures/layouts/default",
            "classes" : [ "browserdevice540p" ]
        } ],
        "deviceConfigurationKey" : "devices-html5-1"
    };

    this.BroadcastExitSamsungTest.prototype.testBroadcastSamsungExit = function(queue) {
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            var self, sendExitEventStub;
            self = this;
            sendExitEventStub = self.sandbox.stub();

            // Mock out the Samsung API
            window.Common = {
                API: {
                    Widget: function() {
                        return {
                            sendExitEvent: sendExitEventStub
                        };
                    }
                }
            };

            application.getDevice().exitToBroadcast();
            assert(sendExitEventStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/broadcast/samsung_maple'], this.BroadcastExitSamsungTest);

}());