/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Restartable
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/live/restartable',
    [
        'antie/class',
        'antie/runtimecontext',
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function (Class, RuntimeContext, Device, MediaPlayer) {
        'use strict';
        var AUTO_RESUME_WINDOW_START_CUSHION_MILLISECONDS = 8000;

        /**
         * Live player for devices that support restarting while playing live streams, but cannot seek within them.
         * Implements only a subset of functions in the underlying {antie.devices.mediaplayer.MediaPlayer}:
         * - beginPlayback (start playing from the live point, or wherever the device feels like)
         * - setSource, stop, reset, getState, getSource, getMimeType, addEventCallback, removeEventCallback,
         *   removeAllEventCallbacks
         * - beginPlaybackFrom (start playing from an offset)
         * - pause, resume
         * Does NOT implement the following functions:
         * - playFrom, getCurrentTime, getSeekableRange
         * See the documentation on {antie.devices.mediaplayer.MediaPlayer} for API details.
         * @name antie.devices.mediaplayer.live.Restartable
         * @class
         * @extends antie.Class
         */
        var RestartableLivePlayer = Class.extend({
            init: function() {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
                this._millisecondsUntilStartOfWindow = null;
            },

            beginPlayback: function() {
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides && config.streaming.overrides.forceBeginPlaybackToEndOfWindow) {
                    this._mediaPlayer.beginPlaybackFrom(Infinity);
                } else {
                    this._mediaPlayer.beginPlayback();
                }

                this._determineTimeUntilStartOfWindow();
            },

            beginPlaybackFrom: function(offset) {
                this._millisecondsUntilStartOfWindow = offset * 1000;
                this._mediaPlayer.beginPlaybackFrom(offset);
                this._determineTimeSpentBuffering();
            },

            setSource: function(mediaType, sourceUrl, mimeType) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.setSource(mediaType, sourceUrl, mimeType);
            },

            pause: function (opts) {
                this._mediaPlayer.pause();
                opts = opts || {};
                if(opts.disableAutoResume !== true){
                    this._autoResumeAtStartOfRange();
                }
            },

            resume: function () {
                this._mediaPlayer.resume();
            },

            stop: function() {
                this._mediaPlayer.stop();
                this._stopDeterminingTimeUntilStartOfWindow();
                this._stopDeterminingTimeSpentBuffering();
            },

            reset: function() {
                this._mediaPlayer.reset();
            },

            getState: function() {
                return this._mediaPlayer.getState();
            },

            getSource: function() {
                return this._mediaPlayer.getSource();
            },

            getMimeType: function() {
                return this._mediaPlayer.getMimeType();
            },

            addEventCallback: function(thisArg, callback) {
                this._mediaPlayer.addEventCallback(thisArg, callback);
            },

            removeEventCallback: function(thisArg, callback) {
                this._mediaPlayer.removeEventCallback(thisArg, callback);
            },

            removeAllEventCallbacks: function() {
                this._mediaPlayer.removeAllEventCallbacks();
            },

            getPlayerElement: function() {
                return this._mediaPlayer.getPlayerElement();
            },

            _determineTimeUntilStartOfWindow: function () {
                this.addEventCallback(this, this._detectCurrentTimeCallback);
            },

            _stopDeterminingTimeUntilStartOfWindow: function () {
                this.removeEventCallback(this, this._detectCurrentTimeCallback);
            },

            _detectCurrentTimeCallback: function (event) {
                if (event.state === MediaPlayer.STATE.PLAYING && event.currentTime > 0) {
                    this.removeEventCallback(this, this._detectCurrentTimeCallback);
                    this._millisecondsUntilStartOfWindow = event.currentTime * 1000;
                    this._determineTimeSpentBuffering();
                }
            },

            _autoResumeAtStartOfRange: function () {
                var self = this;
                if (this._millisecondsUntilStartOfWindow !== null) {
                    var resumeTimeOut = Math.max(0, this._millisecondsUntilStartOfWindow - AUTO_RESUME_WINDOW_START_CUSHION_MILLISECONDS);
                    var pauseStarted = new Date().getTime();
                    var autoResumeTimer = setTimeout(function () {
                        self.removeEventCallback(self, detectIfUnpaused);
                        self._millisecondsUntilStartOfWindow = 0;
                        self.resume();
                    }, resumeTimeOut);

                    this.addEventCallback(this, detectIfUnpaused);
                }

                function detectIfUnpaused(event) {
                    if (event.state !== MediaPlayer.STATE.PAUSED) {
                        self.removeEventCallback(self, detectIfUnpaused);
                        clearTimeout(autoResumeTimer);
                        var timePaused = new Date().getTime() - pauseStarted;
                        self._millisecondsUntilStartOfWindow -= timePaused;
                    }
                }
            },

            _determineTimeSpentBuffering: function () {
                this._bufferingStarted = null;
                this.addEventCallback(this, this._determineBufferingCallback);
            },

            _stopDeterminingTimeSpentBuffering: function () {
                this.removeEventCallback(this, this._determineBufferingCallback);
            },

            _determineBufferingCallback: function (event) {
                if (event.state === MediaPlayer.STATE.BUFFERING && this._bufferingStarted === null) {
                    this._bufferingStarted = new Date().getTime();
                } else if (event.state !== MediaPlayer.STATE.BUFFERING && this._bufferingStarted !== null) {
                    var timeBuffering = new Date().getTime() - this._bufferingStarted;
                    this._millisecondsUntilStartOfWindow = Math.max(0, this._millisecondsUntilStartOfWindow - timeBuffering);
                    this._bufferingStarted = null;
                }
            }
        });

        var instance;

        Device.prototype.getLivePlayer = function () {
            if(!instance) {
                instance = new RestartableLivePlayer();
            }
            return instance;
        };

        Device.prototype.getLiveSupport = function () {
            return MediaPlayer.LIVE_SUPPORT.RESTARTABLE;
        };

        return RestartableLivePlayer;
    }
);
