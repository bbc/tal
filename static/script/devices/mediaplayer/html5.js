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
    "antie/devices/mediaplayer/html5",
    [
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function(RuntimeContext, Device, MediaPlayer) {
        "use strict";

        /**
         * Main MediaPlayer implementation for HTML5 devices.
         * Use this device modifier if a device implements the HTML5 media playback standard.
         * It must support creation of <video> and <audio> elements, and those objects must expose an
         * API in accordance with the HTML5 media specification.
         * @name antie.devices.mediaplayer.html5
         * @class
         * @extends antie.devices.mediaplayer.MediaPlayer.prototype
         */
        var Player = MediaPlayer.extend({

            init: function() {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
            },


            /**
            * @inheritDoc
            */
            setSource: function(mediaType, url, mimeType) {
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    var device = RuntimeContext.getDevice();

                    var idSuffix = mediaType === MediaPlayer.TYPE.AUDIO ? "Audio" : "Video";

                    this._mediaElement = device._createElement(this._type, "mediaPlayer" + idSuffix);
                    this._mediaElement.autoplay = false;
                    this._mediaElement.style.position = "absolute";
                    this._mediaElement.style.top = "0px";
                    this._mediaElement.style.left = "0px";
                    this._mediaElement.style.width = "100%";
                    this._mediaElement.style.height = "100%";

                    var self = this;
                    this._wrapOnFinishedBuffering = function(event) { self._onFinishedBuffering(); };
                    this._wrapOnError = function(event) { self._onDeviceError(); };
                    this._wrapOnEndOfMedia = function(event) { self._onEndOfMedia(); };
                    this._wrapOnDeviceBuffering = function(event) { self._onDeviceBuffering(); };
                    this._wrapOnStatus = function(event) { self._onStatus(); };
                    this._wrapOnMetadata = function(event) { self._onMetadata(); };
                    this._mediaElement.addEventListener("canplay", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener("seeked", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener("playing", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener("error", this._wrapOnError, false);
                    this._mediaElement.addEventListener("ended", this._wrapOnEndOfMedia, false);
                    this._mediaElement.addEventListener("waiting", this._wrapOnDeviceBuffering, false);
                    this._mediaElement.addEventListener("timeupdate", this._wrapOnStatus, false);
                    this._mediaElement.addEventListener("loadedmetadata", this._wrapOnMetadata, false);

                    var body = document.getElementsByTagName("body")[0];
                    device.prependChildElement(body, this._mediaElement);

                    this._mediaElement.preload = "auto";
                    this._mediaElement.src = url;
                    this._mediaElement.load();

                    this._toStopped();
                } else {
                    this._toError("Cannot set source unless in the '" + MediaPlayer.STATE.EMPTY + "' state");
                }
            },

            /**
            * @inheritDoc
            */
            playFrom: function(seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                this._targetSeekTime = seconds;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._toBuffering();
                        this._playFromIfReady();
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                        this._playFromIfReady();
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._toBuffering();
                        if (this._isNearToCurrentTime(seconds)) {
                            this._toPlaying();
                        } else {
                            this._playFromIfReady();
                        }
                        break;

                    default:
                        this._toError("Cannot playFrom while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            beginPlayback: function(seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        this._toBuffering();
                        this._mediaElement.play();
                        break;

                    default:
                        this._toError("Cannot beginPlayback while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            pause: function() {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PAUSED:
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                        if (this._readyToPlayFrom) {
                            // If we are not ready to playFrom, then calling pause would seek to the start of media, which we might not want.
                            this._mediaElement.pause();
                        }
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._mediaElement.pause();
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
            resume : function() {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.BUFFERING:
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        this._mediaElement.play();
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
            stop: function() {
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._mediaElement.pause();
                        this._mediaElement.currentTime = 0;
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
            reset: function() {
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
            getSource: function() {
                return this._source;
            },

            /**
            * @inheritDoc
            */
            getMimeType: function() {
                return this._mimeType;
            },

            /**
            * @inheritDoc
            */
            getCurrentTime: function() {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    default:
                        if (this._mediaElement) {
                            return this._mediaElement.currentTime;
                        }
                        break;
                }
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getRange: function() {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    default:
                        return this._getSeekableRange();
                }
                return undefined;
            },

            _getSeekableRange: function() {
                if (this._mediaElement) {
                    if (this._mediaElement.seekable && this._mediaElement.seekable.length > 0) {
                        return {
                            start: this._mediaElement.seekable.start(0),
                            end: this._mediaElement.seekable.end(0)
                        };
                    } else if (this._mediaElement.duration !== undefined) {
                        return {
                            start: 0,
                            end: this._mediaElement.duration
                        };
                    } else {
                        RuntimeContext.getDevice().getLogger().warn("No 'duration' or 'seekable' on media element");
                    }
                }
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getState: function() {
                return this._state;
            },

            _onFinishedBuffering: function() {
                this._exitBuffering();
            },

            _onDeviceError: function() {
                this._toError("Media element emitted error with code: " + this._mediaElement.error.code);
            },

            /**
             * @protected
             */
            _onDeviceBuffering: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function() {
                this._toComplete();
            },

            _onStatus: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _onMetadata: function() {
                this._readyToPlayFrom = true;
                if (this._waitingToPlayFrom()) {
                    this._deferredPlayFrom();
                }
            },

            _exitBuffering: function () {
                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;

                } else if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._toPaused();

                } else {
                    this._toPlaying();
                }
            },

            _playFromIfReady: function() {
                if (this._readyToPlayFrom) {
                    if (this._waitingToPlayFrom()) {
                        this._deferredPlayFrom();
                    }
                }
            },

            _waitingToPlayFrom: function() {
                return this._targetSeekTime !== undefined;
            },

            _deferredPlayFrom: function() {
                this._seekTo(this._targetSeekTime);
                this._mediaElement.play();
                if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._mediaElement.pause();
                }
                this._targetSeekTime = undefined;
            },

            _seekTo: function(seconds) {
                this._mediaElement.currentTime = this._getClampedTime(seconds);
            },

            _wipe: function() {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._targetSeekTime = undefined;
                this._destroyMediaElement();
                this._readyToPlayFrom = false;
                this._clearSentinels();
            },

            _destroyMediaElement: function() {
                if (this._mediaElement) {
                    this._mediaElement.removeEventListener("canplay", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener("seeked", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener("playing", this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener("error", this._wrapOnError, false);
                    this._mediaElement.removeEventListener("ended", this._wrapOnEndOfMedia, false);
                    this._mediaElement.removeEventListener("waiting", this._wrapOnDeviceBuffering, false);
                    this._mediaElement.removeEventListener("timeupdate", this._wrapOnStatus, false);
                    this._mediaElement.removeEventListener("loadedmetadata", this._wrapOnMetadata, false);

                    this._mediaElement.removeAttribute('src');
                    this._mediaElement.load();

                    var device = RuntimeContext.getDevice();
                    device.removeElement(this._mediaElement);

                    delete this._mediaElement;
                }
            },

            _toStopped: function() {
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
                this._setSentinels([]);
            },

            _toBuffering: function() {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
                this._setSentinels([ this._exitBufferingSentinel ]);
            },

            _toPlaying: function() {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
                this._setSentinels([ this._enterBufferingSentinel ]);
            },

            _toPaused: function() {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
                this._setSentinels([]);
            },

            _toComplete: function() {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
                this._setSentinels([]);
            },

            _toEmpty: function() {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._emitEvent(MediaPlayer.EVENT.ERROR);
            },

            _enterBufferingSentinel: function() {
                if(!this._hasSentinelTimeAdvanced) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
                    this._toBuffering();
                }
            },

            _exitBufferingSentinel: function() {
                var HAVE_ENOUGH_DATA = 4;
                var hasEnoughData = this._mediaElement.readyState === HAVE_ENOUGH_DATA;
                if(this._hasSentinelTimeAdvanced || this._mediaElement.paused || hasEnoughData) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
                    this._exitBuffering();
                }
            },

            _clearSentinels: function() {
                clearInterval(this._sentinelInterval);
            },

            _setSentinels: function(sentinels) {
                var self = this;
                this._clearSentinels();
                this._lastSentinelTime = this.getCurrentTime();
                this._sentinelInterval = setInterval(function() {
                    var newTime = self.getCurrentTime();
                    self._hasSentinelTimeAdvanced = (newTime > self._lastSentinelTime);
                    self._lastSentinelTime = newTime;
                    for (var i = 0; i < sentinels.length; i++) {
                        sentinels[i].call(self);
                    }
                }, 1100);
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
