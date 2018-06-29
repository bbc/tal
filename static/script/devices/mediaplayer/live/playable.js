/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Playable
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/live/playable',
    [
        'antie/class',
        'antie/runtimecontext',
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function (Class, RuntimeContext, Device, MediaPlayer) {
        'use strict';

        /**
         * Live player for devices that support playing live streams, but cannot seek within them.
         * Implements only a subset of functions in the underlying {antie.devices.mediaplayer.MediaPlayer}:
         * - beginPlayback (start playing from the live point, or wherever the device feels like)
         * - initialiseMedia, stop, reset, getState, getSource, getMimeType, addEventCallback, removeEventCallback,
         *   removeAllEventCallbacks
         * Does NOT implement the following functions:
         * - playFrom, pause, resume, getCurrentTime, getSeekableRange
         * See the documentation on {antie.devices.mediaplayer.MediaPlayer} for API details.
         * @name antie.devices.mediaplayer.live.Playable
         * @class
         * @extends antie.Class
         */
        var PlayableLivePlayer = Class.extend({
            init: function init () {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            },

            beginPlayback: function beginPlayback () {
                this._mediaPlayer.beginPlayback();
            },

            initialiseMedia: function initialiseMedia (mediaType, sourceUrl, mimeType, sourceContainer, opts) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.initialiseMedia(mediaType, sourceUrl, mimeType, sourceContainer, opts);
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
            }
        });

        var instance;

        Device.prototype.getLivePlayer = function () {
            if(!instance) {
                instance = new PlayableLivePlayer();
            }
            return instance;
        };

        Device.prototype.getLiveSupport = function () {
            return MediaPlayer.LIVE_SUPPORT.PLAYABLE;
        };
    }
);
