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
        var ID_DVB_T = 12;
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
                this._broadcastVideoObject.style.display = "block";
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
                this._broadcastVideoObject.style.display = "none";
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
            setChannel : function(params) {
                var self = this;
                var channelType = this._getChannelType();
                var newChannel = this._broadcastVideoObject.createChannelObject(channelType, params.onid, params.tsid, params.sid);
                if (newChannel === null) {
                    params.onError({
                        name : "Error",
                        message : "Channel could not be found"
                    });
                    return;
                }

                var successEventListener = function(channel) {
                    self._broadcastVideoObject.removeEventListener("ChannelChangeSucceeded", successEventListener);
                    self._broadcastVideoObject.removeEventListener("ChannelChangeError", errorEventListener);
                    params.onSuccess();
                };

                var errorEventListener = function(channel, errorState) {
                    self._broadcastVideoObject.removeEventListener("ChannelChangeSucceeded", successEventListener);
                    self._broadcastVideoObject.removeEventListener("ChannelChangeError", errorEventListener);
                    params.onError();
                };

                this._broadcastVideoObject.addEventListener("ChannelChangeSucceeded", successEventListener);
                this._broadcastVideoObject.addEventListener("ChannelChangeError", errorEventListener);

                this._broadcastVideoObject.setChannel(newChannel);
            },
            /**
             * @Returns The type of identification for the channel, as indicated by one of the ID_* constants in the
             * HBBTV specification
             */
            _getChannelType : function() {
                var channelType = this._broadcastVideoObject.currentChannel.idType;
                if (typeof channelType === "undefined") {
                    channelType = ID_DVB_T;
                }
                return channelType;
            },
            /**
             * Sets the size of the broadcast object to be the same as the required screen size identified by antie at
             * application start up.
             */
            _setBroadcastToFullScreen : function() {
                var currentLayout = Application.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            }
        });

        Device.prototype.isBroadcastSourceSupported = function() {
            return this.getHistorian().hasBroadcastOrigin();
        };

        Device.prototype.createBroadcastSource = function() {
            return new HbbTVSource();
        };
    }
);