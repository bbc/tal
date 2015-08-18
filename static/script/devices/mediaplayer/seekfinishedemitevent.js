require.def(
    "antie/devices/mediaplayer/seekfinishedemitevent",
    ["antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext"],
    function (MediaPlayer, RuntimeContext) {
        "use strict";

        MediaPlayer.EVENT.SEEK_ATTEMPTED = 'seek-attempted';
        MediaPlayer.EVENT.SEEK_FINISHED = 'seek-finished';

        return function (OverrideClass) {
            var oldSetSource = OverrideClass.prototype.setSource;
            OverrideClass.prototype.setSource = function (mediaType, url, mimeType) {
                this._count = 0;
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_ATTEMPTED);
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
                oldSetSource.call(this, mediaType, url, mimeType);
            };

            var oldOnStatus = OverrideClass.prototype._onStatus;
            OverrideClass.prototype._onStatus = function (evt) {
                oldOnStatus.call(this, evt);

                var isAtCorrectStartingPoint = Math.abs(this.getCurrentTime() - this._sentinelSeekTime) <= this._seekSentinelTolerance;


                if(this._sentinelSeekTime === undefined){
                    isAtCorrectStartingPoint = true;
                }

                var isPlayingAtCorrectTime = this.getState() === MediaPlayer.STATE.PLAYING && isAtCorrectStartingPoint;

                if (isPlayingAtCorrectTime && this._count >= 5 && this._timeoutHappened) {
                    this._emitEvent(MediaPlayer.EVENT.SEEK_FINISHED);
                } else if (isPlayingAtCorrectTime) {
                    this._count++;
                } else {
                    this._count = 0;
                }

            };
        }
    }
);
