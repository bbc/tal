/**
 * @fileOverview Requirejs module containing PS3 native video and audio media wrapper
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
	'antie/devices/media/ps3native',
	[
		'antie/devices/device', 
		'antie/devices/ps3base',
		'antie/widgets/media',
		'antie/events/mediaevent',
		'antie/mediasource'
	],
	function(Device, PS3BaseDevice, Media, MediaEvent, MediaSource) {
		var PS3NativePlayer = Media.extend({
			init: function(id, mediaType) {
				this._super(id);
				var device = this.getCurrentApplication().getDevice();
				this._mediaElement = device._createElement("div", this.id, this.getClasses());

				this._stoppedRecievedCount = 0;
				this._bufferingRecieved = false;
				this._duration = false;
				this._currentTime = 0;
				this._updateInterval = null;
				this._playerState = null;
				this._mediaType = null;
				this._seeking = false;

				this._loaded = false;
				this._destroyed = false;

				// Device must be a PS3BaseDevice
				if(!(device instanceof PS3BaseDevice)) {
					throw new Error('PS3Native media wrapper may only be used with PS3 devices');
				}

				device.nativeCommand("setVideoPortalSize", {ltx:-1, lty:1});

				var self = this;
				this._onPlayerStatusChange = function(evt) {
					var lastPlayerState = self._playerState;

					self._playerState = evt.playerState;

					if(self._destroyed) {
						device.removeNativeEventListener('playerStatusChange', arguments.callee);
						self.stop();
						return;
					}

					switch(evt.playerState) {
						case "stopped":
							self._stoppedRecievedCount++;
							if(self._bufferingRecieved && (self._stoppedRecievedCount == 1)) {
								// When auto-play is false
								self._loaded = true;
								self.bubbleEvent(new MediaEvent("canplay", self));
							}
							if(self._updateInterval) {
								window.clearInterval(self._updateInterval);
								self._updateInterval = false;
							}
							self._seeking = false;
							break;
						case "buffering":
							self._bufferingRecieved = true;
							self.bubbleEvent(new MediaEvent("waiting", self));
							break;
						case "playing":
							if(!self._updateInterval) {
								self._updateInterval = window.setInterval(function() {
									if(!self._seeking) {
										device.nativeCommand('getPlaybackTime', null, function(times) {
											self._currentTime = times.elapsedTime;
											if(self._duration === false) {
												self._duration = times.totalTime;
												self.bubbleEvent(new MediaEvent("loadedmetadata", self));
											}
											self.bubbleEvent(new MediaEvent("timeupdate", self));
										});
									}
								}, 900);
							}
							if(!self._loaded) {
								// When auto-play is true
								self._loaded = true;
								self.bubbleEvent(new MediaEvent("canplay", self));
								self.bubbleEvent(new MediaEvent("play", self));
							} else if(lastPlayerState !== "playing" && lastPlayerState !== "buffering") {
								self.bubbleEvent(new MediaEvent("play", self));
							}
							self._seeking = false;
							self.bubbleEvent(new MediaEvent("playing", self));
							break;
						case "paused":
							self.bubbleEvent(new MediaEvent("pause", self));
							break;
						case "endOfStream":
							self.bubbleEvent(new MediaEvent("ended", self));
							self._seeking = false;
							self._loaded = false;
							break;
					}
				};
				device.addNativeEventListener('playerStatusChange', this._onPlayerStatusChange);
			},
			render: function(device) {
				if(this.outputElement !== this._mediaElement) {
					this.outputElement = this._mediaElement;
				}
				return this._mediaElement;
			},
			// (not part of HTML5 media)
			setWindow: function(left, top, width, height) {
				var device = this.getCurrentApplication().getDevice();
				device.setElementSize(this._mediaElement, {width:width, height:height});
				device.setElementPosition(this._mediaElement, {left:left, top:top});
			},
			// readonly attribute MediaError error;
			getError: function() {
				return this._mediaElement.error;
			},
			// Similar to src attribute or 'source' child elements:
			// attribute DOMString src;
			setSources: function(sources, tags) {
				if(sources.length > 0) {
					this._src =  sources[0].getURL(tags);
					this._mediaType = sources[0].getContentType();
				}
			},
			getSources: function() {
				return [new MediaSource(this._src, this._mediaType)];
			},
			// readonly attribute DOMString currentSrc;
			getCurrentSource: function() {
				return this._src;
			},
			/*
			const unsigned short NETWORK_EMPTY = 0;
			const unsigned short NETWORK_IDLE = 1;
			const unsigned short NETWORK_LOADING = 2;
			const unsigned short NETWORK_NO_SOURCE = 3;
			readonly attribute unsigned short networkState;
			*/
			getNetworkState: function() {
				throw new Error("Not implemented");
			},
			// attribute DOMString preload;
			// @returns "none", "metadata" or "auto"
			getPreload: function() {
				throw new Error("Not implemented");
			},
			setPreload: function(preload) {
				throw new Error("Not implemented");
			},
			// readonly attribute TimeRanges buffered;
			getBuffered: function() {
				return 0;
			},
			// void load();
			load: function() {
				this.stop();

				var device = this.getCurrentApplication().getDevice();
				device.nativeCommand("load", {fileName: this._src});
			},
			// DOMString canPlayType(in DOMString type);
			canPlayType: function(type) {
				throw new Error("Not implemented");
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
				throw new Error("Not implemented");
			},
			// readonly attribute boolean seeking;
			getSeeking: function() {
				return this._seeking;
			},
			// attribute double currentTime;
			setCurrentTime: function(currentTime) {
				this._seeking = true;

				var device = this.getCurrentApplication().getDevice();
				// PS3 can't seek to end
				if((this._duration > 0) && (currentTime >= this._duration)) {
					this.pause();
					this.bubbleEvent(new MediaEvent("ended", this));
				} else {
					if(!this._loaded) {
						device.addNativeEventListener('playerStatusChange', function(evt) {
							if(evt.playerState === "playing") {
								device.removeNativeEventListener('playerStatusChange', arguments.callee);
								device.nativeCommand("setPlayTime", {playTime: Math.floor(currentTime)});
							}
						});
						this.load();
					} else {
						device.nativeCommand("setPlayTime", {playTime: Math.floor(currentTime)});
					}
				}
			},
			getCurrentTime: function() {
				return this._currentTime;
			},
			// readonly attribute double initialTime;
			getInitialTime: function() {
				throw new Error("Not implemented");
			},
			// readonly attribute double duration;
			getDuration: function() {
				return this._duration;
			},
			// readonly attribute Date startOffsetTime;
			getStartOffsetTime: function() {
				return 0;
			},
			// readonly attribute boolean paused;
			getPaused: function() {
				return this._playerState == "paused";
			},
			// attribute double defaultPlaybackRate;
			getDefaultPlaybackRate: function() {
				return 1;
			},
			// attribute double playbackRate;
			getPlaybackRate: function() {
				return 1;
			},
			setPlaybackRate: function(playbackRate) {
				throw new Error("Not implemented");
			},
			// readonly attribute TimeRanges played;
			getPlayed: function() {
				throw new Error("Not implemented");
			},
			// readonly attribute TimeRanges seekable;
			getSeekable: function() {
				throw new Error("Not implemented");
			},
			// readonly attribute boolean ended;
			getEnded: function() {
				throw new Error("Not implemented");
			},
			// attribute boolean autoplay;
			getAutoPlay: function() {
				throw new Error("Not implemented");
			},
			setAutoPlay: function(autoplay) {
				throw new Error("Not implemented");
			},
			// attribute boolean loop;
			getLoop: function() {
				throw new Error("Not implemented");
			},
			setLoop: function(loop) {
				throw new Error("Not implemented");
			},
			// void play();
			play: function() {
				if(!this._loaded || (this._playerState == "playing")) {
					return;
				}
				var device = this.getCurrentApplication().getDevice();
				device.nativeCommand("play");
			},
			// NOT IN HTML5 but needed by many devices
			stop: function() {
				//if(!this._loaded || (this._playerState == "stopped")) {
					//return;
				//}
				this._loaded = false;

				var device = this.getCurrentApplication().getDevice();
				device.nativeCommand("stop");

				if(this._updateInterval) {
					window.clearInterval(this._updateInterval);
					this._updateInterval = false;
				}
			},
			// void pause();
			pause: function() {
				if(!this._loaded || (this._playerState == "paused")) {
					return;
				}
				var device = this.getCurrentApplication().getDevice();
				device.nativeCommand("pause");
			},
			// attribute boolean controls;
			setNativeControls: function(controls) {
				if(controls) {
					throw new Error("Not supported");
				}
			},
			getNativeControls: function() {
				return false;
			},
			destroy: function() {
				// Dont remove the playerStatusChange handler here... Sometimes WebMAF ignores the next stop command and will keep playing
				// in the background. By keeping hold of playerStatusChange and calling stop in there (when this._destroyed is set to true)
				// we can ensure playback is really stopped

				this._destroyed = true;
				this.stop();
			}
		});
		Device.prototype.createPlayer = function(id, mediaType) {
			return new PS3NativePlayer(id, mediaType);
		};
		Device.prototype.getPlayerEmbedMode = function(mediaType) {
			return Media.EMBED_MODE_BACKGROUND;
		};
	}
);
