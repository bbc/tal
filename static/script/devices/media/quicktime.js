/**
 * @fileOverview Requirejs module containing QuickTime video and audio media wrapper
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
	'antie/devices/media/quicktime',
	[
		'antie/devices/device',
		'antie/widgets/media',
		'antie/events/mediaevent',
		'antie/mediasource'
	],
	function(Device, Media, MediaEvent, MediaSource) {
		var QuickTimePlayer = Media.extend({
			init: function(id, mediaType) {
				this._super(id);

				if(mediaType == "audio") {
					this._mediaType = "audio";
				} else if(mediaType == "video") {
					this._mediaType = "video";
				} else {
					throw new Error('Unrecognised media type: ' + mediaType);
				}
				this._contentType = null;

				this._paused = true;
				this._timeupdateHandle = null;

				// Create the DOM element now so the wrapped functions can modify attributes
				// before it is placed in the Document during rendering.
				var device = this.getCurrentApplication().getDevice();
				this._mediaElement = device._createElement("embed", this.id, this.getClasses());
				this._mediaElement.setAttribute("type", "video/quicktime");
				this._mediaElement.setAttribute("pluginspace", "http://www.apple.com/qtactivex/qtplugin.cab");
				this._mediaElement.setAttribute("EnableJavaScript", "true");
				this._mediaElement.setAttribute("postdomevents", "true");
				this._mediaElement.setAttribute("kioskmode", "true");
				this._mediaElement.setAttribute("bgcolor", "#000000");
				this._mediaElement.name = this.id;
			},
			render: function(device) {
				if(this.outputElement !== this._mediaElement) {
					this.outputElement = this._mediaElement;

					// Convert all media events into our internal representation and bubble them through
					// the UI widgets
					var self = this;
					function eventWrapper(evt) {
						log(evt);
						self.bubbleEvent(new MediaEvent(evt.type.replace(/^qt_/,''), self));
					};
					this._mediaElement.addEventListener("qt_loadedmetadata", function() {
						self.bubbleEvent(new MediaEvent("loadedmetadata", self));
					}, true);
					function timeChanged() {
						self.bubbleEvent(new MediaEvent("timeupdate", self));
					};
					this._mediaElement.addEventListener("qt_timechanged", timeChanged, true);

					this._mediaElement.addEventListener("qt_canplay", function() {
						self.bubbleEvent(new MediaEvent("canplay", self));
					}, true);
					this._mediaElement.addEventListener("qt_play", function() {
						self._paused = false;
						self.bubbleEvent(new MediaEvent("play", self));
						self.bubbleEvent(new MediaEvent("playing", self));
						if(!self._timeupdateHandle) {
							self._timeupdateHandle = window.setInterval(timeChanged, 500);
						}
					}, true);
					this._mediaElement.addEventListener("qt_pause", function() {
						if(self._timeupdateHandle) {
							window.clearInterval(self._timeupdateHandle);
							self._timeupdateHandle = null;
						}
						self._paused = true;
						self.bubbleEvent(new MediaEvent("pause", self));
					}, true);
					this._mediaElement.addEventListener("qt_ended", function() {
						self.bubbleEvent(new MediaEvent("ended", self));
					}, true);
					this._mediaElement.addEventListener("qt_stalled", function() {
						self.bubbleEvent(new MediaEvent("stalled", self));
					}, true);
				}

				if(this._src) {
					this._mediaElement.src = this._src;
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
				this._src = sources[0].getURL(tags);
				this._contentType = sources[0].getContentType();
				if(this._mediaElement.SetURL) {
					this._mediaElement.SetURL(this._src);
				}
			},
			getSources: function() {
				return [new MediaSource(this._src, this._contentType)];
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
				return this._mediaElement.GetMaxTimeLoaded();
			},
			// void load();
			load: function() {
				var device = this.getCurrentApplication().getDevice();
				device.getLogger().warn("quicktime::load() not implemented");
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
				throw new Error("Not implemented");
			},
			// attribute double currentTime;
			setCurrentTime: function(currentTime) {
				log(currentTime);
				log(this._mediaElement.GetTimeScale());
				log(currentTime * this._mediaElement.GetTimeScale());
				this._mediaElement.SetTime(currentTime * this._mediaElement.GetTimeScale());
			},
			getCurrentTime: function() {
				return this._mediaElement.GetTime() / this._mediaElement.GetTimeScale();
			},
			// readonly attribute double initialTime;
			getInitialTime: function() {
				return this._mediaElement.GetStartTime() / this._mediaElement.GetTimeScale();
			},
			// readonly attribute double duration;
			getDuration: function() {
				return this._mediaElement.GetDuration() / this._mediaElement.GetTimeScale();
			},
			// readonly attribute Date startOffsetTime;
			getStartOffsetTime: function() {
				return 0;
			},
			// readonly attribute boolean paused;
			getPaused: function() {
				return this._paused;
			},
			// attribute double defaultPlaybackRate;
			getDefaultPlaybackRate: function() {
				return this._mediaElement.GetRate();
			},
			// attribute double playbackRate;
			getPlaybackRate: function() {
				return this._mediaElement.GetRate();
			},
			setPlaybackRate: function(playbackRate) {
				this._mediaElement.SetRate(playbackRate);
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
				return this._mediaElement.GetAutoPlay();
			},
			setAutoPlay: function(autoplay) {
				this._mediaElement.SetAutoPlay(autoplay);
			},
			// attribute boolean loop;
			getLoop: function() {
				return this._mediaElement.GetIsLooping();
			},
			setLoop: function(loop) {
				this._mediaElement.SetIsLooping(loop);
			},
			// void play();
			play: function() {
				this._mediaElement.Play();
			},
			stop: function() {
				this.pause();
			},
			// void pause();
			pause: function() {
				try {
					this._mediaElement.Stop();
					if(this._timeupdateHandle) {
						window.clearInterval(this._timeupdateHandle);
						this._timeupdateHandle = null;
					}
				} catch(ex) {
					var device = this.getCurrentApplication().getDevice();
					device.getLogger().warn("Unable to pause:", ex);
				}
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
				this.stop();

				var device = this.getCurrentApplication().getDevice();
				device.removeElement(this._mediaElement);
			}
		});

		Device.prototype.createPlayer = function(id, mediaType) {
			return new QuickTimePlayer(id, mediaType);
		};
		Device.prototype.getPlayerEmbedMode = function(mediaType) {
			return Media.EMBED_MODE_EMBEDDED;
		};

		/*
			setVolume: function(volume) {
				this._mediaElement.SetVolume(volume);
			},
			getVolume: function() {
				return this._mediaElement.GetVolume();
			},
			setMuted: function(muted) {
				this._mediaElement.SetMute(muted);
			},
			getMuted: function() {
				return this._mediaElement.GetMute();
			},
		 */
	}
);
