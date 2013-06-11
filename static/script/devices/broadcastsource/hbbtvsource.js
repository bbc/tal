/**
 * @fileOverview Requirejs module containing the antie.widgets.hbbtvsource class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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

require.def('antie/devices/broadcastsource/hbbtvsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/application'
    ],
    function (Device, BaseTvSource, Application) {
        /**
         * Contains a HBBTV implementation of the antie broadcast TV source.
         */
        var DOM_ELEMENT_ID = 'broadcastVideoObject';
        var HbbTVSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.HbbTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {
                this._broadcastVideoObject = document.getElementById(DOM_ELEMENT_ID);

                if (!this._broadcastVideoObject) {
                    throw new Error('Unable to initialise HbbTV broadcast source');
                }

                // adding as instance rather then class var as module instantiated via method
                this._playStates = {
                    UNREALIZED: 0,
                    CONNECTING: 1,
                    PRESENTING: 2,
                    STOPPED: 3
                };
            },
            showCurrentChannel: function () {
                // Check if exception is thrown by bindToCurrentChannel?
                this._setBroadcastToFullScreen();
                this._broadcastVideoObject.bindToCurrentChannel();
            },
            stopCurrentChannel: function () {
                try {
                    if (this.getPlayState() === this._playStates.UNREALIZED) {
                        this._broadcastVideoObject.bindToCurrentChannel();
                    }
                } catch(e) {
                    throw Error("Unable to bind to current channel");
                }

                this._broadcastVideoObject.stop();
            },
            getCurrentChannelName: function () {
                var channelConfig = this._broadcastVideoObject.currentChannel;
                // maybe check the hbbtv docs to check return type
                if (channelConfig === null) {
                    throw new Error('Current channel name not available');
                }

                if (channelConfig.name === null) {
                    throw new Error('Current channel name is null');
                }

                if (typeof channelConfig.name === "undefined") {
                    throw new Error('Current channel name is not defined');
                }

                return channelConfig.name;
            },
            setPosition : function(top, left, width, height) {
                this._broadcastVideoObject.style.top = top + "px";
                this._broadcastVideoObject.style.left = left + "px";
                this._broadcastVideoObject.style.width = width + "px";
                this._broadcastVideoObject.style.height = height + "px";
            },
            getPlayState : function() {
                return this._broadcastVideoObject.playState;
            },
            destroy : function() {
                // Not currently required for hbbtv
            },
            /**
             * Sets the size of the broadcast object to be the same as the required screen size identified by antie at
             * application start up.
             */
            _setBroadcastToFullScreen : function() {
                var currentLayout = Application.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            },
            /**
             * Checks that the broadcastVideoObject is in a state that will allow the device to control broadcast.
             */
            _checkBroadcastObjectIsAccessible : function() {
                // Sometimes the broadcastVideoObject methods are undefined if the app is not launched from broadcast
                if (typeof this._broadcastVideoObject.stop === "undefined") {
                    return false;
                }

                // Sometimes the broadcastVideoObject methods are defined but throw an exception if
                // the app is not launched from broadcast (security exception?)
                try {
                    this.stopCurrentChannel();
                } catch(e) {
                    return false;
                }

                return true;
            }
        });

        Device.prototype.isBroadcastSourceSupported = function() {
            var isDeviceSupported = true;

            try {
                var broadcastSource = new HbbTVSource();
                isDeviceSupported = broadcastSource._checkBroadcastObjectIsAccessible();
            } catch (e) {
                isDeviceSupported = false;
            }

            Device.prototype.isBroadcastSourceSupported = function() {
                return isDeviceSupported;
            };

            return isDeviceSupported;
        };

        Device.prototype.createBroadcastSource = function() {
            return new HbbTVSource();
        };

        // Return the HbbTVSource object for unit testing purposes only, HbbTVSource objects should
        // be instantiated using getCurrentApplication().getDevice().createBroadcastSource();
        return HbbTVSource;
    }
);