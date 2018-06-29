/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media playback
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/html5',
    [
        'antie/runtimecontext',
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function(RuntimeContext, Device, MediaPlayer) {
        'use strict';

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
                    this._trustZeroes = false;
                    this._ignoreNextPauseEvent = false;
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    var device = RuntimeContext.getDevice();

                    var idSuffix = 'Video';
                    if (mediaType === MediaPlayer.TYPE.AUDIO || mediaType === MediaPlayer.TYPE.LIVE_AUDIO) {
                        idSuffix = 'Audio';
                    }

                    this._setSeekSentinelTolerance();

                    this._mediaElement = device._createElement(idSuffix.toLowerCase(), 'mediaPlayer' + idSuffix);
                    this._mediaElement.autoplay = false;
                    this._mediaElement.style.position = 'absolute';
                    this._mediaElement.style.top = '0px';
                    this._mediaElement.style.left = '0px';
                    this._mediaElement.style.width = '100%';
                    this._mediaElement.style.height = '100%';

                    var self = this;
                    this._wrapOnFinishedBuffering = function() {
                        self._onFinishedBuffering();
                    };
                    this._wrapOnError = function() {
                        self._onDeviceError();
                    };
                    this._wrapOnEndOfMedia = function() {
                        self._onEndOfMedia();
                    };
                    this._wrapOnDeviceBuffering = function() {
                        self._onDeviceBuffering();
                    };
                    this._wrapOnStatus = function() {
                        self._onStatus();
                    };
                    this._wrapOnMetadata = function() {
                        self._onMetadata();
                    };
                    this._wrapOnSourceError = function() {
                        self._onSourceError();
                    };
                    this._wrapOnPause = function() {
                        self._onPause();
                    };
                    this._mediaElement.addEventListener('canplay', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener('seeked', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener('playing', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.addEventListener('error', this._wrapOnError, false);
                    this._mediaElement.addEventListener('ended', this._wrapOnEndOfMedia, false);
                    this._mediaElement.addEventListener('waiting', this._wrapOnDeviceBuffering, false);
                    this._mediaElement.addEventListener('timeupdate', this._wrapOnStatus, false);
                    this._mediaElement.addEventListener('loadedmetadata', this._wrapOnMetadata, false);
                    this._mediaElement.addEventListener('pause', this._wrapOnPause, false);

                    device.prependChildElement(sourceContainer, this._mediaElement);

                    this._sourceElement = this._generateSourceElement(url, mimeType);
                    this._sourceElement.addEventListener('error', this._wrapOnSourceError, false);

                    this._mediaElement.preload = 'auto';
                    device.appendChildElement(this._mediaElement, this._sourceElement);

                    this._mediaElement.load();

                    this._toStopped();
                } else {
                    this._toError('Cannot set source unless in the \'' + MediaPlayer.STATE.EMPTY + '\' state');
                }
            },

            /**
             * @inheritDoc
             */
            playFrom: function playFrom (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                this._targetSeekTime = seconds;
                this._sentinelLimits.seek.currentAttemptCount = 0;

                switch (this.getState()) {
                case MediaPlayer.STATE.PAUSED:
                case MediaPlayer.STATE.COMPLETE:
                    this._trustZeroes = true;
                    this._toBuffering();
                    this._playFromIfReady();
                    break;

                case MediaPlayer.STATE.BUFFERING:
                    this._playFromIfReady();
                    break;

                case MediaPlayer.STATE.PLAYING:
                    this._trustZeroes = true;
                    this._toBuffering();
                    this._targetSeekTime = this._getClampedTimeForPlayFrom(seconds);
                    if (this._isNearToCurrentTime(this._targetSeekTime)) {
                        this._targetSeekTime = undefined;
                        this._toPlaying();
                    } else {
                        this._playFromIfReady();
                    }
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
                this._sentinelSeekTime = undefined;
                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    this._trustZeroes = true;
                    this._toBuffering();
                    this._mediaElement.play();
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
                this._targetSeekTime = seconds;
                this._sentinelLimits.seek.currentAttemptCount = 0;

                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    this._trustZeroes = true;
                    this._toBuffering();
                    this._playFromIfReady();
                    break;

                default:
                    this._toError('Cannot beginPlaybackFrom while in the \'' + this.getState() + '\' state');
                    break;
                }
            },

            /**
             * @inheritDoc
             */
            pause: function pause () {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                switch (this.getState()) {
                case MediaPlayer.STATE.PAUSED:
                    break;

                case MediaPlayer.STATE.BUFFERING:
                    this._sentinelLimits.pause.currentAttemptCount = 0;
                    if (this._isReadyToPlayFrom()) {
                        // If we are not ready to playFrom, then calling pause would seek to the start of media, which we might not want.
                        this._pauseMediaElement();
                    }
                    break;

                case MediaPlayer.STATE.PLAYING:
                    this._sentinelLimits.pause.currentAttemptCount = 0;
                    this._pauseMediaElement();
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
            resume : function() {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                case MediaPlayer.STATE.PLAYING:
                    break;

                case MediaPlayer.STATE.BUFFERING:
                    if (this._isReadyToPlayFrom()) {
                        // If we are not ready to playFrom, then calling play would seek to the start of media, which we might not want.
                        this._mediaElement.play();
                    }
                    break;

                case MediaPlayer.STATE.PAUSED:
                    this._mediaElement.play();
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
            stop: function stop () {
                switch (this.getState()) {
                case MediaPlayer.STATE.STOPPED:
                    break;

                case MediaPlayer.STATE.BUFFERING:
                case MediaPlayer.STATE.PLAYING:
                case MediaPlayer.STATE.PAUSED:
                case MediaPlayer.STATE.COMPLETE:
                    this._pauseMediaElement();
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
            getSeekableRange: function getSeekableRange () {
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
            _getMediaDuration: function _getMediaDuration () {
                if (this._mediaElement && this._isReadyToPlayFrom()) {
                    return this._mediaElement.duration;
                }
                return undefined;
            },

            _getSeekableRange: function _getSeekableRange () {
                if (this._mediaElement) {
                    if (this._isReadyToPlayFrom() && this._mediaElement.seekable && this._mediaElement.seekable.length > 0) {
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
                        RuntimeContext.getDevice().getLogger().warn('No \'duration\' or \'seekable\' on media element');
                    }
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
                this._exitBuffering();
            },

            _pauseMediaElement: function _pauseMediaElement () {
                this._mediaElement.pause();
                this._ignoreNextPauseEvent = true;
            },

            _onPause: function _onPause () {
                if (this._ignoreNextPauseEvent) {
                    this._ignoreNextPauseEvent = false;
                    return;
                }

                if (this.getState() !== MediaPlayer.STATE.PAUSED) {
                    this._toPaused();
                }
            },

            _onDeviceError: function _onDeviceError () {
                this._reportError('Media element error code: ' + this._mediaElement.error.code);
            },

            _onSourceError: function _onSourceError () {
                this._reportError('Media source element error');
            },

            /**
             * @protected
             */
            _onDeviceBuffering: function _onDeviceBuffering () {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function _onEndOfMedia () {
                this._toComplete();
            },

            _onStatus: function _onStatus () {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _onMetadata: function _onMetadata () {
                this._metadataLoaded();
            },

            _exitBuffering: function _exitBuffering () {
                this._metadataLoaded();
                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;

                } else if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._toPaused();
                } else {
                    this._toPlaying();
                }
            },

            _metadataLoaded: function _metadataLoaded () {
                this._readyToPlayFrom = true;
                if (this._waitingToPlayFrom()) {
                    this._deferredPlayFrom();
                }
            },

            _playFromIfReady: function _playFromIfReady () {
                if (this._isReadyToPlayFrom()) {
                    if (this._waitingToPlayFrom()) {
                        this._deferredPlayFrom();
                    }
                }
            },

            _waitingToPlayFrom: function _waitingToPlayFrom () {
                return this._targetSeekTime !== undefined;
            },

            _deferredPlayFrom: function _deferredPlayFrom () {
                this._seekTo(this._targetSeekTime);
                this._mediaElement.play();
                if (this._postBufferingState === MediaPlayer.STATE.PAUSED) {
                    this._pauseMediaElement();
                }
                this._targetSeekTime = undefined;
            },

            _seekTo: function _seekTo (seconds) {
                var clampedTime = this._getClampedTimeForPlayFrom(seconds);
                this._mediaElement.currentTime = clampedTime;
                this._sentinelSeekTime = clampedTime;
            },

            _getClampedTimeForPlayFrom: function _getClampedTimeForPlayFrom (seconds) {
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    var range = this._getSeekableRange();
                    RuntimeContext.getDevice().getLogger().debug('playFrom ' + seconds + ' clamped to ' + clampedTime + ' - seekable range is { start: ' + range.start + ', end: ' + range.end + ' }');
                }
                return clampedTime;
            },

            _wipe: function _wipe () {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._targetSeekTime = undefined;
                this._sentinelSeekTime = undefined;
                this._clearSentinels();
                this._destroyMediaElement();
                this._readyToPlayFrom = false;
            },

            _destroyMediaElement: function _destroyMediaElement () {
                if (this._mediaElement) {
                    this._mediaElement.removeEventListener('canplay', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener('seeked', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener('playing', this._wrapOnFinishedBuffering, false);
                    this._mediaElement.removeEventListener('error', this._wrapOnError, false);
                    this._mediaElement.removeEventListener('ended', this._wrapOnEndOfMedia, false);
                    this._mediaElement.removeEventListener('waiting', this._wrapOnDeviceBuffering, false);
                    this._mediaElement.removeEventListener('timeupdate', this._wrapOnStatus, false);
                    this._mediaElement.removeEventListener('loadedmetadata', this._wrapOnMetadata, false);
                    this._mediaElement.removeEventListener('pause', this._wrapOnPause, false);
                    this._sourceElement.removeEventListener('error', this._wrapOnSourceError, false);

                    var device = RuntimeContext.getDevice();
                    device.removeElement(this._sourceElement);

                    this._unloadMediaSrc();

                    device.removeElement(this._mediaElement);
                    delete this._mediaElement;
                    delete this._sourceElement;
                }
            },

            _unloadMediaSrc: function _unloadMediaSrc () {
                // Reset source as advised by HTML5 video spec, section 4.8.10.15:
                // http://www.w3.org/TR/2011/WD-html5-20110405/video.html#best-practices-for-authors-using-media-elements
                this._mediaElement.removeAttribute('src');
                this._mediaElement.load();
            },

            /**
             * @protected
             */
            _generateSourceElement: function _generateSourceElement (url, mimeType) {
                var device = RuntimeContext.getDevice();
                var sourceElement = device._createElement('source');
                sourceElement.src = url;
                sourceElement.type = mimeType;
                return sourceElement;
            },

            _reportError: function _reportError (errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._emitEvent(MediaPlayer.EVENT.ERROR, {'errorMessage': errorMessage});
            },

            _toStopped: function _toStopped () {
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
                this._setSentinels([]);
            },

            _toBuffering: function _toBuffering () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
                this._setSentinels([ this._exitBufferingSentinel ]);
            },

            _toPlaying: function _toPlaying () {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
                this._setSentinels([ this._endOfMediaSentinel, this._shouldBeSeekedSentinel, this._enterBufferingSentinel ]);
            },

            _toPaused: function _toPaused () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
                this._setSentinels([ this._shouldBeSeekedSentinel, this._shouldBePausedSentinel ]);
            },

            _toComplete: function _toComplete () {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
                this._setSentinels([]);
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

            _enterBufferingSentinel: function _enterBufferingSentinel () {
                var sentinelShouldFire = !this._hasSentinelTimeChangedWithinTolerance && !this._nearEndOfMedia ;

                if (this.getCurrentTime() === 0) {
                    sentinelShouldFire = this._trustZeroes && sentinelShouldFire;
                }

                if (this._enterBufferingSentinelAttemptCount === undefined) {
                    this._enterBufferingSentinelAttemptCount = 0;
                }

                if(sentinelShouldFire) {
                    this._enterBufferingSentinelAttemptCount++;
                } else {
                    this._enterBufferingSentinelAttemptCount = 0;
                }

                if (this._enterBufferingSentinelAttemptCount === 1) {
                    sentinelShouldFire = false;
                }

                if(sentinelShouldFire) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
                    this._toBuffering();
                    /* Resetting the sentinel attempt count to zero means that the sentinel will only fire once
                     even if multiple iterations result in the same conditions.
                     This should not be needed as the second iteration, when the enter buffering sentinel is fired
                     will cause the media player to go into the buffering state. The enter buffering sentinel is not fired
                     when in buffering state
                     */
                    this._enterBufferingSentinelAttemptCount = 0;
                    return true;
                }

                return false;
            },

            _exitBufferingSentinel: function _exitBufferingSentinel () {
                function fireExitBufferingSentinel(self) {
                    self._emitEvent(MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
                    self._exitBuffering();
                    return true;
                }

                if (this._readyToPlayFrom  && this._mediaElement.paused) {
                    return fireExitBufferingSentinel(this);
                }

                if (this._hasSentinelTimeChangedWithinTolerance) {
                    return fireExitBufferingSentinel(this);
                }
                return false;
            },

            _shouldBeSeekedSentinel: function _shouldBeSeekedSentinel () {
                if (this._sentinelSeekTime === undefined) {
                    return false;
                }

                var self = this;
                var currentTime = this.getCurrentTime();
                var sentinelActionTaken = false;

                if (Math.abs(currentTime - this._sentinelSeekTime) > this._seekSentinelTolerance) {
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.seek, function() {
                        self._mediaElement.currentTime = self._sentinelSeekTime;
                    });
                } else if (this._sentinelIntervalNumber < 3) {
                    this._sentinelSeekTime = currentTime;
                } else {
                    this._sentinelSeekTime = undefined;
                }

                return sentinelActionTaken;
            },

            _shouldBePausedSentinel: function _shouldBePausedSentinel () {
                var sentinelActionTaken = false;
                if (this._hasSentinelTimeChangedWithinTolerance) {
                    var self = this;
                    sentinelActionTaken = this._nextSentinelAttempt(this._sentinelLimits.pause, function() {
                        self._pauseMediaElement();
                    });
                }

                return sentinelActionTaken;
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

            _endOfMediaSentinel: function _endOfMediaSentinel () {
                if (!this._hasSentinelTimeChangedWithinTolerance && this._nearEndOfMedia) {
                    this._emitEvent(MediaPlayer.EVENT.SENTINEL_COMPLETE);
                    this._onEndOfMedia();
                    return true;
                }
                return false;
            },

            _clearSentinels: function _clearSentinels () {
                clearInterval(this._sentinelInterval);
            },

            _setSentinels: function _setSentinels (sentinels) {
                if (this._disableSentinels) {
                    return;
                }

                var self = this;
                this._clearSentinels();
                this._sentinelIntervalNumber = 0;
                this._lastSentinelTime = this.getCurrentTime();
                this._sentinelInterval = setInterval(function() {
                    self._sentinelIntervalNumber += 1;
                    var newTime = self.getCurrentTime();

                    self._hasSentinelTimeChangedWithinTolerance = (Math.abs(newTime - self._lastSentinelTime) > 0.2);
                    self._nearEndOfMedia = (self.getDuration() - (newTime || self._lastSentinelTime)) <= 1;
                    self._lastSentinelTime = newTime;

                    for (var i = 0; i < sentinels.length; i++) {
                        var sentinelActivated = sentinels[i].call(self);

                        if (self.getCurrentTime() > 0) {
                            self._trustZeroes = false;
                        }

                        if(sentinelActivated) {
                            break;
                        }
                    }
                }, 1100);


            },

            _isReadyToPlayFrom: function _isReadyToPlayFrom () {
                if (this._readyToPlayFrom !== undefined) {
                    return this._readyToPlayFrom;
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

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }
);
