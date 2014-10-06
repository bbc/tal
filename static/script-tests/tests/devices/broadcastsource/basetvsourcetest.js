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
    this.baseTvSource = AsyncTestCase("Abstract Base Broadcast Source");

    var extendBaseTvSourceWithNoOverriddenMethods = function(BaseTvSource) {
        BaseTvSource.prototype.init = function() {
        };
    };

    var getGenericBaseBroadcastConfig = function() {
        return {"modules":{"base":"antie/devices/browserdevice","modifiers":[
            "antie/devices/anim/styletopleft",
            "antie/devices/media/html5",
            "antie/devices/net/default",
            "antie/devices/broadcastsource/basetvsource",
            "antie/devices/data/nativejson",
            "antie/devices/storage/cookie",
            "antie/devices/logging/default",
            "antie/devices/exit/closewindow"
        ]},"input":{"map":{}},"layouts":[
            {"width":1280,"height":720,"module":"fixtures/layouts/default","classes":["browserdevice720p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};
    };

    this.baseTvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.baseTvSource.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.baseTvSource.prototype.testCreateBroadcastThrowsDeviceException = function(queue) {
        expectAsserts(1);

        var config = getGenericBaseBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException("Broadcast API not available on this device.", function() {
                var broadcastSource = device.createBroadcastSource();
            });
        }, config);
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceInitThrowsException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            assertException("Abstract class constructor should not be called directly", function() {
                var broadcastSource = new BaseTvSource();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceShowCurrentChannelThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method showCurrentChannel", function() {
                broadcastSource.showCurrentChannel();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceStopCurrentChannelThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method stopCurrentChannel", function() {
                broadcastSource.stopCurrentChannel();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetCurrentChannelNameThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method getCurrentChannelName", function() {
                broadcastSource.getCurrentChannelName();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceSetPositionThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method setPosition", function() {
                broadcastSource.setPosition(10, 20, 30, 40);
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceDestroyThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method destroy", function() {
                broadcastSource.destroy();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetPlayStateThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertEquals("Base implementation should return -1 (Unknown playstate)", -1, broadcastSource.getPlayState());
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceIsBroadcastSourceSupportedReturnsTrue = function(queue) {
        expectAsserts(1);
        var config = getGenericBaseBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertTrue(device.isBroadcastSourceSupported());
        }, config);
    };


    this.baseTvSource.prototype.testBaseBroadcastSourceGetCurrentChannelThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method getCurrentChannel", function() {
                broadcastSource.getCurrentChannel();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceSetChannelByNameThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method setChannelByName", function() {
                broadcastSource.setChannelByName();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetChannelListThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException("Device broadcast source does not override abstract method getChannelList", function() {
                broadcastSource.getChannelList();
            });
        });
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/basetvsource'], this.baseTvSource);

})();
