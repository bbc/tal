/* global tizen */

/**
 * @fileOverview Requirejs module containing the antie.devices.broadcastsource.tizentvsource class.
 *
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
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

require.def('antie/devices/broadcastsource/tizentvsource', [
    'antie/devices/browserdevice',
    'antie/devices/broadcastsource/basetvsource',
    'antie/runtimecontext',
    'antie/events/tunerunavailableevent',
    'antie/events/tunerstoppedevent',
    'antie/events/tunerpresentingevent'
],
            function(Device, BaseTvSource, RuntimeContext, TunerUnavailableEvent, TunerStoppedEvent, TunerPresentingEvent) {
                'use strict';

                /**
                 * Contains a Samsung Tizen implementation of the antie broadcast TV source.
                 * @see http://www.samsungdforum.com/tizenapiguide/?FolderName=tizen881&FileName=index.html
                 * @class
                 * @name antie.devices.broadcastsource.TizenTVSource
                 * @extends antie.devices.broadcastsource.BaseTVSource
                 */
                var TUNE_MODE_ALL = 'ALL'; // Tuning mode for getChannelList
                var KEY_VOLUME_UP = 'VolumeUp';
                var KEY_VOLUME_DOWN = 'VolumeDown';
                var KEY_MUTE = 'VolumeMute';

                var TizenSource = BaseTvSource.extend( /** @lends antie.devices.broadcastsource.TizenTVSource.prototype */ {
                    /**
                     * @constructor
                     * @override
                     * @ignore
                     * @todo Resolve missing source changed event, see description for
                     *       details
                     * @description Previous implementation of Samsung broadcast object
                     *              contained handling of source change event, like in
                     *              the example below:
                     *              case PL_TV_EVENT_SOURCE_CHANGED:
                     *                  self.playState = BaseTvSource.STATE.STOPPED;
                     *                  var stoppedEvent = new TunerStoppedEvent();
                     *                  RuntimeContext.getCurrentApplication().broadcastEvent(stoppedEvent);
                     *                  break;
                     *              This is not possible to implement with Tizen API, which
                     *              only handles source change event when the event comes
                     *              from itself (tizen.tvwindow.setSource). This has to
                     *              be taken into account when using this module.
                     */
                    init: function () {
                        if (typeof tizen === 'undefined' || typeof tizen.tvchannel === 'undefined' ||
                            typeof tizen.tvwindow === 'undefined') {
                            throw new Error('Unable to initialize Tizen broadcast object, not found');
                        }

                        this.volume = tizen.tvaudiocontrol.getVolume();
                        this.nop = function () {};
                        this.playState = BaseTvSource.STATE.UNKNOWN;
                        this._setBroadcastToFullScreen();
                    },

                    /**
                     * Indicates the current state of the broadcast source
                     * @override
                     * @returns {antie.devices.broadcastsources.BaseTvSource.STATE} current state of the broadcast source
                     */
                    getState: function () {
                        return this.playState;
                    },

                    /**
                     * Sets the current source to TV broadcast and performs a tune to
                     * current channel (tune is needed to handle tuner events)
                     * @override
                     */
                    showCurrentChannel: function () {
                        var currentChannelName = this.getCurrentChannelName();
                        this._unmute();
                        this._setBroadcastToFullScreen();
                        this.setChannelByName({
                            channelName: currentChannelName,
                            onSuccess: function () {},
                            onError: function () {}
                        });
                    },

                    /**
                     * Sets the current source to the media source
                     * @override
                     * @description This method contains a hack around the lack of
                     *              possibility to completely hide broadcast window. Hide
                     *              method from the tvchannel API only restores the
                     *              broadcast to its original view, on the layer behind
                     *              the rendered applciation. So to display a black
                     *              screen, which seems to be the desired behavior here,
                     *              we are displaying a broadcast window in the lower
                     *              right corner of the screen and setting its dimensions
                     *              to the lowest possible values.
                     */
                    stopCurrentChannel: function () {
                        var currentLayout = RuntimeContext.getCurrentApplication().getLayout().requiredScreenSize;
                        this.setPosition(currentLayout.height - 1,currentLayout.width - 1, '1px', '1px');
                        this._mute();
                        this.playState = BaseTvSource.STATE.STOPPED;
                        var stoppedEvent = new TunerStoppedEvent();
                        RuntimeContext.getCurrentApplication().broadcastEvent(stoppedEvent);
                    },

                    _mute: function () {
                        this.volume = tizen.tvaudiocontrol.getVolume();
                        tizen.tvinputdevice.registerKey(KEY_VOLUME_UP);
                        tizen.tvinputdevice.registerKey(KEY_VOLUME_DOWN);
                        tizen.tvinputdevice.registerKey(KEY_MUTE);
                        tizen.tvaudiocontrol.setMute(true);
                    },

                    _unmute: function () {
                        tizen.tvaudiocontrol.setVolume(this.volume);
                        tizen.tvaudiocontrol.setMute(false);
                        tizen.tvinputdevice.unregisterKey(KEY_VOLUME_UP);
                        tizen.tvinputdevice.unregisterKey(KEY_VOLUME_DOWN);
                        tizen.tvinputdevice.unregisterKey(KEY_MUTE);
                    },

                    /**
                     * Gets the service name of the current channel
                     * @override
                     */
                    getCurrentChannelName: function () {
                        return tizen.tvchannel.getCurrentChannel().channelName;
                    },

                    /**
                     * Gets only channel names from channel list
                     * @override
                     */
                    getChannelNameList: function (params) {
                        this._getChannelList({
                            onSuccess: function (channels) {
                                var result = [];
                                for (var i = 0, len = channels.length; i < len; i++) {
                                    result.push(channels[i].channelName);
                                }
                                params.onSuccess(result);
                            },
                            onError: params.onError
                        });
                    },

                    _getChannelList: function (params) {
                        try {
                            var onFailedToRetrieveChannelList = function () {
                                params.onError({
                                    name: 'ChannelListError',
                                    message: 'Channel list is not available'
                                });
                            };

                            tizen.tvchannel.getChannelList(params.onSuccess,
                                                           onFailedToRetrieveChannelList, TUNE_MODE_ALL);
                        } catch (error) {
                            params.onError({
                                name: 'ChannelListError',
                                message: 'Channel list is empty or not available'
                            });
                        }
                    },

                    /**
                     * Sets the size and position of the visible broadcast source
                     * @param top
                     * @param left
                     * @param width
                     * @param height
                     */
                    setPosition: function (top, left, width, height) {
                        // Remark: show method overlaps rendered application's interface
                        tizen.tvwindow.show(this.nop, this.nop, [left, top, width, height]);
                    },

                    /**
                     * Reverts the current screen settings and performs any clean up
                     * required before the user exits the application back to standard
                     * broadcast.
                     * @override
                     * @deprecated Not needed for Samsung Tizen
                     */
                    destroy: function () {
                        this._unmute();
                    },

                    /**
                     * Tries to setchannel basing only on its name
                     * @overrides
                     * @param params.channelName
                     */
                    setChannelByName: function (params) {
                        params.onSuccess = params.onSuccess || this.nop;
                        params.onError = params.onError || this.nop;
                        try {
                            this.getCurrentChannelName();
                            this._tuneToChannelByName({
                                name: params.channelName,
                                onError: params.onError,
                                onSuccess: params.onSuccess
                            });
                        } catch (error) {
                            params.onError({
                                name: 'ChannelError',
                                message: 'Unable to determine current channel name'
                            });
                        }
                    },

                    _setBroadcastToFullScreen: function () {
                        // This would be the most logical implementation:
                        // var currentLayout = RuntimeContext.getCurrentApplication().getLayout().requiredScreenSize;
                        // this.setPosition(0, 0, currentLayout.width, currentLayout.height);

                        // But.
                        // This puts broadcast window back to its original state, which
                        // means that broadcast will be visible under UI elements of the
                        // application and displayed in full screen, which seems to be
                        // the expected result in this method.
                        tizen.tvwindow.hide(this.nop);
                    },

                    _tuneToChannelByName: function (params) {
                        params.onSuccess = params.onSuccess || this.nop;
                        params.onError = params.onError || this.nop;
                        var self = this;
                        var onChannelListRetrieved = function (channels) {
                            var channel;

                            for (var i = 0, len = channels.length; i < len; i++) {
                                if (channels[i].channelName === params.name) {
                                    channel = channels[i];
                                    break;
                                }
                            }

                            if (channel) {
                                self._tuneToChannel({
                                    channel: channel,
                                    onError: params.onError,
                                    onSuccess: params.onSuccess
                                });
                            } else {
                                params.onError({
                                    name: 'ChannelError',
                                    message: 'Channel could not be found'
                                });
                            }
                        };

                        this._getChannelList({
                            onError: params.onError,
                            onSuccess: onChannelListRetrieved
                        });
                    },

                    /**
                     * @param params.channel Channel object
                     * @param params.onError Function to call with a string message on error.
                     * @param params.onSuccess Function to call on success.
                     * @private
                     */
                    _tuneToChannel: function (params) {
                        params.onError = params.onError || this.nop;
                        params.onSuccess = params.onSuccess || this.nop;
                        var channel = params.channel;
                        var self = this;

                        var tuneError = function () {
                            params.onError({
                                name: 'ChangeChannelError',
                                message: 'Error tuning channel'
                            });
                        };

                        try {
                            tizen.tvchannel.tune(channel, {
                                onsuccess: function () {
                                    self._unmute();
                                    self._setBroadcastToFullScreen();
                                    self.playState = BaseTvSource.STATE.PRESENTING;
                                    RuntimeContext.getCurrentApplication().broadcastEvent(
                                        new TunerPresentingEvent(self.getCurrentChannelName()));
                                    params.onSuccess();
                                },
                                onnosignal: function () {
                                    self.playState = BaseTvSource.STATE.UNAVAILABLE;
                                    RuntimeContext.getCurrentApplication().broadcastEvent(
                                        new TunerUnavailableEvent());
                                },
                                onprograminforeceived: function () {}
                            }, tuneError);
                        } catch (error) {
                            params.onError({
                                name: 'ChangeChannelError',
                                message: 'Error tuning channel'
                            });
                        }
                    }

                });

                Device.prototype.isBroadcastSourceSupported = function() {
                    return true;
                };

                /**
                 * Create a new widget giving control over broadcast television. Check
                 * whether the broadcast television API is available first with
                 * isBroadcastSourceSupported().
                 * @see antie.widgets.broadcastsource
                 * @returns {Object} Device-specific implementation of antie.widgets.broadcastsource
                 */
                Device.prototype.createBroadcastSource = function () {
                    if (!this._broadcastSource) {
                        this._broadcastSource = new TizenSource();
                    }

                    return this._broadcastSource;
                };

                // Return for testing purposes only
                return TizenSource;
            }
           );
