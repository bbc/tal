/* Surpression of JSHint 'Don't make functions within a loop' */
/* jshint -W083 */
/**
 * @fileOverview Requirejs module containing HTML5 video and audio media wrapper
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
    'antie/devices/media/html5',
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

        var currentPlayer = null;
        var isMuted = null;
        var currentVolume = -1;

        var HTML5Player = MediaInterface.extend({
            init: function(id, mediaType, eventHandlingCallback) {
                this._super(id);

                this._eventHandlingCallback = eventHandlingCallback;

                if (mediaType == "audio") {
                    this._mediaType = "audio";
                } else if (mediaType == "video") {
                    this._mediaType = "video";
                } else {
                    throw new Error('Unrecognised media type: ' + mediaType);
                }

                // Create the DOM element now so the wrapped functions can modify attributes
                // before it is placed in the Document during rendering.
                var device = Application.getCurrentApplication().getDevice();
                this._mediaElement = device._createElement(this._mediaType, id);

                if (currentVolume != -1) {
                    this._mediaElement.volume = currentVolume;
                } else {
                    currentVolume = this._mediaElement.volume;
                }
                if (isMuted !== null) {
                    this._mediaElement.muted = isMuted;
                } else {
                    isMuted = this._mediaElement.muted;
                }

                this._eventWrapper = null;
                this._errorEventWrapper = null;
            },
            render: function(device) {
                if (!this._renderCalled) {
                    this._renderCalled = true;

                    // Convert all media events into our internal representation and bubble them through
                    // the UI widgets
                    var self = this;
                    this._eventWrapper = function(evt) {
                        self._eventHandlingCallback(new MediaEvent(evt.type, self));
                    };
                    this._errorEventWrapper = function(evt) {
                        var errCode = self._mediaElement.error ? self._mediaElement.error.code : MediaInterface.MEDIA_ERR_UNKNOWN;
                        self._eventHandlingCallback(new MediaErrorEvent(self, errCode));
                    };
                    for (var i = 0; i < MediaEvent.TYPES.length; i++) {
                        this._mediaElement.addEventListener(MediaEvent.TYPES[i], this._eventWrapper, true);
                    }
                    this._mediaElement.addEventListener("error", this._errorEventWrapper, true);
                }

                return this._mediaElement;
            },
            // (not part of HTML5 media)
            setWindow: function(left, top, width, height) {
                if (this._mediaType == "audio") {
                    throw new Error('Unable to set window size for HTML5 audio.');
                }
                var device = Application.getCurrentApplication().getDevice();
                device.setElementSize(this._mediaElement, {width:width, height:height});
                device.setElementPosition(this._mediaElement, {left:left, top:top});
            },
            // readonly attribute MediaError error;
            getError: function() {
                return this._mediaElement.error;
            },
            _supportsTypeAttribute: function() {
                return true;
            },
            _requiresWebkitMemoryLeakFix: function() {
                return false;
            },
            // Similar to src attribute or 'source' child elements:
            // attribute DOMString src;
            setSources: function(sources, tags) {
                var self = this;
                var device = Application.getCurrentApplication().getDevice();
                var oldSources = this._mediaElement.getElementsByTagName('source');
                var supportsTypeAttribute = this._supportsTypeAttribute();

                while (oldSources.length) {
                    device.removeElement(oldSources[0]);
                }
                for (var i = 0; i < sources.length; i++) {
                    var source = document.createElement('source');
                    if (supportsTypeAttribute) {
                        source.type = sources[i].getContentType();
                    }
                    source.src = sources[i].getURL(tags);

                    device.appendChildElement(this._mediaElement, source);

                    (function(source) {
                        source._errorEventListener = function(evt) {
                            var errCode = self._mediaElement.error ? self._mediaElement.error.code : MediaInterface.MEDIA_ERR_UNKNOWN;
                            self._eventHandlingCallback(new MediaSourceErrorEvent(
                                self,
                                errCode,
                                source.src,
                                self._mediaElement.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
                            ));
                            evt.stopPropagation();
                        };
                        source.addEventListener("error", source._errorEventListener, true);
                    })(source);
                }
            },
            getSources: function() {
                var sources = [];
                if (this._mediaElement.src) {
                    sources.push(new MediaSource(this._mediaElement.src, this._mediaElement.type));
                } else {
                    var sourceElements = this._mediaElement.getElementsByTagName('source');
                    for (var i = 0; i < sourceElements.length; i++) {
                        sources.push(new MediaSource(sourceElements[i].src, sourceElements[i].type));
                    }
                }
                return sources;
            },
            // readonly attribute DOMString currentSrc;
            getCurrentSource: function() {
                // Some browsers URI encode apostrophes, others don't. Make sure they're all URI encoded.
                return this._mediaElement.currentSrc.replace(/'/g, "%27");
            },
            /*
             const unsigned short NETWORK_EMPTY = 0;
             const unsigned short NETWORK_IDLE = 1;
             const unsigned short NETWORK_LOADING = 2;
             const unsigned short NETWORK_NO_SOURCE = 3;
             readonly attribute unsigned short networkState;
             */
            getNetworkState: function() {
                return this._mediaElement.networkState;
            },
            // attribute DOMString preload;
            // @returns "none", "metadata" or "auto"
            getPreload: function() {
                return this._mediaElement.preload;
            },
            setPreload: function(preload) {
                this._mediaElement.preload = preload;
            },
            // readonly attribute TimeRanges buffered;
            getBuffered: function() {
                return this._mediaElement.buffered;
            },
            // void load();
            load: function() {
                return this._mediaElement.load();
            },
            // DOMString canPlayType(in DOMString type);
            canPlayType: function(type) {
                return this._mediaElement.canPlayType(type);
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
                return this._mediaElement.readyState;
            },
            // readonly attribute boolean seeking;
            getSeeking: function() {
                return this._mediaElement.seeking;
            },
            // attribute double currentTime;
            setCurrentTime: function(currentTime) {
                this._mediaElement.currentTime = currentTime;
            },
            getCurrentTime: function() {
                return this._mediaElement.currentTime;
            },
            // readonly attribute double initialTime;
            getInitialTime: function() {
                return this._mediaElement.initialTime;
            },
            // readonly attribute double duration;
            getDuration: function() {
                return this._mediaElement.duration;
            },
            // readonly attribute Date startOffsetTime;
            getStartOffsetTime: function() {
                return this._mediaElement.startOffsetTime;
            },
            // readonly attribute boolean paused;
            getPaused: function() {
                return this._mediaElement.paused;
            },
            // attribute double defaultPlaybackRate;
            getDefaultPlaybackRate: function() {
                return this._mediaElement.defaultPlaybackRate;
            },
            // attribute double playbackRate;
            getPlaybackRate: function() {
                return this._mediaElement.playbackRate;
            },
            setPlaybackRate: function(playbackRate) {
                this._mediaElement.playbackRate = playbackRate;
            },
            // readonly attribute TimeRanges played;
            getPlayed: function() {
                return this._mediaElement.played;
            },
            // readonly attribute TimeRanges seekable;
            getSeekable: function() {
                return this._mediaElement.seekable;
            },
            // readonly attribute boolean ended;
            getEnded: function() {
                return this._mediaElement.ended;
            },
            // attribute boolean autoplay;
            getAutoPlay: function() {
                return this._mediaElement.autoplay;
            },
            setAutoPlay: function(autoplay) {
                this._mediaElement.autoplay = autoplay;
            },
            // attribute boolean loop;
            getLoop: function() {
                return this._mediaElement.loop;
            },
            setLoop: function(loop) {
                this._mediaElement.loop = loop;
            },
            // void play();
            play: function() {
                this._mediaElement.play();
            },
            stop: function() {
                this.pause();
            },
            // void pause();
            pause: function() {
				this._mediaElement.pause();
            },
            // attribute boolean controls;
            setNativeControls: function(controls) {
                this._mediaElement.controls = controls;
            },
            getNativeControls: function() {
                return this._mediaElement.controls;
            },
            destroy: function() {
                this.stop();

                var device = Application.getCurrentApplication().getDevice();
                device.removeElement(this._mediaElement);

                // Remove error event listeners from each source element
                var sourceElements = this._mediaElement.getElementsByTagName("source");

                // Loop through the array backwards as we remove array elements inside the loop body
                var sourceElementsLength = sourceElements.length;
                for (var sourceElementIndex = sourceElementsLength - 1; sourceElementIndex >= 0; sourceElementIndex--) {
                    var sourceElement = sourceElements[sourceElementIndex];
                    sourceElement.removeEventListener('error', sourceElement._errorEventListener, true);
                    device.removeElement(sourceElement);

                    delete sourceElements[sourceElementIndex];
                }

                sourceElements = null;


                // Remove event listeners
                for (var i = 0; i < MediaEvent.TYPES.length; i++) {
                    this._mediaElement.removeEventListener(MediaEvent.TYPES[i], this._eventWrapper, true);
                }
                this._mediaElement.removeEventListener("error", this._errorEventWrapper, true);

                // Trick to abort browser loading threads on certain webkit devices
                if(this._requiresWebkitMemoryLeakFix()) {
                    this.webkitMemoryLeakFix();
                }

                delete this._mediaElement;
                this._mediaElement = null;
                currentPlayer = null;
            },
            webkitMemoryLeakFix : function() {
                // http://stackoverflow.com/questions/5170398/ios-safari-memory-leak-when-loading-unloading-html5-video
				this._mediaElement.removeAttribute("src");
                this._mediaElement.load();
            }
        });

        Device.prototype.createMediaInterface = function(id, mediaType, eventCallback) {
            currentPlayer = new HTML5Player(id, mediaType, eventCallback);
            return currentPlayer;
        };
        Device.prototype.getPlayerEmbedMode = function(mediaType) {
            return MediaInterface.EMBED_MODE_EMBEDDED;
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
            if (currentPlayer) {
                return currentPlayer._mediaElement.volume;
            }
            return currentVolume;
        };
        /**
         * Set the current volume.
         * @param {Float} volume The new volume level (0.0 to 1.0).
         */
        Device.prototype.setVolume = function(volume) {
            if (volume > 1.0) {
                this.getLogger().warn("HTML5 setVolume - Invalid volume specified (" + volume + " > 1.0). Clipped to 1.0");
                volume = 1.0;
            } else if (volume < 0.0) {
                this.getLogger().warn("HTML5 setVolume - Invalid volume specified (" + volume + " < 0.0). Clipped to 0.0");
                volume = 0;
            }
            currentVolume = volume;
            if (currentPlayer) {
                currentPlayer._mediaElement.volume = volume;
            }
        };
        /**
         * Check to see if the volume is currently muted.
         * @returns Boolean true if the device is currently muted. Otherwise false.
         */
        Device.prototype.getMuted = function() {
            if (currentPlayer) {
                return currentPlayer._mediaElement.muted;
            }
            return isMuted;
        };
        /**
         * Mute or unmute the device.
         * @param {Boolean} muted The new muted state. Boolean true to mute, false to unmute.
         */
        Device.prototype.setMuted = function(muted) {
            isMuted = muted;
            if (currentPlayer) {
                currentPlayer._mediaElement.muted = muted;
            }
        };
        return HTML5Player;
    }
);
