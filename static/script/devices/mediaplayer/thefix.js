require.def(
    "antie/devices/mediaplayer/thefix",
    ["antie/devices/mediaplayer/mediaplayer"],
    function (MediaPlayer) {
        "use strict";

        MediaPlayer.EVENT.RESTART_UNSTABLE = 'restart-unstable';
        MediaPlayer.EVENT.RESTART_STABLE = 'restart-stable';

        return function (OverrideClass) {
            var oldSetSource = OverrideClass.prototype.setSource;
            OverrideClass.prototype.setSource = function (mediaType, url, mimeType) {
                this._count = 0;
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._emitEvent('restart-unstable');
                }

                var restartTimeout = window.antie.framework.deviceConfiguration.restartTimeout;

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

                var isAtCorrectStartingPoint = true;
                var isPlayingAtCorrectTime = this.getState() === MediaPlayer.STATE.PLAYING && isAtCorrectStartingPoint;

                console.log(isPlayingAtCorrectTime, this._count, this._timeoutHappened);
                if (isPlayingAtCorrectTime && this._count >= 5 && this._timeoutHappened) {
                    this._emitEvent('restart-stable');
                } else if (isPlayingAtCorrectTime) {
                    this._count++;
                } else {
                    this._count = 0;
                }
            };
        }
    }
);
