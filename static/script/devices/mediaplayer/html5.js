/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
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
    "antie/devices/mediaplayer/html5",
    [
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function(Device, MediaPlayer) {
        "use strict";

        var Player = MediaPlayer.extend({

            init: function() {
                this._super();
            }


// TODO:
//            /**
//             * @inheritDoc
//             */
//            setSource: function (mediaType, url, mimeType) {
//                throw new Error("setSource method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            play : function () {
//                throw new Error("play method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            playFrom: function (time) {
//                throw new Error("playFrom method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            pause: function () {
//                throw new Error("pause method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            stop: function () {
//                throw new Error("stop method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            reset: function () {
//                throw new Error("reset method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            getSource: function () {
//                throw new Error("getSource method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            getMimeType: function () {
//                throw new Error("getMimeType method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            getCurrentTime: function () {
//                throw new Error("getCurrentTime method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            getRange: function () {
//                throw new Error("getRange method has not been implemented");
//            },

// TODO:
//            /**
//             * @inheritDoc
//             */
//            getState: function () {
//                throw new Error("getState method has not been implemented");
//            }
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

);
