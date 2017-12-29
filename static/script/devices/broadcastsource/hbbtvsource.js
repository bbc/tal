/**
 * @fileOverview Requirejs module containing base antie.devices.broadcastsource.hbbtvsource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/broadcastsource/hbbtvsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/runtimecontext',
        'antie/events/tunerunavailableevent',
        'antie/events/tunerpresentingevent',
        'antie/events/tunerstoppedevent'
    ],
    function (Device, BaseTvSource, RuntimeContext, TunerUnavailableEvent, TunerPresentingEvent, TunerStoppedEvent ) {
        'use strict';

        /**
         * Contains a HBBTV implementation of the antie broadcast TV source.
         * @class
         * @name antie.devices.broadcastsource.HbbTVSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */
        var DOM_ELEMENT_ID = 'broadcastVideoObject';
        var ID_DVB_T = 12;
        var HbbTVSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.HbbTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {

                var self = this;
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

                this.playState = this._playStates.UNREALIZED;

                this._broadcastVideoObject.addEventListener('PlayStateChange', function() {

                    var oldPlayState = self.playState;
                    // Note! The play state may change during the execution of this method; capture it so we
                    // have a consistent value for the duration of the event listener.
                    // See OIPF DAE specification section 7.14.9
                    var newPlayState = self._broadcastVideoObject.playState;

                    if (oldPlayState === self._playStates.PRESENTING && newPlayState === self._playStates.UNREALIZED) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerUnavailableEvent());

                    } else if (newPlayState === self._playStates.PRESENTING) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerPresentingEvent(self.getCurrentChannelName()));

                    } else if (newPlayState === self._playStates.STOPPED) {
                        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerStoppedEvent());
                    }

                    self.playState = newPlayState;

                });
            },
            showCurrentChannel: function showCurrentChannel () {
                this._broadcastVideoObject.bindToCurrentChannel();
                this._setBroadcastVisible();
            },
            _setBroadcastVisible: function _setBroadcastVisible () {
                this._setBroadcastToFullScreen();
                this._broadcastVideoObject.style.visibility = 'visible';
            },
            stopCurrentChannel: function stopCurrentChannel () {
                try {
                    if (this._broadcastVideoObject.playState === this._playStates.UNREALIZED) {
                        this._broadcastVideoObject.bindToCurrentChannel();
                    }
                } catch(e) {
                    throw new Error('Unable to bind to current channel');
                }

                this._broadcastVideoObject.stop();
                this._broadcastVideoObject.style.visibility = 'hidden';
                this.setPosition(0, 0, 0, 0);
            },
            getCurrentChannelName: function getCurrentChannelName () {
                var channelConfig = this._broadcastVideoObject.currentChannel;
                // maybe check the hbbtv docs to check return type
                if (channelConfig === null) {
                    throw new Error('Current channel name not available');
                }

                if (channelConfig.name === null) {
                    throw new Error('Current channel name is null');
                }

                if (typeof channelConfig.name === 'undefined') {
                    throw new Error('Current channel name is not defined');
                }

                return channelConfig.name;
            },
            getChannelNameList : function (params) {
                try {
                    var channelList = this._getChannelList();
                    var result = [];
                    for (var i = 0; i < channelList.length; i++) {
                        var channel = this._getChannelFromChannelList(channelList, i);
                        result.push(channel.name);
                    }
                    params.onSuccess(result);
                } catch (e) {
                    params.onError(e);
                }
            },

            setChannelByName : function(params) {
                try {
                    var currentChannelName = this.getCurrentChannelName();
                    if (params.channelName === currentChannelName) {
                        this.showCurrentChannel();
                        params.onSuccess();
                    } else {
                        this._setChannelByName(params);
                    }
                } catch(error) {
                    params.onError({
                        name : 'ChannelError',
                        message: 'Unable to determine current channel name'
                    });
                }
            },

            _setChannelByName: function _setChannelByName (params) {
                try {
                    var channelList = this._getChannelList();
                    var channel;

                    for (var i = 0; i < channelList.length; i++) {
                        var channelEntry = this._getChannelFromChannelList(channelList, i);
                        if (channelEntry.name === params.channelName) {
                            channel = channelEntry;
                            break;
                        }
                    }

                    if (!channel) {
                        throw {
                            name : 'ChannelError',
                            message: params.channelName + ' not found in channel list'
                        };
                    }

                    this._tuneToChannelObject(channel, params.onSuccess, params.onError);
                } catch(e) {
                    params.onError(e);
                }
            },
            setPosition : function(top, left, width, height) {
                this._broadcastVideoObject.style.top = top + 'px';
                this._broadcastVideoObject.style.left = left + 'px';
                this._broadcastVideoObject.style.width = width + 'px';
                this._broadcastVideoObject.style.height = height + 'px';
            },
            getState : function() {
                var state = BaseTvSource.STATE.UNKNOWN;
                var playState = this._broadcastVideoObject.playState;
                if (playState === this._playStates.UNREALIZED){
                    state = BaseTvSource.STATE.UNAVAILABLE;
                } else if (playState === this._playStates.CONNECTING){
                    state = BaseTvSource.STATE.CONNECTING;
                } else if (playState === this._playStates.PRESENTING){
                    state = BaseTvSource.STATE.PRESENTING;
                }
                return state;
            },
            destroy : function() {
                // Not currently required for hbbtv
            },
            _tuneToChannelObject: function _tuneToChannelObject (newChannel, onSuccess, onError) {
                var self = this;
                var successEventListener = function(/* channel */) {
                    self._broadcastVideoObject.removeEventListener('ChannelChangeSucceeded', successEventListener);
                    self._broadcastVideoObject.removeEventListener('ChannelChangeError', errorEventListener);
                    self._setBroadcastVisible();
                    onSuccess();
                };

                var errorEventListener = function(/* channel, errorState */) {
                    self._broadcastVideoObject.removeEventListener('ChannelChangeSucceeded', successEventListener);
                    self._broadcastVideoObject.removeEventListener('ChannelChangeError', errorEventListener);
                    onError({
                        name : 'ChangeChannelError',
                        message : 'Error tuning channel'
                    });
                };

                this._broadcastVideoObject.addEventListener('ChannelChangeSucceeded', successEventListener);
                this._broadcastVideoObject.addEventListener('ChannelChangeError', errorEventListener);

                this._broadcastVideoObject.setChannel(newChannel);
            },
            /**
             * @returns The type of the channel, as indicated by one of the ID_* constants in the HBBTV
             *      specification. Defaults to ID_DVB_T in the case of error
             *  @private
             */
            _getChannelIdType : function() {
                var idType;
                try {
                    idType = this._broadcastVideoObject.currentChannel.idType;
                    if (typeof idType === 'undefined') {
                        idType = ID_DVB_T;
                    }
                } catch(e) {
                    idType = ID_DVB_T;
                }

                return idType;
            },
            /**
             * Sets the size of the broadcast object to be the same as the required screen size identified by antie at
             * application start up.
             */
            _setBroadcastToFullScreen : function() {
                var currentLayout = RuntimeContext.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            },

            _getChannelFromChannelList : function(channelList, index) {
                if (typeof channelList.item === 'function') {
                    return channelList.item(index);
                } else {
                    return channelList[index];
                }
            },

            _getChannelList : function() {

                var channelConfig;

                try {
                    channelConfig = this._broadcastVideoObject.getChannelConfig();
                } catch (e) {
                    throw {
                        name : 'ChannelListError',
                        message : 'Channel list is not available'
                    };
                }

                if (!channelConfig || !channelConfig.channelList || channelConfig.channelList.length === 0) {
                    throw {
                        name : 'ChannelListError',
                        message : 'Channel list is empty or not available'
                    };
                }

                return channelConfig.channelList;
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
