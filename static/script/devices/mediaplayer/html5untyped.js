/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media
 * playback without MIME type in source element
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
    "antie/devices/mediaplayer/html5untyped",
    [
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/html5"
    ],
    function(RuntimeContext, Device, HTML5MediaPlayer) {
        "use strict";

        /**
         * Main MediaPlayer implementation for HTML5 devices specifies a 'type'
         * attribute in the source element.          
         * This device modifier implements a new version of the function to
         * generate the source element without setting a type attribute.
         * @name antie.devices.mediaplayer.HTML5Untyped
         * @class
         * @extends antie.devices.mediaplayer.HTML5
         */
        var Player = HTML5MediaPlayer.extend( /** @lends antie.devices.mediaplayer.HTML5Untyped.prototype */ {
            init: function() {
               this._super();
            },

            _generateSourceElement: function(url) {
                var device = RuntimeContext.getDevice();
                var sourceElement = device._createElement('source');
                sourceElement.src = url;
                return sourceElement;
            }
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that
        // device.getMediaPlayer() returns the correct implementation for the
        // device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }
);
