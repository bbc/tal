/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level none
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
    "antie/devices/mediaplayer/live/unseekable",
    [
        "antie/class",
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function (Class, RuntimeContext, Device, MediaPlayer) {
        "use strict";

        var LivePlayer = Class.extend({
            init: function() {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            },

            beginPlayback: function() {
                this._mediaPlayer.beginPlayback();
            },

            setSource: function(mediaType, sourceUrl, mimeType) {
                this._mediaPlayer.setSource(mediaType, sourceUrl, mimeType);
            },

            stop: function() {
                this._mediaPlayer.stop();
            },

            reset: function() {
                this._mediaPlayer.reset();
            },

            getState: function() {
                this._mediaPlayer.getState();
            },

            getSource: function() {
                this._mediaPlayer.getSource();
            },

            getMimeType: function() {
                this._mediaPlayer.getMimeType();
            },

            addEventCallback: function(callback) {
                this._mediaPlayer.addEventCallback(callback);
            },

            removeEventCallback: function(callback) {
                this._mediaPlayer.removeEventCallback(callback);
            }
        });

        var instance;

        Device.prototype.getLivePlayer = function () {
            if(!instance) {
                instance = new LivePlayer();
            }
            return instance;
        };

        Device.prototype.getLiveSupport = function () {
            return MediaPlayer.LIVE_SUPPORT.UNSEEKABLE;
        };
    }
);