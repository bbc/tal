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
    this.ExitNetCastTest = AsyncTestCase("Exit (NetCast)");

    this.ExitNetCastTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ExitNetCastTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        "modules" : {
            "base" : "antie/devices/browserdevice",
            "modifiers" : [ "antie/devices/exit/netcast" ]
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

    this.ExitNetCastTest.prototype.testNetCastExit = function(queue) {
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            var netCastBackStub = window.NetCastBack = this.sandbox.stub();

            application.getDevice().exit();
            assert(netCastBackStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/netcast'], this.ExitNetCastTest);

}());