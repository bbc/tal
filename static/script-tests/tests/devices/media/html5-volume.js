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
	this.HTML5VolumeTest = AsyncTestCase("HTML5_Volume");

	this.HTML5VolumeTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTML5VolumeTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.HTML5VolumeTest.prototype.testVolumeControlIsSupported = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
			assert(device.isVolumeControlSupported());
		}, config);
	};
	this.HTML5VolumeTest.prototype.testDefaultStates = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			assertNull(device.getMuted());
			assertEquals(-1, device.getVolume());

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetMutedStateTrueAppliedToNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setMuted(true);
			var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertTrue(mediaElement.muted);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetMutedStateFalseAppliedToNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setMuted(false);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertFalse(mediaElement.muted);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume0AppliedToNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setVolume(0);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertEquals(0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume05AppliedToNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setVolume(0.5);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertEquals(0.5, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume10AppliedToNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setVolume(1.0);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertEquals(1.0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeBelowMinIsClippedNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

			device.setVolume(-1);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertEquals(0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeBelowMinLogWarningLoggedNewPlayer = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

			device.setVolume(-1);
            device.createMediaInterface("player", "audio", self.sandbox.stub());
			assert(warnSpy.called);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeAboveMaxIsClippedNewPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			device.setVolume(1.01);
            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertEquals(1.0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeAboveMaxWarningLoggedNewPlayer = function(queue) {
		expectAsserts(1);

        var self = this;

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

			device.setVolume(1.01);
            device.createMediaInterface("player", "audio", self.sandbox.stub());
			assert(warnSpy.called);

		}, config);
	};

	this.HTML5VolumeTest.prototype.testPresetMutedStateTrueAppliedToExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setMuted(true);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertTrue(mediaElement.muted);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetMutedStateFalseAppliedToExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setMuted(false);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertFalse(mediaElement.muted);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume0AppliedToExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(0);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
            assertEquals(0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume05AppliedToExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(0.5);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertEquals(0.5, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolume10AppliedToExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(1.0);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertEquals(1.0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeBelowMinIsClippedExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(-1);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertEquals(0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeBelowMinLogWarningLoggedExistingPlayer = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

            device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(-1);
			assert(warnSpy.called);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeAboveMaxIsClippedExistingPlayer = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();
            var spy = this.sandbox.spy(device, "_createElement");

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

            var player = device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(1.01);

            assertTrue(spy.calledOnce);
            var mediaElement = spy.returnValues[0];
			assertEquals(1.0, mediaElement.volume);

		}, config);
	};
	this.HTML5VolumeTest.prototype.testPresetVolumeAboveMaxWarningLoggedExistingPlayer = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5","antie/devices/logging/jstestdriver"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var warnSpy = this.sandbox.spy(device.getLogger(), "warn");

            device.createMediaInterface("player", "audio", self.sandbox.stub());
			device.setVolume(1.01);
			assert(warnSpy.called);

		}, config);
	};

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/media/html5'], this.HTML5VolumeTest);

})();
