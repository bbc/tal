/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
 *
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def(
    "antie/devices/mediaplayer/cehtml",
    [
        "antie/devices/device",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext"
    ],
    function(Device, MediaPlayer, RuntimeContext) {
        "use strict";

        /**
         * Main MediaPlayer implementation for CEHTML devices.
         * Use this device modifier if a device implements the CEHTML media playback standard.
         * It must support creation of <object> elements for media mime types, and those objects must expose an
         * API in accordance with the CEHTML specification.
         * @name antie.devices.mediaplayer.cehtml
         * @class
         * @extends antie.devices.mediaplayer.MediaPlayer.prototype
         */
        var Player = MediaPlayer.extend({

            init: function() {
                this._super();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            /**
            * @inheritDoc
            */
            setSource: function (mediaType, url, mimeType) {
                if (this.getState() === MediaPlayer.STATE.EMPTY) {
                    this._type = mediaType;
                    this._source = url;
                    this._mimeType = mimeType;
                    this._createElement();
                    this._registerEventHandlers();
                    this._addElementToDOM();
                    this._toStopped();
                } else {
                    this._toError("Cannot set source unless in the '" + MediaPlayer.STATE.EMPTY + "' state");
                }
            },

            /**
            * @inheritDoc
            */
            resume : function () {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.BUFFERING:
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        this._mediaElement.play(1);
                        this._toPlaying();
                        break;

                    default:
                        this._toError("Cannot resume while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            playFrom: function (seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                        this._deferSeekingTo = seconds;
                        break;

                    case MediaPlayer.STATE.STOPPED:
                        // Seeking past 0 requires calling play first when media has not been loaded
                        this._toBuffering();
                        this._playAndSetDeferredSeek(seconds);
                        break;

                    case MediaPlayer.STATE.COMPLETE:
                        this._toBuffering();
                        this._mediaElement.stop();
                        this._playAndSetDeferredSeek(seconds);
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._toBuffering();
                        var seekResult = this._mediaElement.seek(this._getClampedTime(seconds) * 1000);
                        if(seekResult === false) {
                            this._toPlaying();
                        }
                        break;

                    case MediaPlayer.STATE.PAUSED:
                        // TODO: consider always deferring play(1) until playStateChange to 2 OR deferring seek until playStateChange to 3, 4, or 1
                        this._toBuffering();
                        this._seekAndPlayFromPaused(this._getClampedTime(seconds) * 1000);
                        break;

                    default:
                        this._toError("Cannot playFrom while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            beginPlayback: function(seconds) {
                this._postBufferingState = MediaPlayer.STATE.PLAYING;
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                        this._toBuffering();
                        this._mediaElement.play(1);
                        break;

                    default:
                        this._toError("Cannot beginPlayback while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            pause: function () {
                this._postBufferingState = MediaPlayer.STATE.PAUSED;
                // TODO: Spec says we can pause from buffering. Will this help observed device issues?
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PAUSED:
                        break;

                    case MediaPlayer.STATE.PLAYING:
                        this._mediaElement.play(0);
                        this._toPaused();
                        break;

                    default:
                        this._toError("Cannot pause while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            stop: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.BUFFERING:
                    case MediaPlayer.STATE.PLAYING:
                    case MediaPlayer.STATE.PAUSED:
                    case MediaPlayer.STATE.COMPLETE:
                        this._mediaElement.stop();
                        this._toStopped();
                        break;

                    default:
                        this._toError("Cannot stop while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            reset: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        this._toEmpty();
                        break;

                    default:
                        this._toError("Cannot reset while in the '" + this.getState() + "' state");
                        break;
                }
            },

            /**
            * @inheritDoc
            */
            getSource: function () {
                return this._source;
            },

            /**
            * @inheritDoc
            */
            getMimeType: function () {
                return this._mimeType;
            },

            /**
            * @inheritDoc
            */
            getCurrentTime: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    case MediaPlayer.STATE.COMPLETE:
                        if (this._range) {
                            return this._range.end;
                        }

                    default:
                        if (this._mediaElement) {
                            return this._mediaElement.playPosition / 1000;
                        }
                        break;
                }
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getRange: function () {
                switch (this.getState()) {
                    case MediaPlayer.STATE.STOPPED:
                    case MediaPlayer.STATE.ERROR:
                        break;

                    default:
                        return this._range;
                };
                return undefined;
            },

            /**
            * @inheritDoc
            */
            getState: function () {
                return this._state;
            },

            _onFinishedBuffering: function() {
                this._cacheRange();

                if (this.getState() !== MediaPlayer.STATE.BUFFERING) {
                    return;
                }

                if(this._waitingToSeek()) {
                    this._toBuffering();
                    this._performDeferredSeek();
                } else if (this._waitingToPause()) {
                    this._toPaused();
                    this._mediaElement.play(0);
                } else {
                    this._toPlaying();
                }
            },

            _onDeviceError: function() {
                this._toError('Media element emitted error with code: ' + this._mediaElement.error);
            },

            _onDeviceBuffering: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._toBuffering();
                }
            },

            _onEndOfMedia: function() {
                if (this.getState() !== MediaPlayer.STATE.COMPLETE) {
                    this._toComplete();
                }
            },

            _onStatus: function() {
                if (this.getState() === MediaPlayer.STATE.PLAYING) {
                    this._emitEvent(MediaPlayer.EVENT.STATUS);
                }
            },

            _createElement: function() {
                var device = RuntimeContext.getDevice();
                this._mediaElement = device._createElement("object", "mediaPlayer");
                this._mediaElement.type = this._mimeType;
                this._mediaElement.data = this._source;
                this._mediaElement.style.position = "absolute";
                this._mediaElement.style.top = "0px";
                this._mediaElement.style.left = "0px";
                this._mediaElement.style.width = "100%";
                this._mediaElement.style.height = "100%";
                //this._mediaElement.setFullScreen(true);
            },

            _registerEventHandlers: function() {
                var self = this;
                var DEVICE_UPDATE_PERIOD_MS = 500;

                this._mediaElement.onPlayStateChange = function() {
                    switch (self._mediaElement.playState) {
                        case Player.PLAY_STATE_STOPPED:
                            break;
                        case Player.PLAY_STATE_PLAYING:
                            self._onFinishedBuffering();
                            break;
                        case Player.PLAY_STATE_PAUSED:
                            break;
                        case Player.PLAY_STATE_CONNECTING:
                            break;
                        case Player.PLAY_STATE_BUFFERING:
                            self._onDeviceBuffering();
                            break;
                        case Player.PLAY_STATE_FINISHED:
                            self._onEndOfMedia();
                            break;
                        case Player.PLAY_STATE_ERROR:
                            self._onDeviceError();
                            break;
                        default:
                            // do nothing
                            break;
                    }
                }

                this._updateInterval = setInterval(function() {
                    self._onStatus();
                }, DEVICE_UPDATE_PERIOD_MS);
            },

            _addElementToDOM: function() {
                var device = RuntimeContext.getDevice();
                var body = document.getElementsByTagName("body")[0];
                device.prependChildElement(body, this._mediaElement);
            },

            _cacheRange: function() {
                if(this._mediaElement) {
                    this._range =  {
                        start: 0,
                        end: this._mediaElement.playTime / 1000
                    };
                }
            },

            _seekAndPlayFromPaused: function(seconds) {
                this._mediaElement.seek(seconds);
                this._mediaElement.play(1);
            },

            _playAndSetDeferredSeek: function(seconds) {
                this._mediaElement.play(1);
                if (seconds > 0) {
                    this._deferSeekingTo = seconds;
                }
            },

            _waitingToSeek: function() {
                return (this._deferSeekingTo !== undefined);
            },

            _performDeferredSeek: function() {
                this._mediaElement.seek(this._getClampedTime(this._deferSeekingTo) * 1000);
                this._deferSeekingTo = undefined;
            },

            _waitingToPause: function() {
                return (this._postBufferingState === MediaPlayer.STATE.PAUSED);
            },

            _wipe: function () {
                this._type = undefined;
                this._source = undefined;
                this._mimeType = undefined;
                if(this._mediaElement) {
                    clearInterval(this._updateInterval);
                    this._destroyMediaElement();
                }
            },

            _destroyMediaElement: function() {
                var device = RuntimeContext.getDevice();
                delete this._mediaElement.onPlayStateChange;
                device.removeElement(this._mediaElement);
                this._mediaElement = undefined;
            },

            _toStopped: function () {
                this._state = MediaPlayer.STATE.STOPPED;
                this._emitEvent(MediaPlayer.EVENT.STOPPED);
            },

            _toBuffering: function () {
                this._state = MediaPlayer.STATE.BUFFERING;
                this._emitEvent(MediaPlayer.EVENT.BUFFERING);
            },

            _toPlaying: function () {
                this._state = MediaPlayer.STATE.PLAYING;
                this._emitEvent(MediaPlayer.EVENT.PLAYING);
            },

            _toPaused: function () {
                this._state = MediaPlayer.STATE.PAUSED;
                this._emitEvent(MediaPlayer.EVENT.PAUSED);
            },

            _toComplete: function () {
                this._state = MediaPlayer.STATE.COMPLETE;
                this._emitEvent(MediaPlayer.EVENT.COMPLETE);
            },

            _toEmpty: function () {
                this._wipe();
                this._state = MediaPlayer.STATE.EMPTY;
            },

            _toError: function(errorMessage) {
                RuntimeContext.getDevice().getLogger().error(errorMessage);
                this._wipe();
                this._state = MediaPlayer.STATE.ERROR;
                this._emitEvent(MediaPlayer.EVENT.ERROR);
            }
        });

        Player.PLAY_STATE_STOPPED = 0;
        Player.PLAY_STATE_PLAYING = 1;
        Player.PLAY_STATE_PAUSED = 2;
        Player.PLAY_STATE_CONNECTING = 3;
        Player.PLAY_STATE_BUFFERING = 4;
        Player.PLAY_STATE_FINISHED = 5;
        Player.PLAY_STATE_ERROR = 6;

        var instance = new Player();

        // Mixin this MediaPlayer implementation, so that device.getMediaPlayer() returns the correct implementation for the device
        Device.prototype.getMediaPlayer = function() {
            return instance;
        };

        return Player;
    }

    // 7.14.1.1 State diagram for A/V control objects
    // Contains useful state diagram
    // 7.14.3 Extensions to A/V object for trickmodes
    // TODO: Implement onPlaySpeedChanged() to give us some logging, and check some devices to see if it is used
    // playSpeeds array might be useful - if '0' is not in the list, then perhaps we cannot pause?
    // 7.14.8 Extensions to A/V object for UI feedback of buffering A/V content
    // TODO: Implement onReadyToPlay() to give us some logging, and check some devices to see if it is used
    // 7.14.9 DOM 2 events for A/V object
    // playState can change whilst onPlayStateChange is executing

);
