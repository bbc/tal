/**
 * @fileOverview Requirejs module containing samsung maple media wrapper
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def(
    'antie/devices/media/samsung_maple',
    [
        'antie/devices/device',
        'antie/widgets/media',
        'antie/events/mediaevent',
        'antie/events/mediaerrorevent',
        'antie/events/mediasourceerrorevent',
        'antie/mediasource'
    ],
    function(Device, Media, MediaEvent, MediaErrorEvent, MediaSourceErrorEvent, MediaSource) {
		function audioLevelCorrection(t) {
			return t * 40.0;
		}
 		function invertAudioLevelCorrection(x) {
			 return x / 40.0;
		}
        var SamsungPlayer = Media.extend({
            init: function(id, mediaType) {
                this._super(id);

                this.playerPlugin = document.getElementById('playerPlugin');
                this.audioPlugin = document.getElementById('audioPlugin');
                this.tvmwPlugin = document.getElementById('pluginObjectTVMW');
                this.originalSource = this.tvmwPlugin.GetSource();

				this.mediaSource = null;

				var self = this;
				window.addEventListener('unload', function () {
					self.playerPlugin.Stop();
					self.tvmwPlugin.SetSource(self.originalSource);
				}, false);

                if (mediaType == "audio") {
                    this._mediaType = "audio";
                } else if (mediaType == "video") {
                    this._mediaType = "video";
                } else {
                    throw new Error('Unrecognised media type: ' + mediaType);
                }

                this.videoPlayerState = {
                    durationSeconds  : 0,
                    currentTime: undefined,
                    playbackRate: undefined,
                    paused: false,
                    ended: false
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
					self.bubbleEvent(new MediaEvent("waiting", self));
				};
				this.playerPlugin.OnBufferingStart = 'SamsungMapleOnBufferingStart';

				window.SamsungMapleOnBufferingComplete = function() {
					self.bubbleEvent(new MediaEvent("playing", self));
				};
				this.playerPlugin.OnBufferingComplete = 'SamsungMapleOnBufferingComplete';

                window.SamsungMapleOnConnectionFailed = function() {
                    self.bubbleEvent(new MediaErrorEvent(self, "Connection failed"));
                };
                this.playerPlugin.OnConnectionFailed = 'SamsungMapleOnConnectionFailed';

                window.SamsungMapleOnNetworkDisconnected = function() {
                    self.bubbleEvent(new MediaErrorEvent(self, "Network disconnected"));
                };
                this.playerPlugin.OnNetworkDisconnected = 'SamsungMapleOnNetworkDisconnected';

                window.SamsungMapleOnRenderError = function() {
                    self.bubbleEvent(new MediaErrorEvent(self, "Render error"));
                };
                this.playerPlugin.OnRenderError = 'SamsungMapleOnRenderError';

                window.SamsungMapleOnStreamNotFound = function() {
                    self.bubbleEvent(new MediaErrorEvent(self, "Stream not found"));
                };
                this.playerPlugin.OnStreamNotFound = 'SamsungMapleOnStreamNotFound';

                window.SamsungMapleOnVideoPlay = function (videoUrl) {
                    self.videoPlayerState.paused = false;
                    self.bubbleEvent(new MediaEvent("play", self));
                };

                window.SamsungMapleOnVideoPause = function () {
                    self.videoPlayerState.paused = true;
                    self.bubbleEvent(new MediaEvent("pause", self));
                };
                this.playerPlugin.OnVideoPause = 'SamsungMapleOnVideoPause';

                window.SamsungMapleOnVideoResume = function () {
                    self.videoPlayerState.paused = false;
                    self.bubbleEvent(new MediaEvent("play", self));
                };
                this.playerPlugin.OnVideoResume = 'SamsungMapleOnVideoResume';

                window.SamsungMapleOnRenderingComplete = function () {
                    self.videoPlayerState.ended = true;
                    window.SamsungMapleOnTimeUpdate(self.videoPlayerState.durationSeconds);
                    self.bubbleEvent(new MediaEvent("ended", self));
                };
                this.playerPlugin.OnRenderingComplete = 'SamsungMapleOnRenderingComplete';

                window.SamsungMapleOnStreamInfoReady = function () {
                    self.videoPlayerState.durationSeconds = self.playerPlugin.GetDuration() / 1000;
                    self.bubbleEvent(new MediaEvent("loadedmetadata", self));
                    self.bubbleEvent(new MediaEvent("durationchange", self));
	                if(self._loading) {
				self.pause();
		                self.bubbleEvent(new MediaEvent("canplay", self));
                        	self.bubbleEvent(new MediaEvent("canplaythrough", self));
		                self._loading = false;
	                }
                };
                this.playerPlugin.OnStreamInfoReady = 'SamsungMapleOnStreamInfoReady';

                window.SamsungMapleOnCurrentPlayTime = function (timeMs) {
                    var seconds = timeMs / 1000.0;
                    // videos can raise incorrect elapsed time for a variety of encoding issues
                    if (seconds >= 0 && seconds < self.videoPlayerState.durationSeconds) {
                        self.videoPlayerState.currentTime = seconds;
                        window.SamsungMapleOnTimeUpdate(seconds);
                    }
                };
                this.playerPlugin.OnCurrentPlayTime = 'SamsungMapleOnCurrentPlayTime';

				window.SamsungMapleOnTimeUpdate = function(seconds) {
					self.bubbleEvent(new MediaEvent("timeupdate", self));
				};

            },

            render: function(device) {
				if (!this.outputElement){
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
				this.mediaSource = sources[0];
                this.playerPlugin.Stop();
                // SamsungMaple.pluginAPI.setOffScreenSaver(); // @see http://www.samsungdforum.com/Board/FAQView?BoardID=28797
                this.tvmwPlugin.SetMediaSource();

				this._samsungSpecialSauce = this.mediaSource.getURL(tags);
				if(this.mediaSource.isLiveStream()) {
                	this._samsungSpecialSauce += "|COMPONENT=HLS";
				}
				this.playerPlugin.InitPlayer(this._samsungSpecialSauce);
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

                this.videoPlayerState.currentTime = 0;
                this.videoPlayerState.playbackRate = 1;
                this.videoPlayerState.paused = false;
                this.videoPlayerState.ended = false;

	        this._loading = true;
                this.playerPlugin.StartPlayback();
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
            setCurrentTime: function(currentTime) {
                // TODO: Samsung implementation
                // TODO: This doesn't do anything useful!
                this.videoPlayerState.currentTime = currentTime;
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
                // TODO: Samsung implementation
                return false;
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

                this.playerPlugin.StartPlayback();
                window.SamsungMapleOnVideoPlay(this._samsungSpecialSauce);
            },
            stop: function() {
                this.playerPlugin.Stop();
            },
            // void pause();
            pause: function() {
                this.playerPlugin.Pause();
                //this.bubbleEvent(new MediaEvent("pause", self));
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
            }
        });

        Device.prototype.createPlayer = function(id, mediaType) {
            return new SamsungPlayer(id, mediaType);
        };
        Device.prototype.getPlayerEmbedMode = function(mediaType) {
            return Media.EMBED_MODE_BACKGROUND;
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
			if(volume > 1.0	) {
				this.getLogger().warn("Samsung setVolume - Invalid volume specified (" + volume + " > 1.0). Clipped to 1.0");
				volume = 1.0;
			} else if(volume < 0.0) {
				this.getLogger().warn("Samsung setVolume - Invalid volume specified (" + volume + " < 0.0). Clipped to 0.0");
				volume = 0;
			}

			var currentVolume = audio.GetVolume();
			var newVolume = audioLevelCorrection(volume);

			if((newVolume > currentVolume) && (newVolume - currentVolume < 1.0)) {
				newVolume = currentVolume + 1;
			} else if((newVolume < currentVolume) && (currentVolume - newVolume < 1.0)) {
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
    }
);
