/**
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
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
    this.stubbedSource = AsyncTestCase("Stubbed Broadcast Source"); //jshint ignore:line

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[
        "antie/devices/anim/styletopleft",
        "antie/devices/media/html5",
        "antie/devices/net/default",
        "antie/devices/broadcastsource/stubbedsource",
        "antie/devices/data/nativejson",
        "antie/devices/storage/cookie",
        "antie/devices/logging/default",
        "antie/devices/exit/closewindow"
    ]},"input":{"map":{}},"layouts":[
        {"width":1280,"height":720,"module":"fixtures/layouts/default","classes":["browserdevice720p"]}
    ],"deviceConfigurationKey":"devices-html5-1"};

    this.stubbedSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.stubbedSource.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.stubbedSource.prototype.testCreateBroadcastDoesNotThrowException = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            assertNoException(function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceShowCurrentChannelDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            assertNoException(function() {
                var broadcastStub = device.createBroadcastSource();
                broadcastStub.showCurrentChannel();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceStopCurrentChannelDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.stopCurrentChannel();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetCurrentChannelNameDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.getCurrentChannelName();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceSetPositionDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.setPosition(10, 20, 30, 40);
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceDestroyDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.destroy();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetStateDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function(){
                broadcastStub.getState();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceSetChannelByNameDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.setChannelByName();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetChannelNameListDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            debugger;
            assertNoException(function() {
                broadcastStub.getChannelNameList();
            });
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/stubbedSource'], this.stubbedSource);

})();