/**
 * @fileOverview Requirejs module containing device modifier to launch HTML5 media player,
 * including a fix for devices that emit an error event when media playback completes.
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
    "antie/devices/mediaplayer/cehtmlplaybeforeseekwhenplayfrompaused",
    [
        "antie/devices/mediaplayer/cehtml",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/devices/device"
    ],
    function(CEHTMLMediaPlayer, MediaPlayer, Device) {
        "use strict";

        var Player = CEHTMLMediaPlayer.extend({
            /**
             * @inheritDoc
             */
            playFrom: function (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                        this._deferSeekingTo = seconds;
                        break;

                    case MediaPlayer.STATE.STOPPED:
                        this._toBuffering();
                        // Seeking past 0 requires calling play first when media has not been loaded
                        this._mediaElement.play(1);
                        if (seconds > 0) {
                            this._mediaElement.seek(seconds * 1000);
                        }
                        break;

                    case MediaPlayer.STATE.COMPLETE:
                        this._toBuffering();
                        this._mediaElement.stop();
                        this._mediaElement.play(1);
                        if (seconds > 0) {
                            this._mediaElement.seek(this._getClampedTime(seconds) * 1000);
                        }
                        break;

                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                        this._toBuffering();
                        this._mediaElement.play(1);
                        var seekResult = this._mediaElement.seek(this._getClampedTime(seconds) * 1000);
                        if(seekResult === false) {
                            this._toPlaying();
                        }
                        break;

                    default:
                        this._toError("Cannot playFrom while in the '" + this.getState() + "' state");
                        break;
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