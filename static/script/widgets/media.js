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

		// Include these so they're packaged with this file
		// All subclasses (which will be dynamically loaded) should use these
		'antie/events/mediaerrorevent',
		'antie/events/mediasourceerrorevent'
	],
	function(Widget) {
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
			init: function(id) {
				this._super(id);

				this.addClass('media');
			},
			// (not part of HTML5 media)
			setWindow: function(left, top, width, height) {
			},
			getVideoWidth: function() {
			},
			getVideoHeight: function() {
			},
			// readonly attribute MediaError error;
			getError: function() {
			},
			// Similar to src attribute or 'source' child elements:
			// attribute DOMString src;
			setSources: function(sources, tags) {
			},
			getSources: function() {
			},
			// readonly attribute DOMString currentSrc;
			getCurrentSource: function() {
			},
			/*
			const unsigned short NETWORK_EMPTY = 0;
			const unsigned short NETWORK_IDLE = 1;
			const unsigned short NETWORK_LOADING = 2;
			const unsigned short NETWORK_NO_SOURCE = 3;
			readonly attribute unsigned short networkState;
			*/
			getNetworkState: function() {
			},
			// attribute DOMString preload;
			getPreload: function() {
			},
			setPreload: function(preload) {
			},
			// readonly attribute TimeRanges buffered;
			getBuffered: function() {
			},
			// void load();
			load: function() {
			},
			// DOMString canPlayType(in DOMString type);
			canPlayType: function(type) {
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
			},
			// readonly attribute boolean seeking;
			getSeeking: function() {
			},
			// attribute double currentTime;
			setCurrentTime: function(currentTime) {
			},
			getCurrentTime: function() {
			},
			// readonly attribute double initialTime;
			getInitialTime: function() {
			},
			// readonly attribute double duration;
			getDuration: function() {
			},
			// readonly attribute Date startOffsetTime;
			getStartOffsetTime: function() {
			},
			// readonly attribute boolean paused;
			getPaused: function() {
			},
			// attribute double defaultPlaybackRate;
			getDefaultPlaybackRate: function() {
			},
			// attribute double playbackRate;
			getPlaybackRate: function() {
			},
			setPlaybackRate: function(playbackRate) {
			},
			// readonly attribute TimeRanges played;
			getPlayed: function() {
			},
			// readonly attribute TimeRanges seekable;
			getSeekable: function() {
			},
			// readonly attribute boolean ended;
			getEnded: function() {
			},
			// attribute boolean autoplay;
			getAutoPlay: function() {
			},
			setAutoPlay: function(autoplay) {
			},
			// attribute boolean loop;
			getLoop: function() {
			},
			setLoop: function(loop) {
			},
			// void play();
			play: function() {
			},
			// NOT IN HTML5 but needed by many devices
			stop: function() {
			},
			// void pause();
			pause: function() {
			},
			// attribute boolean controls;
			setNativeControls: function(controls) {
			},
			getNativeControls: function() {
			},
			// attribute double volume;
			setVolume: function(volume) {
			},
			getVolume: function() {
			},
			// attribute boolean muted;
			setMuted: function(muted) {
			},
			getMuted: function() {
			},
			destroy: function() {
			}
		});

		Media.EMBED_MODE_EXTERNAL = 0;
		Media.EMBED_MODE_BACKGROUND = 1;
		Media.EMBED_MODE_EMBEDDED = 2;

		Media.NETWORK_EMPTY = 0;
		Media.NETWORK_IDLE = 1;
		Media.NETWORK_LOADING = 2;
		Media.NETWORK_NO_SOURCE = 3;

		Media.HAVE_NOTHING = 0;
		Media.HAVE_METADATA = 1;
		Media.HAVE_CURRENT_DATA = 2;
		Media.HAVE_FUTURE_DATA = 3;
		Media.HAVE_ENOUGH_DATA = 4;

		Media.MEDIA_ERR_UNKNOWN = 0;
		Media.MEDIA_ERR_ABORTED = 1;
		Media.MEDIA_ERR_NETWORK = 2;
		Media.MEDIA_ERR_DECODE = 3;
		Media.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

		return Media;
	}
);
