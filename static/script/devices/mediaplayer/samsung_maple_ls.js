/**
 * @fileOverview Requirejs module containing device modifier for media playback on Samsung 2015 devices.
 * @preserve Copyright (c) 2017-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/samsung_maple_ls',
    [
        'antie/devices/device',
        "antie/devices/mediaplayer/mediaplayer",
        'antie/devices/mediaplayer/samsung_maple',
        'antie/runtimecontext'
    ],
    function(Device, MediaPlayer, SamsungMaple, RuntimeContext) {
        'use strict';

        /**
         * MediaPlayer implementation for Samsung devices implementing the Maple API.
         * Use this device modifier if a device implements the Samsung Maple media playback standard on 2015.
         * It must support creation of &lt;object&gt; elements with appropriate SAMSUNG_INFOLINK classids.
         * Those objects must expose an API in accordance with the Samsung Maple media specification.
         * @name antie.devices.mediaplayer.SamsungMapleLS
         * @class
         * @extends antie.devices.mediaplayer.SamsungMaple
         */
        var Player = SamsungMaple.extend({

            init: function() {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
                this._playerPlugin = document.getElementById('playerPlugin');
                this._deferSeekingTo = null;
                this._postBufferingState = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;
                this._lastWindowRanged = false;
                this._updatingTime = false;
            },
            
            isLiveRangeOutdated: function () {
                var time = Math.floor(this._currentTime);
                if (time % 8 === 0 && !this._updatingTime && this._lastWindowRanged !== time) {
                    this._lastWindowRanged = time;
                    return true;
                } else {
                    return false;
                }
            },

            _updateRange: function () {
                var self = this;
                if (this._isLiveMedia() && this._isHlsMimeType()) {
                    var range = this._playerPlugin.GetLiveDuration().split('|');
                    this._range = {
                        start: Math.floor(range[0]),
                        end: Math.floor(range[1])
                    };
                    //don't call range for the next 8 seconds
                    this._updatingTime = true;
                    setTimeout(function () {
                        self._updatingTime = false;
                    }, self.RANGE_UPDATE_TOLERANCE * 1000);
                } else {
                    var duration = this._playerPlugin.GetDuration()/1000;
                    this._range = {
                        start: 0,
                        end: duration
                    }
                }
            },

            _onCurrentTime: function(timeInMillis) {
                this._currentTime = timeInMillis / 1000;
                this._onStatus();
                this._currentTimeKnown = true;
                
                //[optimisation] do not call player API periodically in HLS live
                // - calculate range manually when possible
                // - do not calculate range if player API was called less than RANGE_UPDATE_TOLERANCE seconds ago
                if (this.range && this._isLiveMedia() && this.isLiveRangeOutdated()) {
                    this._range.start += 8;
                    this._range.end += 8;
                }

                if (this._deferSeekingTo !== null) {
                    this._deferredSeek();
                }

                if (this._tryingToPause) {
                    this._tryPauseWithStateTransition();
                }
            },

            _getClampedTimeForPlayFrom: function (seconds) {
                if (this._isLiveMedia() && !this._updatingTime) {
                    this._updateRange();
                }
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    RuntimeContext.getDevice().getLogger().debug('playFrom ' + seconds+ ' clamped to ' + clampedTime + ' - seekable range is { start: ' + this._range.start + ', end: ' + this._range.end + ' }');
                }
                return clampedTime;
            },
            
            _getClampOffsetFromConfig: function() {
                var clampOffsetFromEndOfRange;
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides) {
                    clampOffsetFromEndOfRange = config.streaming.overrides.clampOffsetFromEndOfRange;
                }

                if(clampOffsetFromEndOfRange !== undefined) {
                    return clampOffsetFromEndOfRange;
                } else if (this._isLiveMedia()) {
                    return this.CLAMP_OFFSET_FROM_END_OF_LIVE_RANGE;
                } else {
                    return this.CLAMP_OFFSET_FROM_END_OF_RANGE;
                }
            },

            _registerEventHandlers: function() {
                var self = this;

                window.SamsungMapleOnRenderError = function () {
                    self._onDeviceError('Media element emitted OnRenderError');
                };
                this._playerPlugin.OnRenderError = 'SamsungMapleOnRenderError';

                window.SamsungMapleOnConnectionFailed = function () {
                    self._onDeviceError('Media element emitted OnConnectionFailed');
                };
                this._playerPlugin.OnConnectionFailed = 'SamsungMapleOnConnectionFailed';

                window.SamsungMapleOnNetworkDisconnected = function () {
                    self._onDeviceError('Media element emitted OnNetworkDisconnected');
                };
                this._playerPlugin.OnNetworkDisconnected = 'SamsungMapleOnNetworkDisconnected';

                window.SamsungMapleOnStreamNotFound = function () {
                    self._onDeviceError('Media element emitted OnStreamNotFound');
                };
                this._playerPlugin.OnStreamNotFound = 'SamsungMapleOnStreamNotFound';

                window.SamsungMapleOnAuthenticationFailed = function () {
                    self._onDeviceError('Media element emitted OnAuthenticationFailed');
                };
                this._playerPlugin.OnAuthenticationFailed = 'SamsungMapleOnAuthenticationFailed';

                window.SamsungMapleOnRenderingComplete = function () {
                    if (self.getState() !== MediaPlayer.STATE.COMPLETE) {
                        self._onEndOfMedia();
                    }
                };
                this._playerPlugin.OnRenderingComplete = 'SamsungMapleOnRenderingComplete';

                window.SamsungMapleOnBufferingStart = function () {
                    self._onDeviceBuffering();
                };
                this._playerPlugin.OnBufferingStart = 'SamsungMapleOnBufferingStart';

                window.SamsungMapleOnBufferingComplete = function () {
                    if (self.getState() !== MediaPlayer.STATE.COMPLETE) {
                        self._onFinishedBuffering();
                    }
                };
                this._playerPlugin.OnBufferingComplete = 'SamsungMapleOnBufferingComplete';

                window.SamsungMapleOnStreamInfoReady = function () {
                    self._updateRange();
                };
                this._playerPlugin.OnStreamInfoReady = 'SamsungMapleOnStreamInfoReady';

                window.SamsungMapleOnCurrentPlayTime = function (timeInMillis) {
                    if (self._range && self._isLiveMedia() && !self._isCurrentTimeInRangeTolerance(timeInMillis / 1000)) {
                        self._updateRange();
                    }
                    self._onCurrentTime(timeInMillis);
                };
                this._playerPlugin.OnCurrentPlayTime = 'SamsungMapleOnCurrentPlayTime';

                this._onWindowHide = function () {
                    self.stop();
                };

                window.addEventListener('hide', this._onWindowHide, false);
                window.addEventListener('unload', this._onWindowHide, false);
            },

            _wipe: function () {
                this._stopPlayer();
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                this._currentTime = undefined;
                this._range = undefined;
                this._deferSeekingTo = null;
                this._tryingToPause = false;
                this._currentTimeKnown = false;
                this._lastWindowRanged = false;
                this._updatingTime = false;
                this._unregisterEventHandlers();
            },
            
            _isCurrentTimeInRangeTolerance: function (seconds) {
                if (seconds > this._range.end + this.RANGE_UPDATE_TOLERANCE) {
                    return false;
                } else if (seconds < this._range.start - this.RANGE_UPDATE_TOLERANCE) {
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * @constant {Number} Time (in seconds) compared to current time within which seeking has no effect.
             * On a sample device (Samsung FoxP 2013), seeking by two seconds worked 90% of the time, but seeking
             * by 2.5 seconds was always seen to work.
             */
            CURRENT_TIME_TOLERANCE: 2.5,
            CLAMP_OFFSET_FROM_END_OF_LIVE_RANGE: 10,
            RANGE_UPDATE_TOLERANCE: 8
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

);