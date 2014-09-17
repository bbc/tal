/**
 * @fileOverview Requirejs module containing the antie.events.MediaEvent class.
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

require.def('antie/events/mediaevent',
	['antie/events/event'],
	function(Event) {
		'use strict';
		/**
		 * Class of events raised when media events occur
		 * @name antie.events.MediaEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {String} [type] The type of event.
		 * @param {antie.widgets.Media} target The media widget that fired the event.
		 */
		var MediaEvent = Event.extend(/** @lends antie.events.MediaEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(type, target) {
				this.target = target;
				this._super(type);
			}
		});

		MediaEvent.TYPES = [
			"loadstart", 	// Event 	The user agent begins looking for media data, as part of the resource selection algorithm. 	networkState equals NETWORK_LOADING
			"progress", 	// Event 	The user agent is fetching media data. 	networkState equals NETWORK_LOADING
			"suspend", 	// Event 	The user agent is intentionally not currently fetching media data, but does not have the entire media resource downloaded. 	networkState equals NETWORK_IDLE
			"abort",		// Event 	The user agent stops fetching the media data before it is completely downloaded, but not due to an error. 	error is an object with the code MEDIA_ERR_ABORTED. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
			// Handled separately: "error",		// Event 	An error occurs while fetching the media data. 	error is an object with the code MEDIA_ERR_NETWORK or higher. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
			"emptied", 	// Event 	A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state (either because of a fatal error during load that's about to be reported, or because the load() method was invoked while the resource selection algorithm was already running). 	networkState is NETWORK_EMPTY; all the IDL attributes are in their initial states.
			"stalled", 	// Event 	The user agent is trying to fetch media data, but data is unexpectedly not forthcoming. 	networkState is NETWORK_LOADING.
			"play",		// Event 	Playback has begun. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin. 	paused is newly false.
			"pause",		// Event 	Playback has been paused. Fired after the pause() method has returned. 	paused is newly true.
			"loadedmetadata", 	// Event 	The user agent has just determined the duration and dimensions of the media resource and the timed tracks are ready. 	readyState is newly equal to HAVE_METADATA or greater for the first time.
			"loadeddata", 	// Event 	The user agent can render the media data at the current playback position for the first time. 	readyState newly increased to HAVE_CURRENT_DATA or greater for the first time.
			"waiting", 	// Event 	Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course. 	readyState is newly equal to or less than HAVE_CURRENT_DATA, and paused is false. Either seeking is true, or the current playback position is not contained in any of the ranges in buffered. It is possible for playback to stop for two other reasons without paused being false, but those two reasons do not fire this event: maybe playback ended, or playback stopped due to errors.
			"playing", 	// Event 	Playback has started. 	readyState is newly equal to or greater than HAVE_FUTURE_DATA, paused is false, seeking is false, or the current playback position is contained in one of the ranges in buffered.
			"canplay", 	// Event 	The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content. 	readyState newly increased to HAVE_FUTURE_DATA or greater.
			"canplaythrough", 	// Event 	The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering. 	readyState is newly equal to HAVE_ENOUGH_DATA.
			"seeking", 	// Event 	The seeking IDL attribute changed to true and the seek operation is taking long enough that the user agent has time to fire the event. 	
			"seeked",		// Event 	The seeking IDL attribute changed to false. 	
			"timeupdate", 	// Event 	The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously. 	
			"ended",		// Event 	Playback has stopped because the end of the media resource was reached. 	currentTime equals the end of the media resource; ended is true.
			"ratechange", 	// Event 	Either the defaultPlaybackRate or the playbackRate attribute has just been updated. 	
			"durationchange", 	// Event 	The duration attribute has just been updated. 	
			"volumechange" 	// Event 	Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned. 	
		];
		return MediaEvent;
	}
);
