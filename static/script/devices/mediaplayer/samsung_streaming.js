/**
 * @preserve Copyright (c) 2017-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

require.def(
    'antie/devices/mediaplayer/samsung_streaming',
    [
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer',
        'antie/runtimecontext'
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        'use strict';

        /**
         * MediaPlayer implementation for Samsung devices supporting HLS Live Seek implementing the Streaming API.
         * Use this device modifier if a device implements the Samsung Maple media playback standard.
         * It must support creation of &lt;object&gt; elements with appropriate SAMSUNG_INFOLINK classids.
         * Those objects must expose an API in accordance with the Samsung Streaming media specification.
         * @name antie.devices.mediaplayer.SamsungStreaming
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
            PlayerEmps: {
                Player : 0,
                StreamingPlayer : 1
            },

            init: function init () {
                init.base.call(this);
                this._state = MediaPlayer.STATE.EMPTY;
                this._currentPlayer = undefined;
                this._deferSeekingTo = null;
                this._nextSeekingTo = null;
                this._postBufferingState = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;
                this._updatingTime = false;
                this._lastWindowRanged = false;

                try {
                    this._registerSamsungPlugins();
                } catch (ignoreErr) {
                }
            },


            /**
            * @inheritDoc
            */
            initialiseMedia: function initialiseMedia (mediaType, url, mimeType) {
                this._logger = RuntimeContext.getDevice().getLogger();
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._registerEventHandlers();
                    this._toStopped();

                    if (this._isHlsMimeType()) {
                        this._openStreamingPlayerPlugin();
                        if (this._isLiveMedia()) {
                            this._source += '|HLSSLIDING|COMPONENT=HLS';
                        } else {
                            this._source += '|COMPONENT=HLS';
                        }
                    } else {
                        this._openPlayerPlugin();
                    }

                    this._initPlayer(this._source);

                } else {
                    this._toError('Cannot set source unless in the \'' + MediaPlayer.STATE.EMPTY + '\' state');
                }
            },

            _registerSamsungPlugins : function() {
                var self = this;
                this._playerPlugin = document.getElementById('sefPlayer');

                this.tvmwPlugin = document.getElementById('pluginObjectTVMW');

                this.originalSource = this.tvmwPlugin.GetSource();
                window.addEventListener('hide', function () {
                    self.stop();
                    self.tvmwPlugin.SetSource(self.originalSource);
                }, false);
            },

            _openPlayerPlugin : function() {
                if (this._currentPlayer !== undefined) {
                    this._playerPlugin.Close();
                }
                this._playerPlugin.Open('Player', '1.010', 'Player');
                this._currentPlayer = this.PlayerEmps.Player;
            },

            _openStreamingPlayerPlugin : function() {
                if (this._currentPlayer !== undefined) {
                    this._playerPlugin.Close();
                }
                this._playerPlugin.Open('StreamingPlayer', '1.0', 'StreamingPlayer');
                this._currentPlayer = this.PlayerEmps.StreamingPlayer;
            },

            _closePlugin: function _closePlugin () {
                this._playerPlugin.Close();
                this._currentPlayer = undefined;
            },

            _initPlayer: function _initPlayer (source) {
                var result = this._playerPlugin.Execute('InitPlayer', source);

                if (result !== 1) {
                    this._toError('Failed to initialize video: ' + this._source);
                }
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
                    this._playerPlugin.Execute('Resume');

                    this._toPlaying();
                    break;

                default:
                    this._toError('Cannot resume while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            playFrom: function playFrom (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                var seekingTo = this._range ? this._getClampedTimeForPlayFrom(seconds) : seconds;

                switch (this.getState()) {
                case MediaPlayer.STATE.BUFFERING:
//                        this._deferSeekingTo = seekingTo;
                    this._nextSeekingTo = seekingTo;
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
                        this._playerPlugin.Execute('Resume');
                        this._toPlaying();
                    } else {
                        this._seekToWithFailureStateTransition(seekingTo);
                        this._playerPlugin.Execute('Resume');
                    }
                    break;

                case MediaPlayer.STATE.COMPLETE:
                    this._playerPlugin.Execute('Stop');
                    this._initPlayer(this._source);
                    this._playerPlugin.Execute('StartPlayback', seekingTo);
                    this._toBuffering();
                    break;

                default:
                    this._toError('Cannot playFrom while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            beginPlayback: function beginPlayback () {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    this._toBuffering();
                    this._playerPlugin.Execute('StartPlayback');
                    break;

                default:
                    this._toError('Cannot beginPlayback while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
             * @inheritDoc
             */
            beginPlaybackFrom: function beginPlaybackFrom (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                var seekingTo = this.getSeekableRange() ? this._getClampedTimeForPlayFrom(seconds) : seconds;

                //StartPlayback from near start of range causes spoiler defect
                if (seekingTo < this.CLAMP_OFFSET_FROM_START_OF_RANGE && this._isLiveMedia()) {
                    seekingTo = this.CLAMP_OFFSET_FROM_START_OF_RANGE;
                } else {
                    seekingTo = parseInt(Math.floor(seekingTo), 10);
                }

                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    this._playerPlugin.Execute('StartPlayback', seekingTo);

                    this._toBuffering();
                    break;

                default:
                    this._toError('Cannot beginPlayback while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            pause: function pause () {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                switch (this.getState()) {
                case MediaPlayer.STATE.BUFFERING:
                case MediaPlayer.STATE.PAUSED:
                    break;

                case MediaPlayer.STATE.PLAYING:
                    this._tryPauseWithStateTransition();
                    break;

                default:
                    this._toError('Cannot pause while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            stop: function stop () {
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
                    this._toError('Cannot stop while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            reset: function reset () {
                switch (this.getState()) {
                case MediaPlayer.STATE.EMPTY:
                    break;

                case MediaPlayer.STATE.STOPPED:
                case MediaPlayer.STATE.ERROR:
                    this._toEmpty();
                    break;

                default:
                    this._toError('Cannot reset while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
            * @inheritDoc
            */
            getSource: function getSource () {
                return this._source;
            },

            /**
            * @inheritDoc
            */
            getMimeType: function getMimeType () {
                return this._mimeType;
            },

            /**
            * @inheritDoc
            */
            getCurrentTime: function getCurrentTime () {
                if (this.getState() === MediaPlayer.STATE.STOPPED) {
                    return undefined;
                } else {
                    return this._currentTime;
                }
            },

            /**
            * @inheritDoc
            */
            getSeekableRange: function getSeekableRange () {
                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                case MediaPlayer.STATE.ERROR:
                    break;

                default:
                    return this._range;
                }
                return undefined;
            },

            _isLiveRangeOutdated: function _isLiveRangeOutdated () {
                var time = Math.floor(this._currentTime);
                if (time % 8 === 0 && !this._updatingTime && this._lastWindowRanged !== time) {
                    this._lastWindowRanged = time;
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * @inheritDoc
             */
            _getMediaDuration: function _getMediaDuration () {
                if (this._range) {
                    return this._range.end;
                }
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getState: function getState () {
                return this._state;
            },

            /**
             * @inheritDoc
             */
            getPlayerElement: function getPlayerElement () {
                return this._playerPlugin;
            },

            _onFinishedBuffering: function _onFinishedBuffering () {
                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;
                }

                if (!this._isInitialBufferingFinished() && this._nextSeekingTo !== null) {
                    this._deferSeekingTo = this._nextSeekingTo;
                    this._nextSeekingTo = null;
                }

                if (this._deferSeekingTo === null) {
                    if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                        this._tryPauseWithStateTransition();
                    } else {
                        this._toPlaying();
                    }
                }
            },

            _onDeviceError: function _onDeviceError (message) {
                this._reportError(message);
            },

            _onDeviceBuffering: function _onDeviceBuffering () {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function _onEndOfMedia () {
                this._toComplete();
            },

            _stopPlayer: function _stopPlayer () {
                this._playerPlugin.Execute('Stop');

                this._currentTimeKnown = false;
            },

            _tryPauseWithStateTransition: function _tryPauseWithStateTransition () {
                var success = this._playerPlugin.Execute('Pause');
                success = success && (success !== -1);

                if (success) {
                    this._toPaused();
                }

                this._tryingToPause = !success;
            },

            _onStatus: function _onStatus () {
                var state = this.getState();
                if (state === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _updateRange: function _updateRange () {
                var self = this;
                if (this._isHlsMimeType() && this._isLiveMedia()) {
                    var range = this._playerPlugin.Execute('GetPlayingRange').split('-');
                    this._range = {
                        start: Math.floor(range[0]),
                        end: Math.floor(range[1])
                    };
                    //don't call range for the next 8 seconds
                    this._updatingTime = true;
                    setTimeout(function () {
                        self._updatingTime = false;
                    }, self.RANGE_UPDATE_TOLERANCE * 1000);
                } else {
                    var duration = this._playerPlugin.Execute('GetDuration')/1000;
                    this._range = {
                        start: 0,
                        end: duration
                    };
                }
            },


            _onCurrentTime: function _onCurrentTime (timeInMillis) {
                this._currentTime = timeInMillis / 1000;
                this._onStatus();
                this._currentTimeKnown = true;

                //[optimisation] do not call player API periodically in HLS live
                // - calculate range manually when possible
                // - do not calculate range if player API was called less than RANGE_UPDATE_TOLERANCE seconds ago
                if (this._isLiveMedia() && this._isLiveRangeOutdated()) {
                    this._range.start += 8;
                    this._range.end += 8;
                }

                if (this._nextSeekingTo !== null) {
                    this._deferSeekingTo = this._nextSeekingTo;
                    this._nextSeekingTo = null;
                }

                if (this._deferSeekingTo !== null) {
                    this._deferredSeek();
                }

                if (this._tryingToPause) {
                    this._tryPauseWithStateTransition();
                }
            },

            _deferredSeek: function _deferredSeek () {
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

            _getClampedTimeForPlayFrom: function _getClampedTimeForPlayFrom (seconds) {
                if (this._currentPlayer === this.PlayerEmps.StreamingPlayer && !this._updatingTime) {
                    this._updateRange();
                }
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    RuntimeContext.getDevice().getLogger().debug('playFrom ' + seconds+ ' clamped to ' + clampedTime + ' - seekable range is { start: ' + this._range.start + ', end: ' + this._range.end + ' }');
                }
                return clampedTime;
            },

            _getClampOffsetFromConfig: function _getClampOffsetFromConfig () {
                var clampOffsetFromEndOfRange;
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides) {
                    clampOffsetFromEndOfRange = config.streaming.overrides.clampOffsetFromEndOfRange;
                }

                if(clampOffsetFromEndOfRange !== undefined) {
                    return clampOffsetFromEndOfRange;
                } else if (this._isLiveMedia()) {
                    return this.CLAMP_OFFSET_FROM_END_OF_LIVE_RANGE;
                } else {
                    return this.CLAMP_OFFSET_FROM_END_OF_RANGE;
                }
            },

            _registerEventHandlers: function _registerEventHandlers () {
                var self = this;
                this._playerPlugin.OnEvent = function(eventType, param1/*, param2*/) {

                    if (eventType !== self.PlayerEventCodes.CURRENT_PLAYBACK_TIME) {
                        //self._logger.info('Received event ' + eventType + ' ' + param1);
                    }

                    switch (eventType) {

                    case self.PlayerEventCodes.STREAM_INFO_READY:
                        self._updateRange();
                        break;

                    case self.PlayerEventCodes.CURRENT_PLAYBACK_TIME:
                        if (self._range && self._isLiveMedia()) {
                            var seconds = Math.floor(param1/1000);
                            //jump to previous current time if PTS out of range occurs
                            if (seconds > self._range.end + self.RANGE_END_TOLERANCE) {
                                self.playFrom(self._currentTime);
                                break;
                            //call GetPlayingRange() on SEF emp if current time is out of range
                            } else if (!self._isCurrentTimeInRangeTolerance(seconds)) {
                                self._updateRange();
                            }
                        }
                        self._onCurrentTime(param1);
                        break;

                    case self.PlayerEventCodes.BUFFERING_START:
                    case self.PlayerEventCodes.BUFFERING_PROGRESS:
                        self._onDeviceBuffering();
                        break;

                    case self.PlayerEventCodes.BUFFERING_COMPLETE:
                        // For live HLS, don't update the range more than once every 8 seconds
                        if (!self._updatingTime) {
                            self._updateRange();
                        }
                        //[optimisation] if Stop() is not called after RENDERING_COMPLETE then player sends periodically BUFFERING_COMPLETE and RENDERING_COMPLETE
                        //ignore BUFFERING_COMPLETE if player is already in COMPLETE state
                        if (self.getState() !== MediaPlayer.STATE.COMPLETE) {
                            self._onFinishedBuffering();
                        }
                        break;

                    case self.PlayerEventCodes.RENDERING_COMPLETE:
                        //[optimisation] if Stop() is not called after RENDERING_COMPLETE then player sends periodically BUFFERING_COMPLETE and RENDERING_COMPLETE
                        //ignore RENDERING_COMPLETE if player is already in COMPLETE state
                        if (self.getState() !== MediaPlayer.STATE.COMPLETE) {
                            self._onEndOfMedia();
                        }
                        break;

                    case self.PlayerEventCodes.CONNECTION_FAILED:
                        self._onDeviceError('Media element emitted OnConnectionFailed');
                        break;

                    case self.PlayerEventCodes.NETWORK_DISCONNECTED:
                        self._onDeviceError('Media element emitted OnNetworkDisconnected');
                        break;

                    case self.PlayerEventCodes.AUTHENTICATION_FAILED:
                        self._onDeviceError('Media element emitted OnAuthenticationFailed');
                        break;

                    case self.PlayerEventCodes.RENDER_ERROR:
                        self._onDeviceError('Media element emitted OnRenderError');
                        break;

                    case self.PlayerEventCodes.STREAM_NOT_FOUND:
                        self._onDeviceError('Media element emitted OnStreamNotFound');
                        break;
                    }
                };

                this._onWindowHide = function () {
                    self.stop();
                };

                window.addEventListener('hide', this._onWindowHide, false);
                window.addEventListener('unload', this._onWindowHide, false);
            },

            _unregisterEventHandlers: function _unregisterEventHandlers () {
                this._playerPlugin.OnEvent = undefined;
                window.removeEventListener('hide', this._onWindowHide, false);
                window.removeEventListener('unload', this._onWindowHide, false);
            },

            _wipe: function _wipe () {
                this._stopPlayer();
                this._closePlugin();
                this._unregisterEventHandlers();
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._currentTime = undefined;
                this._range = undefined;
                this._deferSeekingTo = null;
                this._nextSeekingTo = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;
                this._updatingTime = false;
                this._lastWindowRanged = false;
            },

            _seekTo: function _seekTo (seconds) {
                var offset = seconds - this.getCurrentTime();
                var success = this._jump(offset);

                if (success === 1) {
                    this._currentTime = seconds;
                }

                return success;
            },

            _seekToWithFailureStateTransition: function _seekToWithFailureStateTransition (seconds) {
                var success = this._seekTo(seconds);
                if (success !== 1) {
                    this._toPlaying();
                }
            },

            _jump: function _jump (offsetSeconds) {
                var result;
                if (offsetSeconds > 0) {
                    result = this._playerPlugin.Execute('JumpForward', offsetSeconds);
                    return result;
                } else {
                    result = this._playerPlugin.Execute('JumpBackward', Math.abs(offsetSeconds));
                    return result;
                }
            },

            _isHlsMimeType: function _isHlsMimeType () {
                var mime = this._mimeType.toLowerCase();
                return mime === 'application/vnd.apple.mpegurl' || mime === 'application/x-mpegurl';
            },

            _isCurrentTimeInRangeTolerance: function _isCurrentTimeInRangeTolerance (seconds) {
                if (seconds > this._range.end + this.RANGE_UPDATE_TOLERANCE) {
                    return false;
                } else if (seconds < this._range.start - this.RANGE_UPDATE_TOLERANCE) {
                    return false;
                } else {
                    return true;
                }
            },

            _isInitialBufferingFinished: function _isInitialBufferingFinished () {
                if (this._currentTime === undefined || this._currentTime === 0) {
                    return false;
                } else {
                    return true;
                }
            },

            _reportError: function _reportError (errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR, {'errorMessage': errorMessage});
            },

            _toStopped: function _toStopped () {
                this._currentTime = 0;
                this._range = undefined;
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toBuffering: function _toBuffering () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
            },

            _toPlaying: function _toPlaying () {
                if (this._isHlsMimeType() && this._isLiveMedia() && !this._updatingTime) {
                    this._updateRange();
                }
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
            },

            _toPaused: function _toPaused () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
            },

            _toComplete: function _toComplete () {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
            },

            _toEmpty: function _toEmpty () {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function _toError (errorMessage) {
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._reportError(errorMessage);
                throw 'ApiError: ' + errorMessage;
            },

            /**
             * @constant {Number} Time (in seconds) compared to current time within which seeking has no effect.
             * Jumping to time lower than 3s causes error in PlayFrom60 on HLS live - player jumps to previous chunk.
             * Value set to 4s to be ahead of potential wrong player jumps.
             */
            CURRENT_TIME_TOLERANCE: 4,
            CLAMP_OFFSET_FROM_END_OF_LIVE_RANGE: 10,
            CLAMP_OFFSET_FROM_START_OF_RANGE: 1.1,
            RANGE_UPDATE_TOLERANCE: 8,
            RANGE_END_TOLERANCE: 100
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

);
