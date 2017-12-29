/**
 * @fileOverview Requirejs module containing device modifier for HTML5 media playback
 * on devices where clearing src on teardown causes problems.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/html5memoryleakunfix',
    [
        'antie/devices/mediaplayer/html5'
    ],
    function(HTML5MediaPlayer) {
        'use strict';

        HTML5MediaPlayer.prototype._unloadMediaSrc = function(){};

        return HTML5MediaPlayer;
    }
);
