/**
 * @fileOverview Requirejs module containing device modifier to launch HTML5 media player including fix for players that dont send buffering events correctly.
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
    "antie/devices/mediaplayer/html5waitingfix",
    [
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/devices/mediaplayer/html5"
    ],
    function(RuntimeContext, Device, MediaPlayer, HTML5MediaPlayer) {
        "use strict";

        var Player = HTML5MediaPlayer.extend({
            
            init: function() {
                this._super();
                this._waitingTimer = null;
            },

            _onStatus: function() {
                this._super();
                this._clearWaitingTimer();
                this._setWaitingTimer();
            },

            _clearWaitingTimer: function() {
                if(this._waitingTimer) {
                    window.clearTimeout(this._waitingTimer);
                }
            },

            _setWaitingTimer: function() {
                var self = this;
                this._waitingTimer = window.setTimeout(function() {
                    self._onDeviceBuffering();
                }, 500);
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
