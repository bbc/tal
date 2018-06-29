/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Seekable
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
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
            init: function init () {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            },

            initialiseMedia: function initialiseMedia (mediaType, sourceUrl, mimeType, sourceContainer, opts) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.initialiseMedia(mediaType, sourceUrl, mimeType, sourceContainer, opts);
            },

            beginPlayback: function beginPlayback () {
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides && config.streaming.overrides.forceBeginPlaybackToEndOfWindow) {
                    this._mediaPlayer.beginPlaybackFrom(Infinity);
                } else {
                    this._mediaPlayer.beginPlayback();
                }
            },

            beginPlaybackFrom: function beginPlaybackFrom (offset) {
                this._mediaPlayer.beginPlaybackFrom(offset);
            },

            playFrom: function playFrom (offset) {
                this._mediaPlayer.playFrom(offset);
            },

            pause: function pause (opts) {
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
            resume: function resume () {
                this._mediaPlayer.resume();
            },

            stop: function stop () {
                this._mediaPlayer.stop();
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

            getCurrentTime: function getCurrentTime () {
                return this._mediaPlayer.getCurrentTime();
            },

            getSeekableRange: function getSeekableRange () {
                return this._mediaPlayer.getSeekableRange();
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

            _autoResumeAtStartOfRange: function _autoResumeAtStartOfRange () {
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
