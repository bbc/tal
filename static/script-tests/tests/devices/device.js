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
    this.DeviceTest = AsyncTestCase("Device");

    this.DeviceTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.DeviceTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.DeviceTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/devices/device","antie/class"],
            function(application, Device, Class) {
                assertEquals('Device should be a function', 'function', typeof Device);
                var device = new Device(antie.framework.deviceConfiguration);
                assert('Device should extend from Class', device instanceof Class);
            });
    };

    this.DeviceTest.prototype.testIsBroadcastSourceAvailable = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/devices/device","antie/class"],
            function(application, Device, Class) {
                var device = new Device(antie.framework.deviceConfiguration);
                assertFalse(device.isBroadcastSourceSupported());
            });
    };

    this.DeviceTest.prototype.testCreateBroadcastSource = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/devices/device","antie/class"],
            function(application, Device, Class) {
                var device = new Device(antie.framework.deviceConfiguration);
                assertException("Broadcast API not available on this device.", function() {
                    device.createBroadcastSource();
                });
            });
    };

    this.DeviceTest.prototype.testLoad = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/devices/device"],
            function(application, Device) {
                var callbacks = {
                    onSuccess: this.sandbox.stub(),
                    onError: this.sandbox.stub()
                };
                assertNoException(function() {
                    Device.load(antie.framework.deviceConfiguration, callbacks);
                });
                assert("Device.load calls onSuccess callback when valid config is provided", callbacks.onSuccess.called);

                assertNoException(function() {
                    Device.load({}, callbacks);
                });
                assert("Device.load calls onError callback when invalid config is provided", callbacks.onError.called);
            });
    };

    this.DeviceTest.prototype.testGetConfig = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/device","antie/application"], function(application, Device, Application) {
            var callbacks = {
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };
            assertNoException(function() {
                Device.load(antie.framework.deviceConfiguration, callbacks);
            });
            var application = Application.getCurrentApplication();
            var device = application.getDevice();
            assertSame(antie.framework.deviceConfiguration, device.getConfig())
        });
    };

    this.DeviceTest.prototype.testExit = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/device"], function(Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            assertException("Default device implementation should throw exception on exit()", function() {
                device.exit();
            });
        });
    };

    this.DeviceTest.prototype.testExitToBroadcast = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/device"], function(Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var exitStub = this.sandbox.stub(device, 'exit');
            device.exitToBroadcast();
            assertEquals("Default device implementation calls exit() on exitToBroadcast()", 1, exitStub.callCount);
        });
    };

})();
