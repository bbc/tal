/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media
 * playback without MIME type in source element
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/html5untyped',
    [
        'antie/runtimecontext',
        'antie/devices/device',
        'antie/devices/mediaplayer/html5'
    ],
    function(RuntimeContext, Device, HTML5MediaPlayer) {
        'use strict';

        /**
         * Main MediaPlayer implementation for HTML5 devices specifies a 'type'
         * attribute in the source element.
         * This device modifier implements a new version of the function to
         * generate the source element without setting a type attribute.
         * @name antie.devices.mediaplayer.HTML5Untyped
         * @class
         * @extends antie.devices.mediaplayer.HTML5
         */
        var Player = HTML5MediaPlayer.extend( /** @lends antie.devices.mediaplayer.HTML5Untyped.prototype */ {
            init: function init () {
                init.base.call(this);
            },

            _generateSourceElement: function _generateSourceElement (url) {
                var device = RuntimeContext.getDevice();
                var sourceElement = device._createElement('source');
                sourceElement.src = url;
                return sourceElement;
            }
        });

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that
        // device.getMediaPlayer() returns the correct implementation for the
        // device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }
);
