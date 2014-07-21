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

	this.HTML5WaitingEventFix = AsyncTestCase("HTML5_WaitingEventFix");

	this.HTML5WaitingEventFix.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTML5WaitingEventFix.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsFiredWhenNoTimeUpdateFiredWithinHalfASecondAndVideoIsPlaying = function(queue) {
		expectAsserts(4);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5", "antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {
            var clock = sinon.useFakeTimers();
            var mediaElement = document.createElement("div");
            var eventHandlers = { };
            mediaElement.addEventListener = function (type, callback) {
                eventHandlers[type] = callback;
            };

            this.sandbox.stub(application.getDevice(), "_createElement").returns(mediaElement);

            var eventHandlingCallback = self.sandbox.stub();
            var player = application.getDevice().createMediaInterface("player", "video", eventHandlingCallback);

            // t = 0
            eventHandlers.timeupdate("timeupdate");

            clock.tick(499);
            // t = 499

            assertTrue(eventHandlingCallback.notCalled);

            clock.tick(2);
            // t = 501

            assertTrue(eventHandlingCallback.calledOnce);
            assertInstanceOf(MediaEvent, eventHandlingCallback.args[0][0]);
            assertEquals("waiting", eventHandlingCallback.args[0][0].type);

            clock.restore();

		}, config);
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsNotFiredWhenNoTimeUpdateFiredWithinASecondAndVideoIsPaused = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5", "antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {

            var clock = sinon.useFakeTimers();
            var mediaElement = document.createElement("div");
            var eventHandlers = { };
            mediaElement.addEventListener = function (type, callback) {
                eventHandlers[type] = callback;
            };

            this.sandbox.stub(application.getDevice(), "_createElement").returns(mediaElement);

            var eventHandlingCallback = self.sandbox.stub();
            var player = application.getDevice().createMediaInterface("player", "video", eventHandlingCallback);

            eventHandlers.timeupdate("timeupdate");
            eventHandlers.pause("pause");

            clock.tick(501);

            assertTrue(eventHandlingCallback.notCalled);

            clock.restore();

		}, config);
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsNotFiredWhenNoTimeUpdateFiredWithinASecondAndVideoIsStopped = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {

            var clock = sinon.useFakeTimers();
            var mediaElement = document.createElement("div");
            var eventHandlers = { };
            mediaElement.addEventListener = function (type, callback) {
                eventHandlers[type] = callback;
            };

            this.sandbox.stub(application.getDevice(), "_createElement").returns(mediaElement);

            var eventHandlingCallback = self.sandbox.stub();
            var player = application.getDevice().createMediaInterface("player", "video", eventHandlingCallback);

            eventHandlers.timeupdate("timeupdate");
            eventHandlers.ended("ended");

            clock.tick(501);

            assertTrue(eventHandlingCallback.notCalled);

            clock.restore();

		}, config);
	};

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/media/html5waitingfix'], this.HTML5WaitingEventFix);


})();
