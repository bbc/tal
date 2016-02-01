/**
 * @fileOverview Requirejs module containing the antie.widgets.Media class.
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

require.def('antie/widgets/media',
	[
		'antie/widgets/widget',
        'antie/devices/media/mediainterface',

		// Include these so they're packaged with this file
		// All subclasses (which will be dynamically loaded) should use these
		'antie/events/mediaerrorevent',
		'antie/events/mediasourceerrorevent'
	],
	function(Widget, MediaInterface) {
        'use strict';

		/**
		 * The Media widget is responsible for playing video and audio within an application.
		 * It must be subclassed to provide support for different playback APIs.
		 * Methods and events loosely match that of the HTML5 HTMLMediaElement:
		 * @name antie.widgets.Media
		 * @class
		 * @abstract
		 * @extends antie.widgets.Widget
		 * @requires antie.events.MediaErrorEvent
		 * @requires antie.events.MediaSourceErrorEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 */
		var Media = Widget.extend(/** @lends antie.widgets.Media.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, mediaType) {
				this._super(id);

                var self = this;

                var eventCallback = function (event) {

                    // Claim the event as our own before propagating it; event listeners will be added to this
                    // (media) widget, not to something hidden away within the MediaInterface.
                    event.target = self;

                    self.bubbleEvent(event);
                };

                this._mediaInterface = this.getCurrentApplication().getDevice().createMediaInterface(id, mediaType, eventCallback);

				this.addClass('media');
			},
            render: function(device) {
	            this.outputElement = this._mediaInterface.render(device);
	            return this.outputElement;
            },
            show: function(options) {
                this._mediaInterface.show(options);
            },
            hide: function(options) {
                this._mediaInterface.hide(options);
            },
            moveTo: function(options) {
                this._mediaInterface.moveTo(options);
            },
            setWindow: function(left, top, width, height) {
                this._mediaInterface.setWindow(left, top, width, height);
            },
            getError: function() {
                return this._mediaInterface.getError();
            },
            setSources: function(sources, tags) {
                this._mediaInterface.setSources(sources, tags);
            },
            getSources: function() {
                return this._mediaInterface.getSources();
            },
            getCurrentSource: function() {
                return this._mediaInterface.getCurrentSource();
            },
            getNetworkState: function() {
                return this._mediaInterface.getNetworkState();
            },
            getPreload: function() {
                return this._mediaInterface.getPreload();
            },
            setPreload: function(preload) {
                this._mediaInterface.setPreload(preload);
            },
            getBuffered: function() {
                return this._mediaInterface.getBuffered();
            },
            load: function() {
                this._mediaInterface.load();
            },
            canPlayType: function(type) {
                return this._mediaInterface.canPlayType(type);
            },
            getReadyState: function() {
                return this._mediaInterface.getReadyState();
            },
            getSeeking: function() {
                return this._mediaInterface.getSeeking();
            },
            setCurrentTime: function(currentTime) {
                this._mediaInterface.setCurrentTime(currentTime);
            },
            getCurrentTime: function() {
                return this._mediaInterface.getCurrentTime();
            },
            getInitialTime: function() {
                return this._mediaInterface.getInitialTime();
            },
            getDuration: function() {
                return this._mediaInterface.getDuration();
            },
            getStartOffsetTime: function() {
                return this._mediaInterface.getStartOffsetTime();
            },
            getPaused: function() {
                return this._mediaInterface.getPaused();
            },
            getDefaultPlaybackRate: function() {
                return this._mediaInterface.getDefaultPlaybackRate();
            },
            getPlaybackRate: function() {
                return this._mediaInterface.getPlaybackRate();
            },
            setPlaybackRate: function(playbackRate) {
                this._mediaInterface.setPlaybackRate(playbackRate);
            },
            getPlayed: function() {
                return this._mediaInterface.getPlayed();
            },
            getSeekable: function() {
                return this._mediaInterface.getSeekable();
            },
            getEnded: function() {
                return this._mediaInterface.getEnded();
            },
            getAutoPlay: function() {
                return this._mediaInterface.getAutoPlay();
            },
            setAutoPlay: function(autoplay) {
                this._mediaInterface.setAutoPlay(autoplay);
            },
            getLoop: function() {
                return this._mediaInterface.getLoop();
            },
            setLoop: function(loop) {
                this._mediaInterface.setLoop(loop);
            },
            play: function() {
                this._mediaInterface.play();
            },
            stop: function() {
                this._mediaInterface.stop();
            },
            pause: function() {
                this._mediaInterface.pause();
            },
            setNativeControls: function(controls) {
                this._mediaInterface.setNativeControls(controls);
            },
            getNativeControls: function() {
                return this._mediaInterface.getNativeControls();
            },
            setVolume: function(volume) {
                this.getCurrentApplication().getDevice().setVolume(volume);
            },
            getVolume: function() {
                return this.getCurrentApplication().getDevice().getVolume();
            },
            setMuted: function(muted) {
                this.getCurrentApplication().getDevice().setMuted(muted);
            },
            getMuted: function() {
                return this.getCurrentApplication().getDevice().getMuted();
            },
            destroy: function() {
                this._mediaInterface.destroy();
            }
        });

        Media.EMBED_MODE_EXTERNAL = MediaInterface.EMBED_MODE_EXTERNAL;
        Media.EMBED_MODE_BACKGROUND = MediaInterface.EMBED_MODE_BACKGROUND;
        Media.EMBED_MODE_EMBEDDED = MediaInterface.EMBED_MODE_EMBEDDED;

        Media.NETWORK_EMPTY = MediaInterface.NETWORK_EMPTY;
        Media.NETWORK_IDLE = MediaInterface.NETWORK_IDLE;
        Media.NETWORK_LOADING = MediaInterface.NETWORK_LOADING;
        Media.NETWORK_NO_SOURCE = MediaInterface.NETWORK_NO_SOURCE;

        Media.MEDIA_ERR_UNKNOWN = MediaInterface.MEDIA_ERR_UNKNOWN;
        Media.MEDIA_ERR_ABORTED = MediaInterface.MEDIA_ERR_ABORTED;
        Media.MEDIA_ERR_NETWORK = MediaInterface.MEDIA_ERR_NETWORK;
        Media.MEDIA_ERR_DECODE = MediaInterface.MEDIA_ERR_DECODE;
        Media.MEDIA_ERR_SRC_NOT_SUPPORTED = MediaInterface.MEDIA_ERR_SRC_NOT_SUPPORTED;

        Media.HAVE_NOTHING = MediaInterface.HAVE_NOTHING;
        Media.HAVE_METADATA = MediaInterface.HAVE_METADATA;
        Media.HAVE_CURRENT_DATA = MediaInterface.HAVE_CURRENT_DATA;
        Media.HAVE_FUTURE_DATA = MediaInterface.HAVE_FUTURE_DATA;
        Media.HAVE_ENOUGH_DATA = MediaInterface.HAVE_ENOUGH_DATA;

        return Media;
	}
);
