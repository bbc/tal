/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview Requirejs module containing the antie.devices.WiiU class to support the WiiU Bamboo framework.
 * @author Ian Arundale <ian.arundale@bbc.co.uk>
 * @notes Updated for compatibility with Wii U SDK >= 2.0.8.11 (Daniel Jeffrey <daniel.jeffrey@accedo.tv>)
 */


define(
    'antie/devices/wiiu',
    [
        'antie/devices/browserdevice',
        'antie/events/keyevent'
    ],
    function(BrowserDevice, KeyEvent) {
        'use strict';

        return BrowserDevice.extend({
            /* global nwf: true */
            init: function init (config) {
                init.base.call(this, config);
            },
            /**
             * Adds key event listeners to WiiU Gamepad and WiiRemote, Wii U Pro controller is
             * currently unsupported in NWF
             */
            addKeyEventListener: function addKeyEventListener () {
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
            _onGamePadButtonRelease: function _onGamePadButtonRelease (buttonEvent) {
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
