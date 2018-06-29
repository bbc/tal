/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Restartable
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
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
         * - initialiseMedia, stop, reset, getState, getSource, getMimeType, addEventCallback, removeEventCallback,
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
            init: function init () {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
                this._millisecondsUntilStartOfWindow = null;
            },

            beginPlayback: function beginPlayback () {
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides && config.streaming.overrides.forceBeginPlaybackToEndOfWindow) {
                    this._mediaPlayer.beginPlaybackFrom(Infinity);
                } else {
                    this._mediaPlayer.beginPlayback();
                }

                this._determineTimeUntilStartOfWindow();
            },

            beginPlaybackFrom: function beginPlaybackFrom (offset) {
                this._millisecondsUntilStartOfWindow = offset * 1000;
                this._mediaPlayer.beginPlaybackFrom(offset);
                this._determineTimeSpentBuffering();
            },

            initialiseMedia: function initialiseMedia (mediaType, sourceUrl, mimeType, sourceContainer, opts) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.initialiseMedia(mediaType, sourceUrl, mimeType, sourceContainer, opts);
            },

            pause: function pause (opts) {
                this._mediaPlayer.pause();
                opts = opts || {};
                if(opts.disableAutoResume !== true){
                    this._autoResumeAtStartOfRange();
                }
            },

            resume: function resume () {
                this._mediaPlayer.resume();
            },

            stop: function stop () {
                this._mediaPlayer.stop();
                this._stopDeterminingTimeUntilStartOfWindow();
                this._stopDeterminingTimeSpentBuffering();
            },

            reset: function reset () {
                this._mediaPlayer.reset();
            },

            getState: function getState () {
                return this._mediaPlayer.getState();
            },

            getSource: function getSource () {
                return this._mediaPlayer.getSource();
            },

            getMimeType: function getMimeType () {
                return this._mediaPlayer.getMimeType();
            },

            addEventCallback: function addEventCallback (thisArg, callback) {
                this._mediaPlayer.addEventCallback(thisArg, callback);
            },

            removeEventCallback: function removeEventCallback (thisArg, callback) {
                this._mediaPlayer.removeEventCallback(thisArg, callback);
            },

            removeAllEventCallbacks: function removeAllEventCallbacks () {
                this._mediaPlayer.removeAllEventCallbacks();
            },

            getPlayerElement: function getPlayerElement () {
                return this._mediaPlayer.getPlayerElement();
            },

            _determineTimeUntilStartOfWindow: function _determineTimeUntilStartOfWindow () {
                this.addEventCallback(this, this._detectCurrentTimeCallback);
            },

            _stopDeterminingTimeUntilStartOfWindow: function _stopDeterminingTimeUntilStartOfWindow () {
                this.removeEventCallback(this, this._detectCurrentTimeCallback);
            },

            _detectCurrentTimeCallback: function _detectCurrentTimeCallback (event) {
                if (event.state === MediaPlayer.STATE.PLAYING && event.currentTime > 0) {
                    this.removeEventCallback(this, this._detectCurrentTimeCallback);
                    this._millisecondsUntilStartOfWindow = event.currentTime * 1000;
                    this._determineTimeSpentBuffering();
                }
            },

            _autoResumeAtStartOfRange: function _autoResumeAtStartOfRange () {
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

            _determineTimeSpentBuffering: function _determineTimeSpentBuffering () {
                this._bufferingStarted = null;
                this.addEventCallback(this, this._determineBufferingCallback);
            },

            _stopDeterminingTimeSpentBuffering: function _stopDeterminingTimeSpentBuffering () {
                this.removeEventCallback(this, this._determineBufferingCallback);
            },

            _determineBufferingCallback: function _determineBufferingCallback (event) {
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
