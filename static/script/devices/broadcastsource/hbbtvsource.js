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
        'antie/application',
        'antie/devices/broadcastsource/channel'
    ],
    function (Device, BaseTvSource, Application, Channel) {
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
            getChannelList : function (params) {
                try {
                    var result = this._getChannelList();
                    params.onSuccess(result);

                } catch (e) {
                    params.onError(e.message);
                }
            },
            getCurrentChannel : function () {
                var result = false;

                var currentChannel = this._broadcastVideoObject.currentChannel;

                if (currentChannel) {
                    result = new Channel({
                        name : currentChannel.name,
                        type: currentChannel.channelType,
                        onid: currentChannel.onid,
                        tsid: currentChannel.tsid,
                        sid: currentChannel.sid
                    });
                }

                return result;
            },
            setChannelByName : function(params) {

                var currentChannel = this.getCurrentChannel();

                if (!currentChannel) {
                    params.onError("Unable to determine current channel name.");

                } else if (params.channelName === currentChannel.name) {
                    this.showCurrentChannel();
                    params.onSuccess();

                } else {

                    try {

                        var self = this;

                        var channelList = this._getChannelList();

                        var channel = undefined;

                        for (var i = 0; i < channelList.length; i++) {
                            if (channelList[i].name === params.channelName) {
                                channel = channelList[i];
                                break;
                            }
                        }

                        if (!channel) {
                            throw {message: params.channelName + " not found in channel list"};
                        }

                        var channelObj = this._broadcastVideoObject.createChannelObject(channel.type, channel.onid, channel.tsid, channel.sid);

                        if (!channelObj) {
                            throw {message: "Channel could not be tuned"};
                        }

                        var setChannelError = function () {
                            self._broadcastVideoObject.removeEventListener('ChannelChangeError', setChannelError);
                            self._broadcastVideoObject.removeEventListener('ChannelChangeSucceeded', setChannelSuccess);
                            params.onError("Error tuning channel");
                        }


                        var setChannelSuccess = function () {
                            self._broadcastVideoObject.removeEventListener('ChannelChangeError', setChannelError);
                            self._broadcastVideoObject.removeEventListener('ChannelChangeSucceeded', setChannelSuccess);
                            params.onSuccess();
                        }

                        this._broadcastVideoObject.addEventListener('ChannelChangeError', setChannelError);
                        this._broadcastVideoObject.addEventListener('ChannelChangeSucceeded', setChannelSuccess);

                        this._broadcastVideoObject.setChannel(channelObj);

                    } catch(e) {
                        params.onError(e.message);
                    }
                }
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
                var channelType;

                // TODO: Clean this up
                // Attempt to get the channel type of the current channel
                // If this is not available, fall back to ID_DVB_T
                try {
                    channelType = this._getChannelType();
                } catch(e) {
                    channelType = ID_DVB_T;
                }
                var newChannel = this._broadcastVideoObject.createChannelObject(channelType, params.onid, params.tsid, params.sid);
                if (newChannel === null) {
                    params.onError({
                        name : "ChannelError",
                        message : "Channel could not be found"
                    });
                    return;
                }

                // Test the that the device can access the channelList, this will be required in the future
                try {
                    var channelConfig = this._broadcastVideoObject.getChannelConfig();
                    var channelList = channelConfig.channelList;
                    var channelListCount = channelList.length;
                } catch(e) {
                    params.onError({
                        name : "ChannelListError",
                        message : "Channel list is not available"
                    });
                }

                if (!channelListCount || channelListCount < 0) {
                    params.onError({
                        name : "ChannelListError",
                        message : "Channel list is empty or not available"
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
                    params.onError({
                        name : "ChangeChannelError",
                        message : "Error tuning channel"
                    });
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
            },
            _getChannelList : function() {
                var channelConfig = this._broadcastVideoObject.getChannelConfig();

                if (!channelConfig.channelList) {
                    throw {message: "Unable to retrieve channel list"};
                }

                if (channelConfig.channelList.length === 0) {
                    throw {message: "Channel list contains no channels"};
                }

                var result = [];
                for (var i = 0; i < channelConfig.channelList.length; i++) {
                    var channel = channelConfig.channelList[i]
                    result.push(new Channel(
                        {
                            name: channel.name,
                            type: channel.channelType,
                            onid: channel.onid,
                            sid: channel.sid,
                            tsid: channel.tsid
                        }
                    ));
                }
                return result;
            }
        });

        Device.prototype.isBroadcastSourceSupported = function() {
            return this.getHistorian().hasBroadcastOrigin();
        };

        /**
         * Create a broadcastSource object on the Device to be
         * accessed as a singleton to avoid the init being run
         * multiple times
         */
        Device.prototype.createBroadcastSource = function() {
            if (!this._broadcastSource) {
                this._broadcastSource = new HbbTVSource();
            }

            return this._broadcastSource;
        };

        // Return the HbbtvSource object for testing purposes
        return HbbTVSource;
    }
);