/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Seekable
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/live/seekable',
    [
        'antie/class',
        'antie/runtimecontext',
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function (Class, RuntimeContext, Device, MediaPlayer) {
        'use strict';
        var AUTO_RESUME_WINDOW_START_CUSHION_SECONDS = 8;

        /**
         * Live player for devices that have full support for playing and seeking live streams.
         * Implements all functions of the underlying {antie.devices.mediaplayer.MediaPlayer}.
         * See the documentation for that class for API details.
         * @name antie.devices.mediaplayer.live.Seekable
         * @class
         * @extends antie.Class
         */
        var SeekableLivePlayer = Class.extend({
            init: function () {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            },

            setSource: function (mediaType, sourceUrl, mimeType) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.setSource(mediaType, sourceUrl, mimeType);
            },

            beginPlayback: function () {
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides && config.streaming.overrides.forceBeginPlaybackToEndOfWindow) {
                    this._mediaPlayer.beginPlaybackFrom(Infinity);
                } else {
                    this._mediaPlayer.beginPlayback();
                }
            },

            beginPlaybackFrom: function (offset) {
                this._mediaPlayer.beginPlaybackFrom(offset);
            },

            playFrom: function (offset) {
                this._mediaPlayer.playFrom(offset);
            },

            pause: function (opts) {
                opts = opts || {};
                var secondsUntilStartOfWindow = this._mediaPlayer.getCurrentTime() - this._mediaPlayer.getSeekableRange().start;

                if (opts.disableAutoResume) {
                    this._mediaPlayer.pause();
                } else if (secondsUntilStartOfWindow <= AUTO_RESUME_WINDOW_START_CUSHION_SECONDS) {
                    // IPLAYERTVV1-4166
                    // We can't pause so close to the start of the sliding window, so do a quick state transition in and
                    // out on 'pause' state to be consistent with the rest of TAL.
                    this._mediaPlayer._toPaused();
                    this._mediaPlayer._toPlaying();
                } else {
                    this._mediaPlayer.pause();
                    this._autoResumeAtStartOfRange();
                }
            },
            resume: function () {
                this._mediaPlayer.resume();
            },

            stop: function () {
                this._mediaPlayer.stop();
            },

            reset: function () {
                this._mediaPlayer.reset();
            },

            getState: function () {
                return this._mediaPlayer.getState();
            },

            getSource: function () {
                return this._mediaPlayer.getSource();
            },

            getCurrentTime: function () {
                return this._mediaPlayer.getCurrentTime();
            },

            getSeekableRange: function () {
                return this._mediaPlayer.getSeekableRange();
            },

            getMimeType: function () {
                return this._mediaPlayer.getMimeType();
            },

            addEventCallback: function (thisArg, callback) {
                this._mediaPlayer.addEventCallback(thisArg, callback);
            },

            removeEventCallback: function (thisArg, callback) {
                this._mediaPlayer.removeEventCallback(thisArg, callback);
            },

            removeAllEventCallbacks: function () {
                this._mediaPlayer.removeAllEventCallbacks();
            },

            getPlayerElement: function () {
                return this._mediaPlayer.getPlayerElement();
            },

            _autoResumeAtStartOfRange: function () {
                var self = this;
                var secondsUntilAutoResume = Math.max(0, this._mediaPlayer.getCurrentTime() - this._mediaPlayer.getSeekableRange().start - AUTO_RESUME_WINDOW_START_CUSHION_SECONDS);

                var autoResumeTimer = setTimeout(function () {
                    self.removeEventCallback(self, detectIfUnpaused);
                    self.resume();
                }, secondsUntilAutoResume * 1000);

                this.addEventCallback(this, detectIfUnpaused);
                function detectIfUnpaused(event) {
                    if (event.state !== MediaPlayer.STATE.PAUSED) {
                        self.removeEventCallback(self, detectIfUnpaused);
                        clearTimeout(autoResumeTimer);
                    }
                }
            }
        });

        var instance;

        Device.prototype.getLivePlayer = function () {
            if (!instance) {
                instance = new SeekableLivePlayer();
            }
            return instance;
        };

        Device.prototype.getLiveSupport = function () {
            return MediaPlayer.LIVE_SUPPORT.SEEKABLE;
        };
    }
);
