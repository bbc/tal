/**
 * @fileOverview Requirejs module containing CE-HTML media wrapper
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
    'antie/devices/media/cehtml',
    [
        'antie/devices/device',
        'antie/devices/media/mediainterface',
        'antie/events/mediaevent',
        'antie/events/mediaerrorevent',
        'antie/events/mediasourceerrorevent',
        'antie/mediasource',
        'antie/devices/media/seekstate',
        'antie/runtimecontext'
    ],

    function(Device, MediaInterface, MediaEvent, MediaErrorEvent, MediaSourceErrorEvent, MediaSource, SeekState, RunTimeContext ) {
        'use strict';

        var CEHTMLPlayer = MediaInterface.extend({
            init: function(id, mediaType, eventHandlingCallback) {
                this._super(id);
                this.id = id;
                this._eventHandlingCallback = eventHandlingCallback;
                this._seekState = new SeekState(this._eventHandlingCallback);

                this._updateInterval = null;
                this._loaded = false;
                this._eventsBound = false;

                var device = RunTimeContext.getDevice();
                this._outputElement = device._createElement("div");

                // Create the DOM element now so the wrapped functions can modify attributes
                // before it is placed in the Document during rendering.
                this._createCEHTMLObjectElement((mediaType == "audio") ? "audio/mp4" : "video/mp4");
                this._mediaElement.width = 1280;
                this._mediaElement.height = 720;

                if (mediaType == "audio") {
                    this._mediaType = "audio";
                } else if (mediaType == "video") {
                    this._mediaType = "video";
                } else {
                    throw new Error('Unrecognised media type: ' + mediaType);
                }
            },
            _createCEHTMLObjectElement: function(contentType) {
                var device = RunTimeContext.getDevice();
                var obj = device._createElement("object", this.id);
                obj.setAttribute("type", contentType);
                obj.style.width = "100%";
                obj.style.height = "100%";
                obj.style.position = "absolute";
                obj.style.zIndex = "-1";
                this._mediaElement = obj;
                this._outputElement.appendChild(this._mediaElement);
            },
            render: function(device) {
                return this._outputElement;
            },
            // (not part of HTML5 media)
            setWindow: function(left, top, width, height) {
                if (this._mediaType == "audio") {
                    throw new Error('Unable to set window size for CE-HTML audio.');
                }
                var device = RunTimeContext.getDevice();
                device.setElementSize(this._mediaElement, {width:width, height:height});
                device.setElementPosition(this._mediaElement, {left:left, top:top});
            },
            // readonly attribute MediaError error;
            getError: function() {
                // TODO: CE-HTML implementation
            },
            // Similar to src attribute or 'source' child elements:
            // attribute DOMString src;
            setSources: function(sources, tags) {
                this._seekState = new SeekState(this._eventHandlingCallback);

                var currentMediaType = this._mediaElement.type;
                var newMediaType = sources[0].getContentType();

                if (currentMediaType !== undefined && currentMediaType !== newMediaType) {
                    if (this._requiresMediaTypeFix()) {
                        var oldDimensions = {
                            left: this._mediaElement.style.left,
                            top: this._mediaElement.style.top,
                            width: this._mediaElement.style.width,
                            height: this._mediaElement.style.height
                        };

                        this.destroy();
                        this._createCEHTMLObjectElement(newMediaType);
                        this.setWindow(oldDimensions.left, oldDimensions.top, oldDimensions.width, oldDimensions.height);
                        this._eventsBound = false;
                    }
                }

                this._mediaElement.type = sources[0].getContentType();
                this._mediaElement.data = sources[0].getURL(tags);

                if (!this._eventsBound) {
                    var self = this;
                    // Convert all media events into our internal representation and bubble them through
                    // the UI widgets
                    // Handle CE-HTML playstate change events
                    // Note: this has to be bound after setting player.data
                    this._mediaElement.onPlayStateChange = function() {
	                if (self._updateInterval) {
		            window.clearInterval(self._updateInterval);
		            self._updateInterval = false;
	                }
                        switch (self._mediaElement.playState) {
                            case CEHTMLPlayer.PLAY_STATE_STOPPED:
                                break;
                            case CEHTMLPlayer.PLAY_STATE_PLAYING:
                                self._seekState.playing();
                                if (!self._loaded) {
                                    self._eventHandlingCallback(new MediaEvent("loadedmetadata", self));
                                    self._eventHandlingCallback(new MediaEvent("canplaythrough", self));
                                    self._loaded = true;
                                }
                                self._eventHandlingCallback(new MediaEvent("play", self));
                                self._eventHandlingCallback(new MediaEvent("playing", self));
                                if (!self._updateInterval) {
                                    self._updateInterval = window.setInterval(function() {
                                        self._eventHandlingCallback(new MediaEvent("timeupdate", self));
                                    }, 900);
                                }
                                break;
                            case CEHTMLPlayer.PLAY_STATE_PAUSED:
                                self._eventHandlingCallback(new MediaEvent("pause", self));
                                break;
                            case CEHTMLPlayer.PLAY_STATE_CONNECTING:
                                self._eventHandlingCallback(new MediaEvent("loadstart", self));
                                break;
                            case CEHTMLPlayer.PLAY_STATE_BUFFERING:
                                self._eventHandlingCallback(new MediaEvent("waiting", self));
                                break;
                            case CEHTMLPlayer.PLAY_STATE_FINISHED:
                                self._eventHandlingCallback(new MediaEvent("ended", self));
                                break;
                            case CEHTMLPlayer.PLAY_STATE_ERROR:
                                self._eventHandlingCallback(new MediaErrorEvent(self, 0));
                                break;
                            default:
                                // do nothing
                                break;
                        }
                    };

                    this._eventsBound = true;
                }
                this._eventHandlingCallback(new MediaEvent("canplay", this));
            },
            getSources: function() {
                return [new MediaSource(this._mediaElement.data, this._mediaElement.type)];
            },
            // readonly attribute DOMString currentSrc;
            getCurrentSource: function() {
                return this._mediaElement.data;
            },
            /*
             const unsigned short NETWORK_EMPTY = 0;
             const unsigned short NETWORK_IDLE = 1;
             const unsigned short NETWORK_LOADING = 2;
             const unsigned short NETWORK_NO_SOURCE = 3;
             readonly attribute unsigned short networkState;
             */
            getNetworkState: function() {
                // Consider using NotifySocket object if we can consider having a persistent connection to the server
                // or error code from playState == error (6) return true when the error code == 1 (network connection lost)
                // TODO: CE-HTML implementation
            },
            // attribute DOMString preload;
            // @returns "none", "metadata" or "auto"
            getPreload: function() {
                // TODO: CE-HTML implementation
                return "none";
            },
            setPreload: function(preload) {
                // TODO: CE-HTML implementation
            },
            // readonly attribute TimeRanges buffered;
            getBuffered: function() {
                // TODO: CE-HTML implementation
                return [];
            },
            // void load();
            load: function() {
                // TODO: CE-HTML implementation
            },
            // DOMString canPlayType(in DOMString type);
            canPlayType: function(type) {
                // TODO: CE-HTML implementation
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
                // TODO: CE-HTML implementation
                return 0;
            },
            // readonly attribute boolean seeking;
            getSeeking: function() {
                // TODO: CE-HTML implementation
                return false;
            },
            // attribute double currentTime;
            setCurrentTime: function(currentTime) {
                // TODO: CE-HTML implementation
                // to emulate HTML5 we should throw an INVALID_STATE_ERR when we can't seek to the new position
                // understandably this call may be blocking until the seek has completed
                this._seekState.seekTo( currentTime );
                return this._mediaElement.seek(currentTime * 1000);
            },
            getCurrentTime: function() {
                return this._mediaElement.playPosition / 1000;
            },
            // readonly attribute double initialTime;
            getInitialTime: function() {
                // TODO: CE-HTML implementation
                return 0;
            },
            // readonly attribute double duration;
            getDuration: function() {
                // TODO: CE-HTML implementation
                return this._mediaElement.playTime / 1000;
            },
            // readonly attribute Date startOffsetTime;
            getStartOffsetTime: function() {
                // TODO: CE-HTML implementation
                return 0;
            },
            // readonly attribute boolean paused;
            getPaused: function() {
                return this._mediaElement.playState === CEHTMLPlayer.PLAY_STATE_PAUSED;
            },
            // attribute double defaultPlaybackRate;
            getDefaultPlaybackRate: function() {
                // TODO: CE-HTML implementation
                return 1;
            },
            // attribute double playbackRate;
            getPlaybackRate: function() {
                // TODO: CE-HTML implementation
                return 1;
            },
            setPlaybackRate: function(playbackRate) {
                // TODO: CE-HTML implementation
            },
            // readonly attribute TimeRanges played;
            getPlayed: function() {
                // TODO: CE-HTML implementation
                return [];
            },
            // readonly attribute TimeRanges seekable;
            getSeekable: function() {
                // TODO: CE-HTML implementation
                return [];
            },
            // readonly attribute boolean ended;
            getEnded: function() {
                return this._mediaElement.playState === CEHTMLPlayer.PLAY_STATE_FINISHED;
            },
            // attribute boolean autoplay;
            getAutoPlay: function() {
                // TODO: CE-HTML implementation
                return false;
            },
            setAutoPlay: function(autoplay) {
                // TODO: CE-HTML implementation
            },
            // attribute boolean loop;
            getLoop: function() {
                // TODO: CE-HTML implementation
                return false;
            },
            setLoop: function(loop) {
                // TODO: CE-HTML implementation
            },
            // void play();
            play: function() {
                this._mediaElement.play(1);
            },
            stop: function() {
                this._mediaElement.stop();

                if (this._updateInterval) {
                    window.clearInterval(this._updateInterval);
                    this._updateInterval = false;
                }
            },
            // void pause();
            pause: function() {
                this._mediaElement.play(0);
            },
            // attribute boolean controls;
            setNativeControls: function(controls) {
                // TODO: CE-HTML implementation
            },
            getNativeControls: function() {
                // TODO: CE-HTML implementation
                return false;
            },
            destroy: function() {
                this.stop();

                var device = RunTimeContext.getDevice();
                device.removeElement(this._mediaElement);
                this._mediaElement = null;
            },
            _requiresMediaTypeFix : function() {
                return false;
            }

        });

        CEHTMLPlayer.PLAY_STATE_STOPPED = 0;
        CEHTMLPlayer.PLAY_STATE_PLAYING = 1;
        CEHTMLPlayer.PLAY_STATE_PAUSED = 2;
        CEHTMLPlayer.PLAY_STATE_CONNECTING = 3;
        CEHTMLPlayer.PLAY_STATE_BUFFERING = 4;
        CEHTMLPlayer.PLAY_STATE_FINISHED = 5;
        CEHTMLPlayer.PLAY_STATE_ERROR = 6;

        Device.prototype.createMediaInterface = function(id, mediaType, eventCallback) {
            return new CEHTMLPlayer(id, mediaType, eventCallback);
        };
        Device.prototype.getPlayerEmbedMode = function(mediaType) {
            return MediaInterface.EMBED_MODE_BACKGROUND;
        };

        return CEHTMLPlayer;
    }
);
