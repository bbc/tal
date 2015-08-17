require.def(
    "antie/devices/mediaplayer/live/restartablefix",
    [
        "antie/class",
        "antie/runtimecontext",
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/devices/mediaplayer/live/restartable"
    ],
    function (Class, RuntimeContext, Device, MediaPlayer, RestartableLivePlayer) {
        "use strict";

        MediaPlayer.EVENT.RESTART_UNSTABLE = 'restart-unstable';
        MediaPlayer.EVENT.RESTART_STABLE = 'restart-stable';

        var RestartableLivePlayerFix = RestartableLivePlayer.extend({
            init: function () {
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
                this._count = 0;
            },

            setSource: function (mediaType, sourceUrl, mimeType) {
                if (this._mediaPlayer.getState() === MediaPlayer.STATE.EMPTY) {
                    this._mediaPlayer._emitEvent('restart-unstable');
                }
                var self = this;
                var m = this._mediaPlayer;
                var old = this._mediaPlayer._onStatus;
                this._mediaPlayer._onStatus = function (args) {
                    old.call(m, args);
                    var isAtCorrectStartingPoint = true;
                    var isPlayingAtCorrectTime = m.getState() === MediaPlayer.STATE.PLAYING && isAtCorrectStartingPoint;

                    if (isPlayingAtCorrectTime && self._count >= 5 && timeoutHappened) {
                        m._emitEvent('restart-stable');
                    } else if (isPlayingAtCorrectTime) {
                        self._count++;
                    } else {
                        self._count = 0;
                    }
                };

                var restartTimeout = window.antie.framework.deviceConfiguration.restartTimeout;
                var timeoutHappened = false;
                if (restartTimeout) {
                    setTimeout(function () {
                        timeoutHappened = true;
                    }, restartTimeout);
                } else {
                    timeoutHappened = true;
                }

                this._super(mediaType, sourceUrl, mimeType);
            }
        });

        var instance;

        Device.prototype.getLivePlayer = function () {
            if (!instance) {
                instance = new RestartableLivePlayerFix();
            }
            return instance;
        };

        return RestartableLivePlayerFix;
    }
);