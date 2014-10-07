/**
 * @fileOverview Requirejs module containing device modifier to launch HTML5 media player including fix for players that dont send buffering events correctly.
 *
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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
    "antie/devices/mediaplayer/html5waitingfix",
    [
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/devices/mediaplayer/html5"
    ],
    function(Device, MediaPlayer, HTML5MediaPlayer) {
        "use strict";

        var Player = HTML5MediaPlayer.extend({

            init: function() {
                this._super();
                this._bufferingTimer = null;
                this._waitingToPause = false;
            },

            pause: function() {
                if(this.getState() === MediaPlayer.STATE.BUFFERING) {
                    this._postBufferingState = MediaPlayer.STATE.PAUSED;
                    this._waitingToPause = true;
                } else {
                    this._super();
                }
            },

            resume: function() {
                if(this.getState() === MediaPlayer.STATE.BUFFERING) {
                    this._postBufferingState = MediaPlayer.STATE.PLAYING;
                    this._waitingToPause = false;
                } else {
                    this._super();
                }
            },

            _onStatus: function() {
                this._super();
                this._pauseIfDeferred();
                this._notBufferingAnymore();
                this._clearBufferingTimer();
                this._setBufferingTimer();
            },

            _toPaused: function() {
                this._clearBufferingTimer();
                this._super();
            },

            _toStopped: function() {
                this._clearBufferingTimer();
                this._super();
            },

            _toComplete: function() {
                this._clearBufferingTimer();
                this._super();
            },

            _toError: function(errorMessage) {
                this._clearBufferingTimer();
                this._super(errorMessage);
            },

            _clearBufferingTimer: function() {
                if(this._bufferingTimer) {
                    window.clearTimeout(this._bufferingTimer);
                    this._bufferingTimer = null;
                }
            },

            _setBufferingTimer: function() {
                var self = this;
                if(this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._bufferingTimer = window.setTimeout(function() {
                        self._onDeviceBuffering();
                    }, 500);
                }
            },

            _notBufferingAnymore: function() {
                if (this.getState() === MediaPlayer.STATE.BUFFERING) {
                    this._onFinishedBuffering();
                }
            },

            _pauseIfDeferred: function() {
                if (this._waitingToPause) {
                    this._mediaElement.pause();
                    this._waitingToPause = false;
                }
            }
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

);
