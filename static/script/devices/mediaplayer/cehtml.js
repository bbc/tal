/**
 * @fileOverview Requirejs module containing device modifier for CEHTML media playback
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/cehtml',
    [
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer',
        'antie/runtimecontext'
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        'use strict';

        /**
         * Main MediaPlayer implementation for CEHTML devices.
         * Use this device modifier if a device implements the CEHTML media playback standard.
         * It must support creation of &lt;object&gt; elements for media mime types, and those objects must expose an
         * API in accordance with the CEHTML specification.
         * @name antie.devices.mediaplayer.CEHTML
         * @class
         * @extends antie.devices.mediaplayer.MediaPlayer
         */
        var Player = MediaPlayer.extend({

            init: function init () {
                init.base.call(this);
                this._setSentinelLimits();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            /**
             * @inheritDoc
             */
            initialiseMedia: function initialiseMedia (mediaType, url, mimeType, sourceContainer, opts) {
                opts = opts || {};
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._disableSentinels = opts.disableSentinels;
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._timeAtLastSenintelInterval = 0;
                    this._setSeekSentinelTolerance();
                    this._createElement();
                    this._addElementToDOM();
                    this._mediaElement.data = this._source;
                    this._registerEventHandlers();
                    this._toStopped();
                } else {
                    this._toError('Cannot set source unless in the \'' + MediaPlayer.STATE.EMPTY + '\' state');
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
                    this._mediaElement.play(1);
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
                this._sentinelLimits.seek.currentAttemptCount = 0;
                switch (this.getState()) {
                case MediaPlayer.STATE.BUFFERING:
                    this._deferSeekingTo = seconds;
                    break;

                case MediaPlayer.STATE.COMPLETE:
                    this._toBuffering();
                    this._mediaElement.stop();
                    this._playAndSetDeferredSeek(seconds);
                    break;

                case MediaPlayer.STATE.PLAYING:
                    this._toBuffering();
                    var seekResult = this._seekTo(seconds);
                    if(seekResult === false) {
                        this._toPlaying();
                    }
                    break;

                case MediaPlayer.STATE.PAUSED:
                    this._toBuffering();
                    this._seekTo(seconds);
                    this._mediaElement.play(1);
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
                    this._mediaElement.play(1);
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
                this._sentinelLimits.seek.currentAttemptCount = 0;

                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    // Seeking past 0 requires calling play first when media has not been loaded
                    this._toBuffering();
                    this._playAndSetDeferredSeek(seconds);
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
                    this._mediaElement.play(0);
                    this._toPaused();
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
                    this._sentinelSeekTime = undefined;
                    this._mediaElement.stop();
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
                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                case MediaPlayer.STATE.ERROR:
                    break;

                case MediaPlayer.STATE.COMPLETE:
                    if (this._range) {
                        return this._range.end;
                    }
                    break;

                default:
                    if (this._mediaElement) {
                        return this._mediaElement.playPosition / 1000;
                    }
                    break;
                }
                return undefined;
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
                return this._mediaElement;
            },

            _onFinishedBuffering: function _onFinishedBuffering () {
                this._cacheRange();

                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;
                }

                if(this._waitingToSeek()) {
                    this._toBuffering();
                    this._performDeferredSeek();
                } else if (this._waitingToPause()) {
                    this._toPaused();
                    this._mediaElement.play(0);
                } else {
                    this._toPlaying();
                }
            },

            _onDeviceError: function _onDeviceError () {
                this._reportError('Media element error code: ' + this._mediaElement.error);
            },

            _onDeviceBuffering: function _onDeviceBuffering () {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function _onEndOfMedia () {
                if (this.getState() !== MediaPlayer.STATE.COMPLETE) {
                    this._toComplete();
                }
            },

            _onStatus: function _onStatus () {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _createElement: function _createElement () {
                var device = RuntimeContext.getDevice();
                this._mediaElement = device._createElement('object', 'mediaPlayer');
                this._mediaElement.type = this._mimeType;
                this._mediaElement.style.position = 'absolute';
                this._mediaElement.style.top = '0px';
                this._mediaElement.style.left = '0px';
                this._mediaElement.style.width = '100%';
                this._mediaElement.style.height = '100%';
            },

            _registerEventHandlers: function _registerEventHandlers () {
                var self = this;
                var DEVICE_UPDATE_PERIOD_MS = 500;

                this._mediaElement.onPlayStateChange = function() {
                    switch (self._mediaElement.playState) {
                    case Player.PLAY_STATE_STOPPED:
                        break;
                    case Player.PLAY_STATE_PLAYING:
                        self._onFinishedBuffering();
                        break;
                    case Player.PLAY_STATE_PAUSED:
                        break;
                    case Player.PLAY_STATE_CONNECTING:
                        break;
                    case Player.PLAY_STATE_BUFFERING:
                        self._onDeviceBuffering();
                        break;
                    case Player.PLAY_STATE_FINISHED:
                        self._onEndOfMedia();
                        break;
                    case Player.PLAY_STATE_ERROR:
                        self._onDeviceError();
                        break;
                    default:
                        // do nothing
                        break;
                    }
                };

                this._updateInterval = setInterval(function() {
                    self._onStatus();
                }, DEVICE_UPDATE_PERIOD_MS);
            },

            _addElementToDOM: function _addElementToDOM () {
                var device = RuntimeContext.getDevice();
                var body = document.getElementsByTagName('body')[0];
                device.prependChildElement(body, this._mediaElement);
            },

            _cacheRange: function _cacheRange () {
                if(this._mediaElement) {
                    this._range =  {
                        start: 0,
                        end: this._mediaElement.playTime / 1000
                    };
                }
            },

            _playAndSetDeferredSeek: function _playAndSetDeferredSeek (seconds) {
                this._mediaElement.play(1);
                if (seconds > 0) {
                    this._deferSeekingTo = seconds;
                }
            },

            _waitingToSeek: function _waitingToSeek () {
                return (this._deferSeekingTo !== undefined);
            },

            _performDeferredSeek: function _performDeferredSeek () {
                this._seekTo(this._deferSeekingTo);
                this._deferSeekingTo = undefined;
            },

            _seekTo: function _seekTo (seconds) {
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    RuntimeContext.getDevice().getLogger().debug('playFrom ' + seconds + ' clamped to ' + clampedTime + ' - seekable range is { start: ' + this._range.start + ', end: ' + this._range.end + ' }');
                }
                this._sentinelSeekTime = clampedTime;
                return this._mediaElement.seek(clampedTime * 1000);
            },

            _waitingToPause: function _waitingToPause () {
                return (this._postBufferingState === MediaPlayer.STATE.PAUSED);
            },

            _wipe: function _wipe () {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._sentinelSeekTime = undefined;
                this._range = undefined;
                if(this._mediaElement) {
                    clearInterval(this._updateInterval);
                    this._clearSentinels();
                    this._destroyMediaElement();
                }
            },

            _destroyMediaElement: function _destroyMediaElement () {
                var device = RuntimeContext.getDevice();
                delete this._mediaElement.onPlayStateChange;
                device.removeElement(this._mediaElement);
                this._mediaElement = undefined;
            },

            _reportError: function _reportError (errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR, {'errorMessage': errorMessage});
            },

            _toStopped: function _toStopped () {
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
                if (this._sentinelInterval) {
                    this._clearSentinels();
                }
            },

            _toBuffering: function _toBuffering () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
                this._setSentinels([this._exitBufferingSentinel]);
            },

            _toPlaying: function _toPlaying () {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
                this._setSentinels([
                    this._shouldBeSeekedSentinel,
                    this._enterCompleteSentinel,
                    this._enterBufferingSentinel
                ]);
            },

            _toPaused: function _toPaused () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
                this._setSentinels([
                    this._shouldBePausedSentinel,
                    this._shouldBeSeekedSentinel
                ]);
            },

            _toComplete: function _toComplete () {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
                this._clearSentinels();
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

            _isNearToEnd: function _isNearToEnd (seconds) {
                return (this.getDuration() - seconds <= 1);
            },

            _setSentinels: function _setSentinels (sentinels) {
                if (this._disableSentinels) {
                    return;
                }

                this._sentinelLimits.pause.currentAttemptCount = 0;
                var self = this;
                this._timeAtLastSenintelInterval = this.getCurrentTime();
                this._clearSentinels();
                this._sentinelIntervalNumber = 0;
                this._sentinelInterval = setInterval(function() {
                    var newTime = self.getCurrentTime();
                    self._sentinelIntervalNumber++;

                    self._timeHasAdvanced = newTime ? (newTime > (self._timeAtLastSenintelInterval + 0.2)) : false;
                    self._sentinelTimeIsNearEnd = self._isNearToEnd(newTime ? newTime : self._timeAtLastSenintelInterval);

                    for (var i = 0; i < sentinels.length; i++) {
                        var sentinelActionPerformed = sentinels[i].call(self);
                        if (sentinelActionPerformed) {
                            break;
                        }
                    }

                    self._timeAtLastSenintelInterval = newTime;

                }, 1100);
            },

            _setSentinelLimits: function _setSentinelLimits () {
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

            _clearSentinels: function _clearSentinels () {
                clearInterval(this._sentinelInterval);
            },

            _enterBufferingSentinel: function _enterBufferingSentinel () {
                var sentinelBufferingRequired = !this._timeHasAdvanced && !this._sentinelTimeIsNearEnd && (this._sentinelIntervalNumber > 1);
                if(sentinelBufferingRequired) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
                    this._toBuffering();
                }
                return sentinelBufferingRequired;
            },

            _exitBufferingSentinel: function _exitBufferingSentinel () {
                var sentinelExitBufferingRequired = this._timeHasAdvanced;
                if(sentinelExitBufferingRequired) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
                    this._onFinishedBuffering();
                }
                return sentinelExitBufferingRequired;
            },

            _shouldBeSeekedSentinel: function _shouldBeSeekedSentinel () {
                if (this._sentinelSeekTime === undefined) {
                    return false;
                }

                var currentTime = this.getCurrentTime();

                var clampedSentinelSeekTime = this._getClampedTime(this._sentinelSeekTime);

                var sentinelSeekRequired = Math.abs(clampedSentinelSeekTime - currentTime) > this._seekSentinelTolerance;
                var sentinelActionTaken = false;

                if (sentinelSeekRequired) {
                    var mediaElement = this._mediaElement;
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.seek, function () {
                        mediaElement.seek(clampedSentinelSeekTime * 1000);
                    });
                } else if (this._sentinelIntervalNumber < 3) {
                    this._sentinelSeekTime = currentTime;
                } else {
                    this._sentinelSeekTime = undefined;
                }
                return sentinelActionTaken;
            },

            _shouldBePausedSentinel: function _shouldBePausedSentinel () {
                var sentinelPauseRequired = this._timeHasAdvanced;
                var sentinelActionTaken = false;
                if (sentinelPauseRequired) {
                    var mediaElement = this._mediaElement;
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.pause, function () {
                        mediaElement.play(0);
                    });
                }
                return sentinelActionTaken;
            },

            _enterCompleteSentinel: function _enterCompleteSentinel () {
                var sentinelCompleteRequired = !this._timeHasAdvanced && this._sentinelTimeIsNearEnd;
                if(sentinelCompleteRequired) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_COMPLETE);
                    this._onEndOfMedia();
                }
                return sentinelCompleteRequired;
            },

            _nextSentinelAttempt: function _nextSentinelAttempt (sentinelInfo, attemptFn) {
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

            _setSeekSentinelTolerance: function _setSeekSentinelTolerance () {
                var ON_DEMAND_SEEK_SENTINEL_TOLERANCE = 15;
                var LIVE_SEEK_SENTINEL_TOLERANCE = 30;

                this._seekSentinelTolerance = ON_DEMAND_SEEK_SENTINEL_TOLERANCE;
                if (this._isLiveMedia()) {
                    this._seekSentinelTolerance = LIVE_SEEK_SENTINEL_TOLERANCE;
                }
            }
        });

        Player.PLAY_STATE_STOPPED = 0;
        Player.PLAY_STATE_PLAYING = 1;
        Player.PLAY_STATE_PAUSED = 2;
        Player.PLAY_STATE_CONNECTING = 3;
        Player.PLAY_STATE_BUFFERING = 4;
        Player.PLAY_STATE_FINISHED = 5;
        Player.PLAY_STATE_ERROR = 6;

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

    // 7.14.1.1 State diagram for A/V control objects
    // Contains useful state diagram
    // 7.14.3 Extensions to A/V object for trickmodes
    // TODO: Implement onPlaySpeedChanged() to give us some logging, and check some devices to see if it is used
    // playSpeeds array might be useful - if '0' is not in the list, then perhaps we cannot pause?
    // 7.14.8 Extensions to A/V object for UI feedback of buffering A/V content
    // TODO: Implement onReadyToPlay() to give us some logging, and check some devices to see if it is used
    // 7.14.9 DOM 2 events for A/V object
    // playState can change whilst onPlayStateChange is executing

);
