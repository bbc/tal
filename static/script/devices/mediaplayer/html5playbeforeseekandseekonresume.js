/**
 * @fileOverview Requirejs module containing device modifier to launch HTML5 media player,
 * including a fix for devices that need seek to be called before seeking and also need to call _seekTo (which sets the
 * current time) on resume.
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
    "antie/devices/mediaplayer/html5playbeforeseekandseekonresume",
    [
        "antie/devices/mediaplayer/html5",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function(HTML5MediaPlayer, Device, MediaPlayer) {
        "use strict";

        /**
         * MediaPlayer implementation for HTML5 devices that have particular issues when seeking.
         * There are two conditions that must be satisfied for a device to require this modifier:
         * 1. If the device cannot reliably seek unless play has previously been called. For example,
         * when beginning playback for the first time, starting in the middle of the media, but the
         * device begins playback from the start of the media instead.
         * 2. If the device cannot reliably resume playback after being paused unless it is asked to seek
         * first. For example, if you ask the device to begin playback from the middle of the media but
         * to start paused, and then you resume playback, but the device fails to resume.
         * @name antie.devices.mediaplayer.html5playbeforeseekandseekonresume
         * @class
         * @extends antie.devices.mediaplayer.html5
         */
        var Player = HTML5MediaPlayer.extend({
            resume : function() {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                if(this.getState() === MediaPlayer.STATE.PAUSED) {
                    this._seekTo(this.getCurrentTime());
                    this._toPlaying();
                } else {
                    this._super();
                }
            },
            _seekTo : function(seconds) {
                this._mediaElement.play();
                this._super(seconds);
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
