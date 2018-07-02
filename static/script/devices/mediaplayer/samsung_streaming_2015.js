/**
 * @preserve Copyright (c) 2017-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

require.def(
    'antie/devices/mediaplayer/samsung_streaming_2015',
    [
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer',
        'antie/devices/mediaplayer/samsung_streaming',
        'antie/runtimecontext'
    ],
    function(Device, MediaPlayer, SamsungStreaming, RuntimeContext) {
        'use strict';

        /**
         * MediaPlayer implementation for Samsung 2015 devices supporting HLS Live Seek implementing the Streaming API.
         * Use this device modifier if a device implements the Samsung Streaming media playback standard.
         * It must support creation of &lt;object&gt; elements with appropriate SAMSUNG_INFOLINK classids.
         * Those objects must expose an API in accordance with the Samsung Streaming media specification.
         * @name antie.devices.mediaplayer.SamsungStreaming2015
         * @class
         * @extends antie.devices.mediaplayer.SamsungStreaming
         */
        var Player = SamsungStreaming.extend({
            /**
            * @inheritDoc
            */
            initialiseMedia: function initialiseMedia (mediaType, url, mimeType) {
                this._logger = RuntimeContext.getDevice().getLogger();
                if (this.getState() === MediaPlayer.STATE.EMPTY) {

                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._registerEventHandlers();
                    this._toStopped();

                    if (this._isHlsMimeType()) {
                        this._source += '|COMPONENT=HLS';
                    }
                    this._openPlayerPlugin();

                    this._initPlayer(this._source);

                } else {
                    this._toError('Cannot set source unless in the \'' + MediaPlayer.STATE.EMPTY + '\' state');
                }
            },
            
            _updateRange: function _updateRange () {
                var self = this;
                if (this._isHlsMimeType() && this._isLiveMedia()) {
                    var range = this._playerPlugin.Execute('GetLiveDuration').split('|');
                    this._range = {
                        start: Math.floor(range[0]/1000),
                        end: Math.floor(range[1]/1000)
                    };
                    //don't call range for the next 8 seconds
                    this._updatingTime = true;
                    setTimeout(function () {
                        self._updatingTime = false;
                    }, self.RANGE_UPDATE_TOLERANCE * 1000);
                } else {
                    var duration = this._playerPlugin.Execute('GetDuration')/1000;
                    this._range = {
                        start: 0,
                        end: duration
                    };
                }
            },

            _getClampedTimeForPlayFrom: function _getClampedTimeForPlayFrom (seconds) {
                if (this._isHlsMimeType() && this._isLiveMedia() && !this._updatingTime) {
                    this._updateRange();
                }
                var clampedTime = this._getClampedTime(seconds);
                if (clampedTime !== seconds) {
                    RuntimeContext.getDevice().getLogger().debug('playFrom ' + seconds+ ' clamped to ' + clampedTime + ' - seekable range is { start: ' + this._range.start + ', end: ' + this._range.end + ' }');
                }
                return clampedTime;
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