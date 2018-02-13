/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/html5seekfinishedemitevent',
    [
        'antie/devices/mediaplayer/seekfinishedemitevent',
        'antie/devices/mediaplayer/html5'
    ],
    function (SeekFinishedEmitEvent, HTML5) {
        'use strict';

        SeekFinishedEmitEvent(HTML5);

        return HTML5;
    }
);
