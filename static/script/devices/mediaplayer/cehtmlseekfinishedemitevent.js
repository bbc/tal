/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/cehtmlseekfinishedemitevent',
    [
        'antie/devices/mediaplayer/seekfinishedemitevent',
        'antie/devices/mediaplayer/cehtml'
    ],
    function (SeekFinishedEmitEvent, CEHTML) {
        'use strict';

        SeekFinishedEmitEvent(CEHTML);

        return CEHTML;
    }
);
