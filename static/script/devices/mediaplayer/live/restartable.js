/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level Restartable
 *
 * @preserve Copyright (c) 2015 British Broadcasting Corporation
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
    "antie/devices/mediaplayer/live/restartable",
    [
        "antie/class",
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function (Class, RuntimeContext, Device, MediaPlayer) {
        "use strict";

        /**
         * Live player for devices that support restarting while playing live streams, but cannot seek within them.
         * Implements only a subset of functions in the underlying {antie.devices.mediaplayer.MediaPlayer}:
         * - beginPlayback (start playing from the live point, or wherever the device feels like)
         * - setSource, stop, reset, getState, getSource, getMimeType, addEventCallback, removeEventCallback,
         *   removeAllEventCallbacks
         * - beginPlaybackFrom (start playing from an offset)
         * Does NOT implement the following functions:
         * - playFrom, pause, resume, getCurrentTime, getSeekableRange
         * See the documentation on {antie.devices.mediaplayer.MediaPlayer} for API details.
         * @name antie.devices.mediaplayer.live.Restartable
         * @class
         * @extends antie.Class
         */
        var RestartableLivePlayer = Class.extend({
            init: function() {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            },

            beginPlayback: function() {
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides && config.streaming.overrides.forceBeginPlaybackToEndOfWindow) {
                    this._mediaPlayer.beginPlaybackFrom(Infinity);
                } else {
                    this._mediaPlayer.beginPlayback();
                }
            },

            beginPlaybackFrom: function(offset) {
                this._mediaPlayer.beginPlaybackFrom(offset);
            },

            setSource: function(mediaType, sourceUrl, mimeType) {
                if (mediaType === MediaPlayer.TYPE.AUDIO) {
                    mediaType = MediaPlayer.TYPE.LIVE_AUDIO;
                } else {
                    mediaType = MediaPlayer.TYPE.LIVE_VIDEO;
                }

                this._mediaPlayer.setSource(mediaType, sourceUrl, mimeType);
            },

            stop: function() {
                this._mediaPlayer.stop();
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