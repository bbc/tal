/**
 * @fileOverview Requirejs module containing device modifier for media playback
 * where devices show some playback before seeking. Fires a SEEK_ATTEMPTED event,
 * checks that we have had 5 status events where the time behaves as expected,
 * waits for an optional timeout and then fires a SEEK_FINISHED event to give
 * extra security that have seeked correctly.
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
    "antie/devices/mediaplayer/seekfinishedemitevent",
    ["antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext"],
    function (MediaPlayer, RuntimeContext) {
        "use strict";

        return function (OverrideClass) {
            var oldSetSource = OverrideClass.prototype.setSource;
            OverrideClass.prototype.setSource = function (mediaType, url, mimeType) {
                this._count = 0;
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_ATTEMPTED);
                    this._seekFinished = false;
                }

                var restartTimeout = RuntimeContext.getDevice().getConfig().restartTimeout;

                var self = this;
                this._timeoutHappened = false;
                if (restartTimeout) {
                    setTimeout(function () {
                        self._timeoutHappened = true;
                    }, restartTimeout);
                } else {
                    this._timeoutHappened = true;
                }
                oldSetSource.call(this, mediaType, url, mimeType);
            };

            var oldOnStatus = OverrideClass.prototype._onStatus;
            OverrideClass.prototype._onStatus = function (evt) {
                oldOnStatus.call(this, evt);

                var isAtCorrectStartingPoint = Math.abs(this.getCurrentTime() - this._sentinelSeekTime) <= this._seekSentinelTolerance;


                if(this._sentinelSeekTime === undefined){
                    isAtCorrectStartingPoint = true;
                }

                var isPlayingAtCorrectTime = this.getState() === MediaPlayer.STATE.PLAYING && isAtCorrectStartingPoint;

                if (isPlayingAtCorrectTime && this._count >= 5 && this._timeoutHappened && !this._seekFinished) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_FINISHED);
                    this._seekFinished = true;
                } else if (isPlayingAtCorrectTime) {
                    this._count++;
                } else {
                    this._count = 0;
                }

            };
        }
    }
);
