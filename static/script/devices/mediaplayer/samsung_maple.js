/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
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
    "antie/devices/mediaplayer/samsung_maple",
    [
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext"
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        "use strict";

        var Player = MediaPlayer.extend({

            init: function() {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
                this._playerPlugin = document.getElementById('playerPlugin');
            },


            /**
            * @inheritDoc
            */
            setSource: function (mediaType, url, mimeType) {
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._registerEventHandlers();
                    this._toStopped();
                } else {
                    this._toError("Cannot set source unless in the '" + MediaPlayer.STATE.EMPTY + "' state");
                }
            },

            /**
            * @inheritDoc
            */
            resume : function () {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.BUFFERING:
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        this._playerPlugin.Resume();
                        this._toPlaying();
                        break;

                    default:
                        this._toError("Cannot resume while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            playFrom: function (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                this._seekingTo = this._range ? this._getClampedTime(seconds) : seconds;
                var offset = this._seekingTo - this.getCurrentTime();
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                        this._jump(offset);
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._toBuffering();
                        if (offset === 0) {
                            this._toPlaying();
                        } else {
                            this._jump(offset);
                        }
                        break;


                    case MediaPlayer.STATE.PAUSED:
                        this._toBuffering();
                        if (offset === 0) {
                            this._playerPlugin.Resume();
                            this._toPlaying();
                        } else {
                            this._jump(offset);
                        }
                        break;

                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._playerPlugin.ResumePlay(this._source, this._seekingTo);
                        this._toBuffering();
                        break;

                    default:
                        this._toError("Cannot playFrom while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            pause: function () {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PAUSED:
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._playerPlugin.Pause();
                        this._toPaused();
                        break;

                    default:
                        this._toError("Cannot pause while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            stop: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._playerPlugin.Stop();
                        this._toStopped();
                        break;

                    default:
                        this._toError("Cannot stop while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            reset: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        this._toEmpty();
                        break;

                    default:
                        this._toError("Cannot reset while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            getSource: function () {
                return this._source;
            },

            /**
            * @inheritDoc
            */
            getMimeType: function () {
                return this._mimeType;
            },

            /**
            * @inheritDoc
            */
            getCurrentTime: function () {
                var result = undefined;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        break;
                    default:
                        result = this._currentTime;
                        break;
                }
                return result;
            },

            /**
            * @inheritDoc
            */
            getRange: function () {
                return this._range;
            },

            /**
            * @inheritDoc
            */
            getState: function () {
                return this._state;
            },

            _onFinishedBuffering: function() {
                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;
                } else if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._toPaused();
                } else {
                    this._toPlaying();
                }
            },

            _onDeviceError: function(message) {
                this._toError(message);
            },

            _onDeviceBuffering: function() {
                this._toBuffering();
            },

            _onEndOfMedia: function() {
                this._playerPlugin.Stop();
                this._toComplete();
            },

            _onStatus: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _onMetadata: function() {
                this._range = {
                    start: 0,
                    end: this._playerPlugin.GetDuration() / 1000
                };

                var clampedTime = this._getClampedTime(this._seekingTo);
                if (clampedTime !== this._seekingTo) {
                    this.playFrom(clampedTime);
                }

            },

            _onCurrentTime: function(timeInMillis) {
                this._onStatus();
                this._currentTime = timeInMillis / 1000;
            },

            _registerEventHandlers: function() {
                var self = this;
                window.SamsungMapleOnRenderError = function () {
                    self._onDeviceError("Media element emitted OnRenderError");
                };
                this._playerPlugin.OnRenderError = 'SamsungMapleOnRenderError';

                window.SamsungMapleOnConnectionFailed = function () {
                    self._onDeviceError("Media element emitted OnConnectionFailed");
                };
                this._playerPlugin.OnConnectionFailed = 'SamsungMapleOnConnectionFailed';

                window.SamsungMapleOnNetworkDisconnected = function () {
                    self._onDeviceError("Media element emitted OnNetworkDisconnected");
                };
                this._playerPlugin.OnNetworkDisconnected = 'SamsungMapleOnNetworkDisconnected';

                window.SamsungMapleOnStreamNotFound = function () {
                    self._onDeviceError("Media element emitted OnStreamNotFound");
                };
                this._playerPlugin.OnStreamNotFound = 'SamsungMapleOnStreamNotFound';

                window.SamsungMapleOnAuthenticationFailed = function () {
                    self._onDeviceError("Media element emitted OnAuthenticationFailed");
                };
                this._playerPlugin.OnAuthenticationFailed = 'SamsungMapleOnAuthenticationFailed';

                window.SamsungMapleOnRenderingComplete = function () {
                    self._onEndOfMedia();
                };
                this._playerPlugin.OnRenderingComplete = 'SamsungMapleOnRenderingComplete';

                window.SamsungMapleOnBufferingStart = function () {
                    self._onDeviceBuffering();
                };
                this._playerPlugin.OnBufferingStart = 'SamsungMapleOnBufferingStart';

                window.SamsungMapleOnBufferingComplete = function () {
                    self._onFinishedBuffering();
                };
                this._playerPlugin.OnBufferingComplete = 'SamsungMapleOnBufferingComplete';

                window.SamsungMapleOnStreamInfoReady = function () {
                    self._onMetadata();
                };
                this._playerPlugin.OnStreamInfoReady = 'SamsungMapleOnStreamInfoReady';

                window.SamsungMapleOnCurrentPlayTime = function (timeInMillis) {
                    self._onCurrentTime(timeInMillis);
                };
                this._playerPlugin.OnCurrentPlayTime = 'SamsungMapleOnCurrentPlayTime';
            },

            _unregisterEventHandlers: function() {
                var eventHandlers = [
                    'SamsungMapleOnRenderError',
                    'SamsungMapleOnRenderingComplete',
                    'SamsungMapleOnBufferingStart',
                    'SamsungMapleOnBufferingComplete',
                    'SamsungMapleOnStreamInfoReady',
                    'SamsungMapleOnCurrentPlayTime',
                    'SamsungMapleOnConnectionFailed',
                    'SamsungMapleOnNetworkDisconnected',
                    'SamsungMapleOnStreamNotFound',
                    'SamsungMapleOnAuthenticationFailed'
                ];

                for (var i = 0; i < eventHandlers.length; i++){
                    var handler = eventHandlers[i];
                    var hook = handler.substring("SamsungMaple".length);
                    this._playerPlugin[hook] = undefined;

                    delete window[handler];
                }
            },

            _wipe: function () {
                this._playerPlugin.Stop();
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._currentTime = undefined;
                this._range = undefined;
                this._unregisterEventHandlers();
            },

            _jump: function (offsetSeconds) {
                if (offsetSeconds > 0) {
                    this._playerPlugin.JumpForward(offsetSeconds);
                } else {
                    this._playerPlugin.JumpBackward(Math.abs(offsetSeconds));
                }
            },

            _toStopped: function () {
                this._currentTime = 0;
                this._range = undefined;
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toBuffering: function () {
                if (this._state !== MediaPlayer.STATE.BUFFERING) {
                    this._state = MediaPlayer.STATE.BUFFERING;
                    this._emitEvent(MediaPlayer.EVENT.BUFFERING);
                }
            },

            _toPlaying: function () {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
            },

            _toPaused: function () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
            },

            _toComplete: function () {
                this._currentTime = undefined;
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
            },

            _toEmpty: function () {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._emitEvent(MediaPlayer.EVENT.ERROR);
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
