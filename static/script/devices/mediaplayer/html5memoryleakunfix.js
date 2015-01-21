/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media playback
 * on devices where clearing src on teardown causes problems.
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
    "antie/devices/mediaplayer/html5memoryleakunfix",
    [
        "antie/devices/mediaplayer/html5",
        "antie/devices/device"
    ],
    function(HTML5MediaPlayer, Device) {
        "use strict";

        /**
         * Main MediaPlayer implementation for HTML5 devices where unsetting src during teardown
         * causes problems.
         * Use this device modifier if a device implements the HTML5 media playback standard but
         * crashes or becomes unresponsive on teardown.
         * It must support creation of &lt;video&gt; and &lt;audio&gt; elements, and those objects must expose an
         * API in accordance with the HTML5 media specification.
         * @name antie.devices.mediaplayer.HTML5MemoryLeakUnfix
         * @class
         * @extends antie.devices.mediaplayer.HTML5
         */
        var Player = HTML5MediaPlayer.extend( /** @lends antie.devices.mediaplayer.HTML5MemoryLeakUnfix.prototype */ {
            init: function() {
                this._super();
            },

            _unloadMediaSrc: function() {
                // Do nothing for this sub-modifier.
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
