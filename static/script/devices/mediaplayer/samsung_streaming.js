/**
 * @fileOverview Requirejs module containing device modifier for media playback on Samsung devices.
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
    "antie/devices/mediaplayer/samsung_streaming",
    [
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext"
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        "use strict";

        /**
         * Main MediaPlayer implementation for Samsung devices implementing the Maple API.
         * Use this device modifier if a device implements the Samsung Maple media playback standard.
         * It must support creation of &lt;object&gt; elements with appropriate SAMSUNG_INFOLINK classids.
         * Those objects must expose an API in accordance with the Samsung Maple media specification.
         * @name antie.devices.mediaplayer.SamsungMaple
         * @class
         * @extends antie.devices.mediaplayer.MediaPlayer
         */
        var Player = MediaPlayer.extend({
            PlayerEventCodes : {
                CONNECTION_FAILED : 1,
                AUTHENTICATION_FAILED : 2,
                STREAM_NOT_FOUND : 3,
                NETWORK_DISCONNECTED : 4,
                NETWORK_SLOW : 5,
                RENDER_ERROR : 6,
                RENDERING_START : 7,
                RENDERING_COMPLETE : 8,
                STREAM_INFO_READY : 9,
                DECODING_COMPLETE : 10,
                BUFFERING_START : 11,
                BUFFERING_COMPLETE : 12,
                BUFFERING_PROGRESS : 13,
                CURRENT_PLAYBACK_TIME : 14,
                AD_START : 15,
                AD_END : 16,
                RESOLUTION_CHANGED : 17,
                BITRATE_CHANGED : 18,
                SUBTITLE : 19,
                CUSTOM : 20
            },

            init: function() {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
                this._deferSeekingTo = null;
                this._postBufferingState = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;

                try {
                    this._registerSamsungPlugins();
                } catch (ignoreErr) {
                }
            },


            /**
            * @inheritDoc
            */
            setSource: function (mediaType, url, mimeType) {
                this.logger = RuntimeContext.getDevice().getLogger();
                if (this.getState() === MediaPlayer.STATE.EMPTY) {

                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._registerEventHandlers();
                    this._toStopped();


                    // this.logger.info('setSource(): ' + mediaType);

                    if (mediaType === 'live-video') {
                    //    this.logger.info("recognised live video, appending URL");
                        this._source += "|HLSSLIDING|COMPONENT=HLS";
                    } else {
                        this._source += "|COMPONENT=HLS";       //<TODO> is this correct for VOD HLS?
                    }

                    this._initPlayer(this._source);

                } else {
                    this._toError("Cannot set source unless in the '" + MediaPlayer.STATE.EMPTY + "' state");
                }
            },

            _registerSamsungPlugins : function() {
                var self = this;
                this._playerPlugin = document.getElementById('sefPlayer');

                this.logger.info('Calling this.playerPlugin.Open("StreamingPlayer", "1.0", "StreamingPlayer")');
                var openResponse = this._playerPlugin.Open("StreamingPlayer", "1.0", "StreamingPlayer");
                this.logger.info('this.playerPlugin.Open responded with ' + openResponse);

                this.tvmwPlugin = document.getElementById('pluginObjectTVMW');

                this.originalSource = this.tvmwPlugin.GetSource();
                window.addEventListener('hide', function () {
                    self.stop();
                    self.tvmwPlugin.SetSource(self.originalSource);
                }, false);
            },

            _initPlayer: function(source) {
                this.logger.info('Calling this.playerPlugin.Execute("InitPlayer", ' + this._source + ')');
                var result = this._playerPlugin.Execute("InitPlayer", source);
                this.logger.info('InitPlayer responded with ' + result);

                this.logger.info('Calling this.playerPlugin.Execute("SetTotalBufferSize", ' +  32 *1024*1024 + ')');
                result = this._playerPlugin.Execute("SetTotalBufferSize", 32 *1024*1024);
                this.logger.info('SetTotalBufferSize responded with ' + result);

                this.logger.info('Calling this.playerPlugin.Execute("SetInitialBufferSize", ' +  32 *1024*1024 + ')');
                result = this._playerPlugin.Execute("SetInitialBufferSize", 32 *1024*1024);
                this.logger.info('SetInitialBufferSize responded with ' + result);

                this.logger.info('Calling this.playerPlugin.Execute("SetPendingBuffer", ' +  32 *1024*1024 + ')');
                result = this._playerPlugin.Execute("SetPendingBuffer", 32 *1024*1024);
                this.logger.info('InitPlayer responded with ' + result);
            },

            /**
            * @inheritDoc
            */
            resume : function () {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PLAYING:
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                        if (this._tryingToPause) {
                            this._tryingToPause = false;
                            this._toPlaying();
                        }
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        this.logger.info('calling this._playerPlugin.Execute("Resume")');
                        var result = this._playerPlugin.Execute("Resume");
                        this.logger.info('Resume responded with ' + result);

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
                var seekingTo = this._range ? this._getClampedTimeForPlayFrom(seconds) : seconds;

                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                        this._deferSeekingTo = seekingTo;
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._toBuffering();
                        if (!this._currentTimeKnown) {
                            this._deferSeekingTo = seekingTo;
                        } else if (this._isNearToCurrentTime(seekingTo)) {
                            this._toPlaying();
                        } else {
                            this._seekToWithFailureStateTransition(seekingTo);
                        }
                        break;


                    case MediaPlayer.STATE.PAUSED:
                        this._toBuffering();
                        if (!this._currentTimeKnown) {
                            this._deferSeekingTo = seekingTo;
                        } else if (this._isNearToCurrentTime(seekingTo)) {
                            this.logger.info('Calling this._playerPlugin.Execute("Resume")');
                            var result = this._playerPlugin.Execute("Resume");
                            this.logger.info('"Resume" responded with ' + result);
                            this._toPlaying();
                        } else {
                            this._seekToWithFailureStateTransition(seekingTo);
                            this.logger.info('Calling this._playerPlugin.Execute("Resume")');
                            var result = this._playerPlugin.Execute("Resume");
                            this.logger.info('"Resume" responded with ' + result);
                        }
                        break;

                    case MediaPlayer.STATE.COMPLETE:
                        this.logger.info('Calling this.playerPlugin.Execute("Stop");');
                        var result = this._playerPlugin.Execute("Stop");
                        this.logger.info('"Stop" responded with ' + result);

                        //this._setDisplayFullScreenForVideo();
                        //this._playerPlugin.ResumePlay(this._wrappedSource(), seekingTo);

                        this.logger.info('Calling this.playerPlugin.Execute("StartPlayback");');
                        var result = this._playerPlugin.Execute("StartPlayback");        // <TODO> set seeking to some how
                        this.logger.info('"StartPlayback" responded with ' + result);

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
            beginPlayback: function() {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        this._toBuffering();
                        //this._setDisplayFullScreenForVideo();
                        //this._playerPlugin.Play(this._wrappedSource());
                        this.logger.info('Calling this.playerPlugin.Execute("StartPlayback",0)');
                        var result = this._playerPlugin.Execute("StartPlayback", 0);
                        this.logger.info('"StartPlayback" responded with ' + result);

                        break;

                    default:
                        this._toError("Cannot beginPlayback while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
             * @inheritDoc
             */
            beginPlaybackFrom: function(seconds) {
                // this.logger.info('beginPlaybackFrom:'+seconds);

                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                var seekingTo = this._range ? this._getClampedTimeForPlayFrom(seconds) : seconds;

                this._targetSeekTime = seconds;

                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:

                        //this._setDisplayFullScreenForVideo();
                        //this._playerPlugin.ResumePlay(this._wrappedSource(), seekingTo);

                        this.logger.info('Calling this.playerPlugin.Execute("StartPlayback, ' + seekingTo + ')');
                        var success = this._playerPlugin.Execute("StartPlayback", seekingTo);
                        this.logger.info('"StartPlayback" responded with ' + success);

                        this._toBuffering();
                        break;

                    default:
                        this._toError("Cannot beginPlayback while in the '" + this.getState() + "' state");
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
                        this._tryPauseWithStateTransition();
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
                    case MediaPlayer.STATE.STOPPED:
                        break;

                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._stopPlayer();
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
                if (this.getState() === MediaPlayer.STATE.STOPPED) {
                    return undefined;
                } else {
                    return this._currentTime;
                }
            },

            /**
            * @inheritDoc
            */
            getSeekableRange: function () {
                return this._range;
            },

            /**
             * @inheritDoc
             */
            _getMediaDuration: function() {
                if (this._range) {
                    return this._range.end;
                }
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getState: function () {
                return this._state;
            },

            /**
             * @inheritDoc
             */
            getPlayerElement: function() {
                return this._playerPlugin;
            },

            _onFinishedBuffering: function() {
                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;
                }

                if (this._deferSeekingTo === null) {
                    if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                        this._tryPauseWithStateTransition();
                    } else {
                        this._toPlaying();
                    }
                }
            },

            _onDeviceError: function(message) {
                this._reportError(message);
            },

            _onDeviceBuffering: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function() {
                this._toComplete();
            },

            _stopPlayer: function() {
                this.logger.info('Calling this.playerPlugin.Execute("Stop")');
                var result = this._playerPlugin.Execute("Stop");
                this.logger.info('"Stop" responded with ' + result);

                this._currentTimeKnown = false;
            },

            _tryPauseWithStateTransition: function() {
                this.logger.info('Calling this.playerPlugin.Execute("Pause")');
                var success = this._isSuccessCode(this._playerPlugin.Execute("Pause"));
                this.logger.info('"Pause" responded with ' + success);

                if (success) {
                    this._toPaused();
                }

                this._tryingToPause = !success;
            },

            _onStatus: function() {
                var state = this.getState();
                if (state === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _onMetadata: function() {
                this.logger.info('Calling this.playerPlugin.Execute("GetDuration")');
                this._range = {
                    start: 0,
                    end: this._playerPlugin.Execute("GetDuration") / 1000
                };

                this.logger.info('GetDuration returned ' + this._range.end * 1000 + 'ms');

                // this.logger.info("_onMetadata range = {0, "  + this._range.end);
                // this.logger.info("this._currentTime = " + this._currentTime);       //<TODO> so currentTime is currently in milliseconds relative to midnight! and not to hls window

                if (this._waitingToPlayFrom()) {
                    this._deferredPlayFrom();
                }

                this._onFinishedBuffering();
            },

            _waitingToPlayFrom: function() {
                return this._targetSeekTime !== undefined;
            },

            _deferredPlayFrom: function() {
                this._seekTo(this._targetSeekTime);

                if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._tryPauseWithStateTransition();
                }
                this._targetSeekTime = undefined;
            },


            _onCurrentTime: function(timeInMillis) {

                //this.logger.info("_onCurrentTime "  + timeInMillis);

                this._currentTime = timeInMillis / 1000;
                this._onStatus();
                this._currentTimeKnown = true;

                if (this._deferSeekingTo !== null) {
                    this._deferredSeek();
                }

                if (this._tryingToPause) {
                    this._tryPauseWithStateTransition();
                }
            },

            _deferredSeek: function() {
                var clampedTime = this._getClampedTimeForPlayFrom(this._deferSeekingTo);
                var isNearCurrentTime = this._isNearToCurrentTime(clampedTime);

                if (isNearCurrentTime) {
                    this._toPlaying();
                    this._deferSeekingTo = null;
                } else {
                    var seekResult = this._seekTo(clampedTime);
                    if (seekResult) {
                        this._deferSeekingTo = null;
                    }
                }
            },

            _getClampedTimeForPlayFrom: function (seconds) {
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    RuntimeContext.getDevice().getLogger().debug("playFrom " + seconds+ " clamped to " + clampedTime + " - seekable range is { start: " + this._range.start + ", end: " + this._range.end + " }");
                }
                return clampedTime;
            },

            _registerEventHandlers: function() {
                var self = this;
                this._playerPlugin.OnEvent = function(eventType, param1, param2) {

                    if (eventType !== self.PlayerEventCodes.CURRENT_PLAYBACK_TIME) {
                        self.logger.info("Received event " + eventType + ' ' + param1);
                    }

                    switch (eventType) {

                        case self.PlayerEventCodes.STREAM_INFO_READY:
                            self._onMetadata();
                            break;

                        case self.PlayerEventCodes.CURRENT_PLAYBACK_TIME:
                            self._onCurrentTime(param1);
                            break;

                        // All these below doesn't seem to be implemented for HLS? I certainly have not seen any of these being logged....

                        case self.PlayerEventCodes.BUFFERING_START:
                        case self.PlayerEventCodes.BUFFERING_PROGRESS:
                            self._onDeviceBuffering();
                            break;

                        case self.PlayerEventCodes.BUFFERING_COMPLETE:
                            self._onFinishedBuffering();
                            break;

                        case self.PlayerEventCodes.RENDERING_COMPLETE:
                            self._onEndOfMedia();
                            break;

                        case self.PlayerEventCodes.CONNECTION_FAILED:
                            self._onDeviceError("Connection failed");
                            break;

                        case self.PlayerEventCodes.AUTHENTICATION_FAILED:
                            self._onDeviceError("Authentication failed");
                            break;

                        case self.PlayerEventCodes.RENDER_ERROR:
                            self._onDeviceError("Render failed");
                            break;

                        case self.PlayerEventCodes.STREAM_NOT_FOUND:
                            self._onDeviceError("Stream not found");
                            break;
                    }
                };

                this._onWindowHide = function () {
                    self.stop();
                };

                window.addEventListener('hide', this._onWindowHide, false);
                window.addEventListener('unload', this._onWindowHide, false);
            },
            _handlePlaying : function() {
                this.bubbleEvent(new MediaEvent("playing", this));
            },

            _unregisterEventHandlers: function() {
                window.removeEventListener('hide', this._onWindowHide, false);
                window.removeEventListener('unload', this._onWindowHide, false);
            },

            _wipe: function () {
                this._stopPlayer();
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._currentTime = undefined;
                this._range = undefined;
                this._deferSeekingTo = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;
                this._unregisterEventHandlers();
                this._targetSeekTime = undefined;
            },

            _seekTo: function(seconds) {
                var offset = seconds - this.getCurrentTime();
                var success = this._jump(offset);

                if (success) {
                    this._currentTime = seconds;
                }

                return success;
            },

            _seekToWithFailureStateTransition: function(seconds) {
                var success = this._seekTo(seconds);
                if (!success) {
                    this._toPlaying();
                }
            },

            _jump: function (offsetSeconds) {

                if (offsetSeconds > 0) {
                    this.logger.info('Calling this.playerPlugin.Execute("JumpForward", ' + offsetSeconds + ')');
                    var result = this._playerPlugin.Execute("JumpForward", offsetSeconds);
                    this.logger.info('"JumpForward" responded with ' + result);
                    return result;
                } else {
                    this.logger.info('Calling this.playerPlugin.Execute("JumpBackward", ' + Math.abs(offsetSeconds) + ')');
                    var result = this._playerPlugin.Execute("JumpBackward", Math.abs(offsetSeconds));
                    this.logger.info('"JumpBackward" responded with ' + result);
                    return result;
                }
            },

            _isHlsMimeType: function () {
                var mime = this._mimeType.toLowerCase();
                return mime === "application/vnd.apple.mpegurl" || mime === "application/x-mpegurl";
            },

            _reportError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR);
            },

            _toStopped: function () {
                this._currentTime = 0;
                this._range = undefined;
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toBuffering: function () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
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
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
            },

            _toEmpty: function () {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function(errorMessage) {
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._reportError(errorMessage);
                throw "ApiError: " + errorMessage;
            },

            _setDisplayFullScreenForVideo: function() {
                if (this._type === MediaPlayer.TYPE.VIDEO) {
                    var dimensions = RuntimeContext.getDevice().getScreenSize();
                    this.logger.info('Calling this.playerPlugin.SetDisplayArea');
                    var result = this._playerPlugin.SetDisplayArea(0, 0, dimensions.width, dimensions.height);
                    this.logger.info('"SetDisplayArea" responded with ' + result);
                }
            },

            _isSuccessCode: function(code) {
                var samsung2010ErrorCode = -1;
                return code && code !== samsung2010ErrorCode;
            },

            /**
             * @constant {Number} Time (in seconds) compared to current time within which seeking has no effect.
             * On a sample device (Samsung FoxP 2013), seeking by two seconds worked 90% of the time, but seeking
             * by 2.5 seconds was always seen to work.
             */
            CURRENT_TIME_TOLERANCE: 2.5
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

);
