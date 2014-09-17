/**
 * @fileOverview Requirejs module containing samsung maple media wrapper
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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
    'antie/devices/media/samsung_maple',
    [
        'antie/devices/device',
        'antie/devices/media/mediainterface',
        'antie/events/mediaevent',
        'antie/events/mediaerrorevent',
        'antie/events/mediasourceerrorevent',
        'antie/mediasource',
        'antie/application'
    ],
    function(Device, MediaInterface, MediaEvent, MediaErrorEvent, MediaSourceErrorEvent, MediaSource, Application) {
        'use strict';

        function audioLevelCorrection(t) {
            return t * 40.0;
        }
        function invertAudioLevelCorrection(x) {
            return x / 40.0;
        }
        var SamsungPlayer = MediaInterface.extend({
            init: function(id, mediaType, eventHandlingCallback) {
                this._super(id);

                this._eventHandlingCallback = eventHandlingCallback;

                this.playerPlugin = document.getElementById('playerPlugin');
                this.audioPlugin = document.getElementById('audioPlugin');
                this.tvmwPlugin = document.getElementById('pluginObjectTVMW');
                this.originalSource = this.tvmwPlugin.GetSource();

                this.mediaSource = null;

                this._addExitStrategyEventListener();


                if (mediaType == "audio") {
                    this._mediaType = "audio";
                } else if (mediaType == "video") {
                    this._mediaType = "video";
                } else {
                    throw new Error('Unrecognised media type: ' + mediaType);
                }

                this.videoPlayerState = {
                    durationSeconds  : 0,
                    currentTime: 0,
                    playbackRate: undefined,
                    paused: false,
                    ended: false,
                    seeking: false,
                    playing: false
                };

                this.registerEventHandlers();
            },

            registerEventHandlers : function() {

                // All functions attached to the window that start SamsungMapleOn
                // will be intercepted and logged, only when test/emit_video_events.js is included
                // for cucumber. Only those that are attached to the window will be intercepted, not
                // functions attached later.
                var self = this;

                window.SamsungMapleOnBufferingStart = function() {
                    self._eventHandlingCallback(new MediaEvent("waiting", self));
                };
                this.playerPlugin.OnBufferingStart = 'SamsungMapleOnBufferingStart';

                window.SamsungMapleOnBufferingComplete = function() {
                    self._eventHandlingCallback(new MediaEvent("playing", self));
                };
                this.playerPlugin.OnBufferingComplete = 'SamsungMapleOnBufferingComplete';

                window.SamsungMapleOnConnectionFailed = function() {
                    self._eventHandlingCallback(new MediaErrorEvent(self, "Connection failed"));
                };
                this.playerPlugin.OnConnectionFailed = 'SamsungMapleOnConnectionFailed';

                window.SamsungMapleOnNetworkDisconnected = function() {
                    self._eventHandlingCallback(new MediaErrorEvent(self, "Network disconnected"));
                };
                this.playerPlugin.OnNetworkDisconnected = 'SamsungMapleOnNetworkDisconnected';

                window.SamsungMapleOnRenderError = function() {
                    self._eventHandlingCallback(new MediaErrorEvent(self, "Render error"));
                };
                this.playerPlugin.OnRenderError = 'SamsungMapleOnRenderError';

                window.SamsungMapleOnStreamNotFound = function() {
                    self._eventHandlingCallback(new MediaErrorEvent(self, "Stream not found"));
                };
                this.playerPlugin.OnStreamNotFound = 'SamsungMapleOnStreamNotFound';

                window.SamsungMapleOnRenderingComplete = function () {
                    self.videoPlayerState.ended = true;
                    window.SamsungMapleOnTimeUpdate(self.videoPlayerState.durationSeconds);
                    self._eventHandlingCallback(new MediaEvent("ended", self));
                };
                this.playerPlugin.OnRenderingComplete = 'SamsungMapleOnRenderingComplete';

                window.SamsungMapleOnStreamInfoReady = function () {
                    self.videoPlayerState.durationSeconds = self.playerPlugin.GetDuration() / 1000;
                    self._eventHandlingCallback(new MediaEvent("loadedmetadata", self));
                    self._eventHandlingCallback(new MediaEvent("durationchange", self));
                    self._eventHandlingCallback(new MediaEvent("canplay", self));
                    self._eventHandlingCallback(new MediaEvent("canplaythrough", self));

                };
                this.playerPlugin.OnStreamInfoReady = 'SamsungMapleOnStreamInfoReady';

                window.SamsungMapleOnCurrentPlayTime = function (timeMs) {
                    var seconds = timeMs / 1000.0;
                    if ((self.mediaSource.isLiveStream() && self.videoPlayerState.ended == false) ||
                        (seconds >= 0 && seconds < self.videoPlayerState.durationSeconds)) {
                        self.videoPlayerState.currentTime = seconds;
                        if (self.videoPlayerState.seeking) {
                            self.videoPlayerState.seeking = false;
                            self._eventHandlingCallback(new MediaEvent('seeked', self));
                        }
                        if (self.videoPlayerState.playing === false) {
                            self._eventHandlingCallback(new MediaEvent('play', self));
                            self._eventHandlingCallback(new MediaEvent('playing', self));
                            self.videoPlayerState.playing = true;
                        }
                        else {
                            // don't throw a timeupdate on the first event
                            window.SamsungMapleOnTimeUpdate(seconds);
                        }
                    }
                };
                this.playerPlugin.OnCurrentPlayTime = 'SamsungMapleOnCurrentPlayTime';

                window.SamsungMapleOnTimeUpdate = function(seconds) {
                    self._eventHandlingCallback(new MediaEvent("timeupdate", self));
                };
            },

            render: function(device) {
                if (!this.outputElement) {
                    this.outputElement = document.createElement("div");
                }
                return this.outputElement;
            },

            // (not part of HTML5 media)
            setWindow: function(left, top, width, height) {
                if (this._mediaType == "audio") {
                    throw new Error('Unable to set window size for Samsung audio.');
                }
                this.playerPlugin.SetDisplayArea(left, top, width, height);
            },
            // readonly attribute MediaError error;
            getError: function() {
                // TODO: Samsung implementation
            },
            // Similar to src attribute or 'source' child elements:
            // attribute DOMString src;
            setSources: function(sources, tags) {
                this.videoPlayerState = {
                    durationSeconds  : 0,
                    currentTime: 0,
                    playbackRate: undefined,
                    paused: false,
                    ended: false,
                    seeking: false,
                    playing: false
                };

                this.mediaSource = sources[0];
                this.playerPlugin.Stop();
                // SamsungMaple.pluginAPI.setOffScreenSaver(); // @see http://www.samsungdforum.com/Board/FAQView?BoardID=28797
                this.tvmwPlugin.SetMediaSource();

                this._getSamsungFormattedUrl = this.mediaSource.getURL(tags);
                if (this.mediaSource.isLiveStream()) {
                    this._getSamsungFormattedUrl += "|COMPONENT=HLS";
                }

                this._resetVideoSize();
            },
            getSources: function() {
                return [this.mediaSource];
            },
            // readonly attribute DOMString currentSrc;
            getCurrentSource: function() {
                return this.mediaSource.src;
            },
            /*
             const unsigned short NETWORK_EMPTY = 0;
             const unsigned short NETWORK_IDLE = 1;
             const unsigned short NETWORK_LOADING = 2;
             const unsigned short NETWORK_NO_SOURCE = 3;
             readonly attribute unsigned short networkState;
             */
            getNetworkState: function() {
                // TODO: Samsung implementation
            },
            // attribute DOMString preload;
            // @returns "none", "metadata" or "auto"
            getPreload: function() {
                // TODO: Samsung implementation
                return "none";
            },
            setPreload: function(preload) {
                // TODO: Samsung implementation
            },
            // readonly attribute TimeRanges buffered;
            getBuffered: function() {
                // TODO: Samsung implementation
                return [];
            },
            // void load();
            load: function() {
                this.videoPlayerState.playbackRate = 1;
                this.videoPlayerState.paused = false;
                this.videoPlayerState.ended = false;
                this.videoPlayerState.playing = false;

                if (this.videoPlayerState.currentTime > 0) {
                    this.playerPlugin.ResumePlay(this._getSamsungFormattedUrl, this.videoPlayerState.currentTime);
                }
                else {
                    this.playerPlugin.Play(this._getSamsungFormattedUrl);
                }
            },
            // DOMString canPlayType(in DOMString type);
            canPlayType: function(type) {
                // TODO: Samsung implementation
                return true;
            },
            /*
             const unsigned short HAVE_NOTHING = 0;
             const unsigned short HAVE_METADATA = 1;
             const unsigned short HAVE_CURRENT_DATA = 2;
             const unsigned short HAVE_FUTURE_DATA = 3;
             const unsigned short HAVE_ENOUGH_DATA = 4;
             readonly attribute unsigned short readyState;
             */
            getReadyState: function() {
                // TODO: Samsung implementation
                return 0;
            },
            // readonly attribute boolean seeking;
            getSeeking: function() {
                // TODO: Samsung implementation
                return false;
            },
            // attribute double currentTime;
            setCurrentTime: function(timeToSeekTo) {
                var offsetInSeconds = timeToSeekTo - this.videoPlayerState.currentTime;
                if (offsetInSeconds > 0) {
                    var jumped = this.playerPlugin.JumpForward(offsetInSeconds);
                    // Jump forward appears not to work consistently in the initial moments of a video playback.
                    // if we are in the initial set up, lets try resuming instead
                    // Samsung 2010 returns -1 for failure. Newer API returns false.
                    if ((!jumped || jumped < 0) && this.videoPlayerState.currentTime < 1) {
                        this.playerPlugin.Stop();
                        this._resetVideoSize();
                        this.playerPlugin.ResumePlay(this._getSamsungFormattedUrl, timeToSeekTo);
                    }
                } else if (offsetInSeconds < 0) {
                    this.playerPlugin.JumpBackward(Math.abs(offsetInSeconds));
                }
                this.videoPlayerState.seeking = true;
                this._eventHandlingCallback(new MediaEvent('seeking', this));
                this.videoPlayerState.currentTime = timeToSeekTo;
            },
            getCurrentTime: function() {
                // TODO: Samsung implementation
                return this.videoPlayerState.currentTime;
            },
            // readonly attribute double initialTime;
            getInitialTime: function() {
                // TODO: Samsung implementation
                return 0;
            },
            // readonly attribute double duration;
            getDuration: function() {
                // TODO: Samsung implementation
                return this.videoPlayerState.durationSeconds;
            },
            // readonly attribute Date startOffsetTime;
            getStartOffsetTime: function() {
                // TODO: Samsung implementation
                return 0;
            },
            // readonly attribute boolean paused;
            getPaused: function() {
                return this.videoPlayerState.paused;
            },
            // attribute double defaultPlaybackRate;
            getDefaultPlaybackRate: function() {
                // TODO: Samsung implementation
                return 1;
            },
            // attribute double playbackRate;
            getPlaybackRate: function() {
                // TODO: Samsung implementation
                return 1;
            },
            setPlaybackRate: function(playbackRate) {
                // TODO: Samsung implementation
            },
            // readonly attribute TimeRanges played;
            getPlayed: function() {
                // TODO: Samsung implementation
                return [];
            },
            // readonly attribute TimeRanges seekable;
            getSeekable: function() {
                // TODO: Samsung implementation
                return [];
            },
            // readonly attribute boolean ended;
            getEnded: function() {
                // TODO: Samsung implementation
                return false;
            },
            // attribute boolean autoplay;
            getAutoPlay: function() {
                // TODO: Samsung implementation
                return false;
            },
            setAutoPlay: function(autoplay) {
                // TODO: Samsung implementation
            },
            // attribute boolean loop;
            getLoop: function() {
                // TODO: Samsung implementation
                return false;
            },
            setLoop: function(loop) {
                // TODO: Samsung implementation
            },
            // void play();
            play: function() {
                if (this.videoPlayerState.paused) {
                    this.playerPlugin.Resume();
                    this.videoPlayerState.paused = false;
                    this._eventHandlingCallback(new MediaEvent("play", this));
                    this._eventHandlingCallback(new MediaEvent("playing", this));
                }
            },
            stop: function() {
                this.playerPlugin.Stop();
            },
            // void pause();
            pause: function() {
                var self = this;
                self.playerPlugin.Pause();
                self.videoPlayerState.paused = true;
                window.setTimeout(function() {
                    self._eventHandlingCallback(new MediaEvent("pause", self))
                }, 0);
            },
            // attribute boolean controls;
            setNativeControls: function(controls) {
                // TODO: Samsung implementation
            },
            getNativeControls: function() {
                // TODO: Samsung implementation
                return false;
            },
            destroy: function() {
                this.stop();
            },
            _resetVideoSize: function() {
                // Workaround for the Samsung 2010 device: video playback starts in a small window by default.
                if (this._mediaType === "video") {
                    var dimensions = Application.getCurrentApplication().getDevice().getScreenSize();
                    this.setWindow(0, 0, dimensions.width, dimensions.height);
                }
            },

            _addExitStrategyEventListener: function() {
              var self = this;
              window.addEventListener('hide', function() {
                self.playerPlugin.Stop();
                self.tvmwPlugin.SetSource(self.originalSource);
              }, false);
            }
        });

        Device.prototype.createMediaInterface = function(id, mediaType, eventCallback) {
            return new SamsungPlayer(id, mediaType, eventCallback);
        };

        Device.prototype.getPlayerEmbedMode = function(mediaType) {
            return MediaInterface.EMBED_MODE_BACKGROUND;
        };
        /**
         * Check to see if volume control is supported on this device.
         * @returns Boolean true if volume control is supported.
         */
        Device.prototype.isVolumeControlSupported = function() {
            return true;
        };
        /**
         * Get the current volume.
         * @returns The current volume (0.0 to 1.0)
         */
        Device.prototype.getVolume = function() {
            var audio = document.getElementById('audioPlugin');
            return invertAudioLevelCorrection(audio.GetVolume());
        };
        /**
         * Set the current volume.
         * @param {Float} volume The new volume level (0.0 to 1.0).
         */
        Device.prototype.setVolume = function(volume) {
            var audio = document.getElementById('audioPlugin');
            if (volume > 1.0) {
                this.getLogger().warn("Samsung setVolume - Invalid volume specified (" + volume + " > 1.0). Clipped to 1.0");
                volume = 1.0;
            } else if (volume < 0.0) {
                this.getLogger().warn("Samsung setVolume - Invalid volume specified (" + volume + " < 0.0). Clipped to 0.0");
                volume = 0;
            }

            var currentVolume = audio.GetVolume();
            var newVolume = audioLevelCorrection(volume);

            if ((newVolume > currentVolume) && (newVolume - currentVolume < 1.0)) {
                newVolume = currentVolume + 1;
            } else if ((newVolume < currentVolume) && (currentVolume - newVolume < 1.0)) {
                newVolume = currentVolume - 1;
            }
            audio.SetVolume(newVolume);
            return newVolume;
        };
        /**
         * Check to see if the volume is currently muted.
         * @returns Boolean true if the device is currently muted. Otherwise false.
         */
        Device.prototype.getMuted = function() {
            var audio = document.getElementById('audioPlugin');
            return audio.GetSystemMute();
        };
        /**
         * Mute or unmute the device.
         * @param {Boolean} muted The new muted state. Boolean true to mute, false to unmute.
         */
        Device.prototype.setMuted = function(muted) {
            var audio = document.getElementById('audioPlugin');
            audio.SetSystemMute(muted);
        };

        return SamsungPlayer;
    }
);
