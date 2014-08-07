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
                this._state = MediaPlayer.STATE.EMPTY;
                this._wipe();
            },


            /**
            * @inheritDoc
            */
            setSource: function (mediaType, url, mimeType) {
                this._type = mediaType;
                this._source = url;
                this._mimeType = mimeType;
                this._toStopped();
            },

            /**
            * @inheritDoc
            */
            play : function () {
                this._toError();
            },

            /**
            * @inheritDoc
            */
            playFrom: function (time) {
                this._toError();
            },

            /**
            * @inheritDoc
            */
            pause: function () {
                this._toError();
            },

            /**
            * @inheritDoc
            */
            stop: function () {
                this._toError();
            },

            /**
            * @inheritDoc
            */
            reset: function () {
                this._toError();
            },

            /**
            * @inheritDoc
            */
            getSource: function () {
                return this._source;
            },

            /**
            * @inheritDoc
            */
            getMimeType: function () {
                return this._mimeType;
            },

            /**
            * @inheritDoc
            */
            getCurrentTime: function () {
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getRange: function () {
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getState: function () {
                return this._state;
            },

            _wipe: function () {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
            },

            _toStopped: function () {
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toError: function () {
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._emitEvent(MediaPlayer.EVENT.ERROR);
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
