/**
 * @fileOverview Requirejs module containing device modifier for live playback
 * with support level none
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/live/none',
    [
        'antie/devices/device',
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function (Device, MediaPlayer) {
        'use strict';

        Device.prototype.getLivePlayer = function () {
            return null;
        };

        Device.prototype.getLiveSupport = function () {
            return MediaPlayer.LIVE_SUPPORT.NONE;
        };
    }
);
