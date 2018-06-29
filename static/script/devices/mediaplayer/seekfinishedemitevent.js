/**
 * @fileOverview Requirejs module containing device modifier for media playback
 * where devices show some playback before seeking. Fires a SEEK_ATTEMPTED event,
 * checks that we have had 5 status events where the time behaves as expected,
 * waits for an optional timeout and then fires a SEEK_FINISHED event to give
 * extra security that have seeked correctly.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/mediaplayer/seekfinishedemitevent',
    [
        'antie/devices/mediaplayer/mediaplayer',
        'antie/runtimecontext'
    ],
    function (MediaPlayer, RuntimeContext) {
        'use strict';

        return function (OverrideClass) {
            var oldInitialiseMedia = OverrideClass.prototype.initialiseMedia;
            OverrideClass.prototype.initialiseMedia = function (mediaType, url, mimeType, sourceContainer, opts) {
                this._count = 0;
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_ATTEMPTED);
                    this._seekFinished = false;
                }

                var restartTimeout = RuntimeContext.getDevice().getConfig().restartTimeout;

                var self = this;
                this._timeoutHappened = false;
                if (restartTimeout) {
                    setTimeout(function () {
                        self._timeoutHappened = true;
                    }, restartTimeout);
                } else {
                    this._timeoutHappened = true;
                }
                oldInitialiseMedia.call(this, mediaType, url, mimeType, sourceContainer, opts);
            };

            var oldOnStatus = OverrideClass.prototype._onStatus;
            OverrideClass.prototype._onStatus = function (evt) {
                oldOnStatus.call(this, evt);

                var isAtCorrectStartingPoint = Math.abs(this.getCurrentTime() - this._sentinelSeekTime) <= this._seekSentinelTolerance;


                if(this._sentinelSeekTime === undefined){
                    isAtCorrectStartingPoint = true;
                }

                var isPlayingAtCorrectTime = this.getState() === MediaPlayer.STATE.PLAYING && isAtCorrectStartingPoint;

                if (isPlayingAtCorrectTime && this._count >= 5 && this._timeoutHappened && !this._seekFinished) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_FINISHED);
                    this._seekFinished = true;
                } else if (isPlayingAtCorrectTime) {
                    this._count++;
                } else {
                    this._count = 0;
                }

            };
        };
    }
);
