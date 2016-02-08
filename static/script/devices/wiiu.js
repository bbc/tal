/**
 * @fileOverview Requirejs module containing the antie.devices.WiiU class to support the WiiU Bamboo framework.
 * @author Ian Arundale <ian.arundale@bbc.co.uk>
 * @notes Updated for compatibility with Wii U SDK >= 2.0.8.11 (Daniel Jeffrey <daniel.jeffrey@accedo.tv>)
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


require.def(
    'antie/devices/wiiu',
    [
        'antie/devices/browserdevice',
        'antie/events/keyevent'
    ],
    function(BrowserDevice, KeyEvent) {
        'use strict';

        return BrowserDevice.extend({
            /* global nwf: true */
            init: function(config) {
                this._super(config);
            },
            /**
             * Adds key event listeners to WiiU Gamepad and WiiRemote, Wii U Pro controller is
             * currently unsupported in NWF
             */
            addKeyEventListener: function() {
                this._registerWiiUGamePadInputControls();
                this._registerWiiRemoteInputControls();
            },
            /**
             * Attempts to register the key mappings for Wii U gamepad 1
             */
            _registerWiiUGamePadInputControls : function() {
                var self = this;

                var gamePad = nwf.input.WiiUGamePad.getController(); // defaults to GamePad channel 0, aka CONTROLLER_1
                gamePad.buttons.addEventListener(nwf.events.ButtonControlEvent.PRESS, function(buttonEvent) {
                    self._onGamePadButtonPress(buttonEvent);
                }, this);
                gamePad.buttons.addEventListener(nwf.events.ButtonControlEvent.RELEASE, function(buttonEvent) {
                    self._onGamePadButtonRelease(buttonEvent);
                }, this);
            },
            _onGamePadButtonPress : function(buttonEvent) {
                var controllerButton = nwf.input.ControllerButton;
                switch (buttonEvent.button) {
                case controllerButton.GAMEPAD_A:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_ENTER));
                    break;
                case controllerButton.GAMEPAD_B:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_BACK));
                    break;
                case controllerButton.GAMEPAD_UP:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_UP));
                    break;
                case controllerButton.GAMEPAD_DOWN:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));
                    break;

                case controllerButton.GAMEPAD_LEFT:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_LEFT));
                    break;
                case controllerButton.GAMEPAD_RIGHT:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));
                    break;
                }
            },
            _onGamePadButtonRelease: function(buttonEvent) {
                var controllerButton = nwf.input.ControllerButton;
                switch (buttonEvent.button) {
                case controllerButton.GAMEPAD_A:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_ENTER));
                    break;
                case controllerButton.GAMEPAD_B:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_BACK));
                    break;
                case controllerButton.GAMEPAD_UP:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_UP));
                    break;
                case controllerButton.GAMEPAD_DOWN:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_DOWN));
                    break;
                case controllerButton.GAMEPAD_LEFT:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_LEFT));
                    break;
                case controllerButton.GAMEPAD_RIGHT:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_RIGHT));
                    break;
                }
            },
            /**
             * Attempts to register the keymappings for Wii Remote 1
             * Does not account for the Nunchuk
             */
            _registerWiiRemoteInputControls : function() {
                var self = this;

                // Get instance of controller 0, which is Player 1 (controller array is zero-based)
                var wiiRemote = nwf.input.WiiRemote.getController(nwf.input.WiiRemote.REMOTE_1);
                wiiRemote.buttons.addEventListener(nwf.events.ButtonControlEvent.PRESS, function(buttonEvent) {
                    self._onWiiRemoteButtonPress(buttonEvent);
                }, this);

                wiiRemote.buttons.addEventListener(nwf.events.ButtonControlEvent.RELEASE, function(buttonEvent) {
                    self._onWiiRemoteButtonRelease(buttonEvent);
                }, this);
            },
            _onWiiRemoteButtonPress : function(buttonEvent) {
                var controllerButton = nwf.input.ControllerButton;
                switch (buttonEvent.button) {
                case controllerButton.WII_REMOTE_A:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_ENTER));
                    break;
                case controllerButton.WII_REMOTE_B:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_BACK));
                    break;
                case controllerButton.WII_REMOTE_UP:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_UP));
                    break;
                case controllerButton.WII_REMOTE_DOWN:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));
                    break;
                case controllerButton.WII_REMOTE_LEFT:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_LEFT));
                    break;
                case controllerButton.WII_REMOTE_RIGHT:
                    this._application.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));
                    break;
                }
            },
            _onWiiRemoteButtonRelease : function(buttonEvent) {
                var controllerButton = nwf.input.ControllerButton;
                switch (buttonEvent.button) {
                case controllerButton.WII_REMOTE_A:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_ENTER));
                    break;
                case controllerButton.WII_REMOTE_B:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_BACK));
                    break;
                case controllerButton.WII_REMOTE_UP:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_UP));
                    break;
                case controllerButton.WII_REMOTE_DOWN:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_DOWN));
                    break;
                case controllerButton.WII_REMOTE_LEFT:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_LEFT));
                    break;
                case controllerButton.WII_REMOTE_RIGHT:
                    this._application.bubbleEvent(new KeyEvent('keyup', KeyEvent.VK_RIGHT));
                    break;
                }
            }
        });
    }
);
