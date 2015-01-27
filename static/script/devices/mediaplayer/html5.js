/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media playback
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
         * It must support creation of &lt;video&gt; and &lt;audio&gt; elements, and those objects must expose an
         * API in accordance with the HTML5 media specification.
         * @name antie.devices.mediaplayer.HTML5
         * @class
         * @extends antie.devices.mediaplayer.MediaPlayer
         */
        var Player = MediaPlayer.extend({

            init: function() {
                this._super();
                this._setSentinelLimits();
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

                    var appElement = RuntimeContext.getCurrentApplication().getRootWidget().outputElement;
                    device.prependChildElement(appElement, this._mediaElement);

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
                this._sentinelLimits.seek.currentAttemptCount = 0;

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
                        this._targetSeekTime = this._getClampedTimeForPlayFrom(seconds);
                        if (this._isNearToCurrentTime(this._targetSeekTime)) {
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
                this._sentinelSeekTime = undefined;
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
                        this._sentinelLimits.pause.currentAttemptCount = 0;
                        if (this._readyToPlayFrom) {
                            // If we are not ready to playFrom, then calling pause would seek to the start of media, which we might not want.
                            this._mediaElement.pause();
                        }
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._sentinelLimits.pause.currentAttemptCount = 0;
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
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                        if (this._readyToPlayFrom) {
                            // If we are not ready to playFrom, then calling play would seek to the start of media, which we might not want.
                            this._mediaElement.play();
                        }
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
                    case MediaPlayer.STATE.STOPPED:
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._mediaElement.pause();
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
                    case MediaPlayer.STATE.EMPTY:
                        break;

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
            getSeekableRange: function() {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    default:
                        return this._getSeekableRange();
                }
                return undefined;
            },

            /**
             * @inheritDoc
             */
            getDuration: function() {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    default:
                        if (this._mediaElement) {
                            return this._mediaElement.duration;
                        }
                }
                return undefined;
            },

            _getSeekableRange: function() {
                if (this._mediaElement) {
                    if (this._readyToPlayFrom && this._mediaElement.seekable && this._mediaElement.seekable.length > 0) {
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
                this._reportError("Media element emitted error with code: " + this._mediaElement.error.code);
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
                var clampedTime = this._getClampedTimeForPlayFrom(seconds);
                this._mediaElement.currentTime = clampedTime;
                this._sentinelSeekTime = clampedTime;
            },

            _getClampedTimeForPlayFrom: function(seconds) {
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    var range = this._getSeekableRange();
                    RuntimeContext.getDevice().getLogger().debug("playFrom " + seconds + " clamped to " + clampedTime + " - seekable range is { start: " + range.start + ", end: " + range.end + " }");
                }
                return clampedTime;
            },

            _wipe: function() {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._targetSeekTime = undefined;
                this._sentinelSeekTime = undefined;
                this._clearSentinels();
                this._destroyMediaElement();
                this._readyToPlayFrom = false;
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

                    this._unloadMediaSrc();

                    var device = RuntimeContext.getDevice();
                    device.removeElement(this._mediaElement);

                    delete this._mediaElement;
                }
            },

            _unloadMediaSrc: function() {
                this._mediaElement.removeAttribute('src');
                this._mediaElement.load();
            },

            _reportError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR);
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
                this._setSentinels([ this._endOfMediaSentinel, this._shouldBeSeekedSentinel, this._enterBufferingSentinel ]);
            },

            _toPaused: function() {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
                this._setSentinels([ this._shouldBeSeekedSentinel, this._shouldBePausedSentinel ]);
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
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._reportError(errorMessage);
                throw "ApiError: " + errorMessage;
            },

            _setSentinelLimits: function() {
                this._sentinelLimits = {
                    pause: {
                        maximumAttempts: 2,
                        successEvent: MediaPlayer.EVENT.SENTINEL_PAUSE,
                        failureEvent: MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE,
                        currentAttemptCount: 0
                    },
                    seek: {
                        maximumAttempts: 2,
                        successEvent: MediaPlayer.EVENT.SENTINEL_SEEK,
                        failureEvent: MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE,
                        currentAttemptCount: 0
                    }
                };
            },

            _enterBufferingSentinel: function() {
                var notFirstSentinelActivationSinceStateChange = this._sentinelIntervalNumber > 1;
                if(!this._hasSentinelTimeAdvanced && !this._nearEndOfMedia && notFirstSentinelActivationSinceStateChange) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
                    this._toBuffering();
                    return true;
                }
                return false;
            },

            _exitBufferingSentinel: function() {
                if(this._hasSentinelTimeAdvanced || this._mediaElement.paused) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
                    this._exitBuffering();
                    return true;
                }
                return false;
            },

            _shouldBeSeekedSentinel: function() {
                if (this._sentinelSeekTime === undefined) {
                    return false;
                }

                var self = this;
                var currentTime = this.getCurrentTime();
                var sentinelActionTaken = false;

                if (Math.abs(currentTime - this._sentinelSeekTime) > 15) {
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.seek, function() {
                        self._mediaElement.currentTime = self._sentinelSeekTime;
                    });
                } else {
                    this._sentinelSeekTime = currentTime;
                }

                return sentinelActionTaken;
            },

            _shouldBePausedSentinel: function() {
                var sentinelActionTaken = false;
                if (this._hasSentinelTimeAdvanced) {
                    var mediaElement = this._mediaElement;
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.pause, function() {
                        mediaElement.pause();
                    });
                }

                return sentinelActionTaken;
            },

            _nextSentinelAttempt: function(sentinelInfo, attemptFn) {
                var currentAttemptCount, maxAttemptCount;

                sentinelInfo.currentAttemptCount += 1;
                currentAttemptCount = sentinelInfo.currentAttemptCount;
                maxAttemptCount = sentinelInfo.maximumAttempts;

                if (currentAttemptCount === maxAttemptCount + 1) {
                    this._emitEvent(sentinelInfo.failureEvent);
                }

                if (currentAttemptCount <= maxAttemptCount) {
                    attemptFn();
                    this._emitEvent(sentinelInfo.successEvent);
                    return true;
                }

                return false;
            },

            _endOfMediaSentinel: function() {
                if (!this._hasSentinelTimeAdvanced && this._nearEndOfMedia) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_COMPLETE);
                    this._onEndOfMedia();
                    return true;
                }
                return false;
            },

            _clearSentinels: function() {
                clearInterval(this._sentinelInterval);
            },

            _setSentinels: function(sentinels) {
                var self = this;
                this._clearSentinels();
                this._sentinelIntervalNumber = 0;
                this._sentinelSetTime = this.getCurrentTime();
                this._lastSentinelTime = this.getCurrentTime();
                this._sentinelInterval = setInterval(function() {
                    self._sentinelIntervalNumber += 1;
                    var newTime = self.getCurrentTime();
                    self._hasSentinelTimeAdvanced = (newTime > self._lastSentinelTime + 0.2);
                    self._nearEndOfMedia = (self.getDuration() - (newTime || self._lastSentinelTime)) <= 1;
                    self._lastSentinelTime = newTime;
                    for (var i = 0; i < sentinels.length; i++) {
                        var sentinelActivated = sentinels[i].call(self);
                        if(sentinelActivated) {
                            break;
                        }
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
