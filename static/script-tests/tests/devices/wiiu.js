/**
 * @fileOverview Input mapping tests for the antie.devices.WiiU class (support for the WiiU NWF).
 * @author Ian Arundale <ian.arundale@bbc.co.uk>
 * @notes Mocked API's map to the Wii U SDK >= 2.0.8.11
 *
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
    /* global nwf: true */
    this.WiiUDevice = AsyncTestCase("WiiU Device");

    this.WiiUDevice.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        stubNWFSpecificApis();
        this.wiiuConfig = {"modules":{"base":"antie/devices/wiiu","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft', 'antie/devices/media/html5']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};
    };

    this.WiiUDevice.prototype.tearDown = function() {
        removeNWFSpecificApis();
        this.sandbox.restore();
    };

    /**
     * This test ensures the correct eventListeners are set up for the gamepad, however there is no requirement for the
     * event listeners to be added in the order that the test suggests
     * @param queue
     */
    this.WiiUDevice.prototype.testGamePadAddEventListenerIsCalledCorrectlyOnDeviceInit = function(queue) {
        expectAsserts(3);
        var self = this;

        var gamePadEventListenerSpy = this.sandbox.spy(window.nwf.input.WiiUGamePad, '_privateAddEventListener');

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) { //jshint ignore:line
            assertTrue(gamePadEventListenerSpy.called);
            assertEquals(nwf.events.ButtonControlEvent.PRESS, gamePadEventListenerSpy.getCall(0).args[0]);
            assertEquals(nwf.events.ButtonControlEvent.RELEASE, gamePadEventListenerSpy.getCall(1).args[0]);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadAButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_A);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_ENTER, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadAButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_A);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_ENTER, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };


    this.WiiUDevice.prototype.testGamePadBButtonPressBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_B);


            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_BACK, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadBButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_B);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_BACK, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadXButtonDoesNotFireAnyAntieKeyEvents = function(queue) {
        expectAsserts(1);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) { //jshint ignore:line
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_X);
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_X);

            assertFalse(bubbleEventSpy.called);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadYButtonDoesNotFireAnyAntieKeyEvents = function(queue) {
        expectAsserts(1);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) { //jshint ignore:line
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_Y);
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_Y);

            assertFalse(bubbleEventSpy.called);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadUpButtonPressBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_UP);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_UP, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadUpButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_UP);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_UP, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadDownButtonPressBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_DOWN);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_DOWN, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadDownButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_DOWN);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_DOWN, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadLeftButtonPressBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_LEFT);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_LEFT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadLeftButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_LEFT);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_LEFT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadRightButtonPressBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonPress(application, window.nwf.input.ControllerButton.GAMEPAD_RIGHT);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_RIGHT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testGamePadRightButtonReleaseBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockGamePadButtonRelease(application, window.nwf.input.ControllerButton.GAMEPAD_RIGHT);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_RIGHT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    /**
     * WiiRemote Tests
     * @param queue
     */

    /**
     * This test ensures the correct eventListeners are set up for the Wii remote, however there is no requirement for
     * the event listeners to be added in the order that the test suggests
     * @param queue
     */
    this.WiiUDevice.prototype.testWiiRemoteAddEventListenerIsCalledCorrectlyOnDeviceInit = function(queue) {
        expectAsserts(3);
        var self = this;

        var gamePadEventListenerSpy = this.sandbox.spy(window.nwf.input.WiiRemote, '_privateAddEventListener');

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) { //jshint ignore:line
            assertTrue(gamePadEventListenerSpy.called);
            assertEquals(nwf.events.ButtonControlEvent.PRESS, gamePadEventListenerSpy.getCall(0).args[0]);
            assertEquals(nwf.events.ButtonControlEvent.RELEASE, gamePadEventListenerSpy.getCall(1).args[0]);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteAButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_A);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_ENTER, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteAButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_A);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_ENTER, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteBButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_B);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_BACK, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteBButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_B);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_BACK, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteUpButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_UP);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_UP, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteUpButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_UP);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_UP, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteDownButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_DOWN);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_DOWN, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteDownButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_DOWN);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_DOWN, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteLeftButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_LEFT);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_LEFT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteLeftButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_LEFT);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_LEFT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteRightButtonPressBubblesBubblesKeyDownAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonPress(application, window.nwf.input.ControllerButton.WII_REMOTE_RIGHT);

            assertEquals("keydown", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_RIGHT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };

    this.WiiUDevice.prototype.testWiiRemoteRightButtonReleaseBubblesBubblesKeyUpAntieEvent = function(queue) {
        expectAsserts(2);
        var self = this;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/keyevent'], function(application, KeyEvent) {
            var bubbleEventSpy = this.sandbox.spy(application, 'bubbleEvent');
            mockWiiRemoteButtonRelease(application, window.nwf.input.ControllerButton.WII_REMOTE_RIGHT);

            assertEquals("keyup", bubbleEventSpy.args[0][0].type);
            assertEquals(KeyEvent.VK_RIGHT, bubbleEventSpy.args[0][0].keyCode);
        }, self.wiiuConfig);
    };


    /**
     * Helper functions to mock out Nintendo specific APIs required for testing
     */

    var stubNWFSpecificApis = function() {
        window.nwf = {};
        window.nwf.input = {
            ControllerButton : {
                GAMEPAD_A: 32768, // 0x8000
                GAMEPAD_B: 16384, // 0x4000
                GAMEPAD_X: 8192, // 0x2000
                GAMEPAD_Y: 4096, // 0x1000
                GAMEPAD_UP: 512, // 0x0200
                GAMEPAD_DOWN: 256, // 0x0100
                GAMEPAD_LEFT: 2048, // 0x0800
                GAMEPAD_RIGHT: 1024, // 0x0400

                WII_REMOTE_A: 2048, // 0x0800
                WII_REMOTE_B: 1024, // 0x0400
                WII_REMOTE_UP: 8, // 0x0008
                WII_REMOTE_DOWN: 4, // 0x0004
                WII_REMOTE_LEFT: 1, // 0x0001
                WII_REMOTE_RIGHT: 2 // 0x0002
            },
            WiiUGamePad : {
                getController : function() {
                    var self = this;
                    var controllerObject = {
                        connected: true,
                        buttons : {
                            addEventListener : function(eventType, listener, scope) {
                                self._privateAddEventListener(eventType, listener, scope);
                            }
                        }
                    };
                    return controllerObject;
                },
                _privateAddEventListener : function(eventType, listener, scope) { //jshint ignore:line
                    // Stub this out to ensure the event listener has been called correctly
                }
            },
            WiiRemote: {
                REMOTE_1 : "TBA",
                getController : function(controller) { //jshint ignore:line
                    var self = this;
                    var controllerObject = {
                        connected: true,
                        buttons : {
                            addEventListener : function(eventType, listener, scope) {
                                self._privateAddEventListener(eventType, listener, scope);
                            }
                        }
                    };
                    return controllerObject;
                },
                _privateAddEventListener : function(eventType, listener, scope) { //jshint ignore:line
                    // Stub this out to ensure the event listener has been called correctly
                }
            }
        };

        window.nwf.events = {
            ButtonControlEvent : {
                PRESS: 'press',
                RELEASE: 'release'
            }
        };
    };

    var removeNWFSpecificApis = function() {
        window.nwf = null;
    };

    var mockGamePadButtonPress = function(application, keyToPress) {
        var event = {
            type : nwf.events.ButtonControlEvent.PRESS,
            button : keyToPress
        };
        application.getDevice()._onGamePadButtonPress(event);
    };

    var mockGamePadButtonRelease = function(application, keyToPress) {
        var event = {
            type : nwf.events.ButtonControlEvent.RELEASE,
            button : keyToPress
        };
        application.getDevice()._onGamePadButtonRelease(event);
    };

    var mockWiiRemoteButtonPress = function(application, keyToPress) {
        var event = {
            type : nwf.events.ButtonControlEvent.PRESS,
            button : keyToPress
        };
        application.getDevice()._onWiiRemoteButtonPress(event);
    };

    var mockWiiRemoteButtonRelease = function(application, keyToPress) {
        var event = {
            type : nwf.events.ButtonControlEvent.RELEASE,
            button : keyToPress
        };
        application.getDevice()._onWiiRemoteButtonRelease(event);
    };

})();
