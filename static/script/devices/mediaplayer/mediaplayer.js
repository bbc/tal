/**
 * @fileOverview Requirejs module containing base class for device
 * modifiers for media playback
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
    "antie/devices/mediaplayer/mediaplayer",
    [
        "antie/class",
        "antie/callbackmanager",
        "antie/runtimecontext"
    ],
    function(Class, CallbackManager, RuntimeContext) {
        "use strict";

        /**
         * Base class for media playback device modifiers.
         * @name antie.devices.mediaplayer.MediaPlayer
         * @class
         * @abstract
         * @extends antie.Class
         */
        var MediaPlayer = Class.extend(/** @lends antie.devices.mediaplayer.MediaPlayer.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function() {
                this._callbackManager = new CallbackManager();
            },

            /**
             * Add an event callback to receive all media player events from now on.
             *
             * Note that failing to remove callbacks when you are finished with them can stop garbage collection
             * of objects/closures containing those callbacks and so create memory leaks in your application.
             * @param {Object} thisArg The object to use as "this" when calling the callback.
             * @param {Function} callback Function to which events are passed (e.g. to be bubbled up the component hierarchy).
             */
            addEventCallback: function(thisArg, callback) {
                this._callbackManager.addCallback(thisArg, callback);
            },

            /**
             * Stop receiving events with the specified callback.
             * @param {Object} thisArg The object specified to use as "this" when adding the callback.
             * @param {Function} callback Function to which events are no longer to be passed
             */
            removeEventCallback: function(thisArg, callback) {
                this._callbackManager.removeCallback(thisArg, callback);
            },

            /**
             * Stop receiving events to any callbacks.
             */
            removeAllEventCallbacks: function() {
                this._callbackManager.removeAllCallbacks();
            },

            /**
             * Protected method, for use by subclasses to emit events of any specified type, adding in the
             * standard payload used by all events.
             * @param {String} eventType The type of the event to be emitted.
             * @protected
             */
            _emitEvent: function(eventType) {

                var event = {
                    type: eventType,
                    currentTime: this.getCurrentTime(),
                    seekableRange: this.getSeekableRange(),
                    duration: this.getDuration(),
                    url: this.getSource(),
                    mimeType: this.getMimeType(),
                    state: this.getState()
                };

                this._callbackManager.callAll(event);
            },

            /**
             * Offset used when attempting to playFrom() the end of media. This allows the media to play briefly before completing.
             * @constant {Number}
             */
            CLAMP_OFFSET_FROM_END_OF_RANGE: 1.1,

            /**
             * Clamp a time value so it does not exceed the current range.
             * Clamps to near the end instead of the end itself to allow for devices that cannot seek to the very end of the media.
             * @param {Number} seconds The time value to clamp in seconds from the start of the media
             * @protected
             */
            _getClampedTime: function(seconds) {
                var range = this.getSeekableRange();
                var offsetFromEnd = this._getClampOffsetFromConfig();
                var nearToEnd = Math.max(range.end - offsetFromEnd, range.start);
                if (seconds < range.start) {
                    return range.start;
                } else if (seconds > nearToEnd) {
                    return nearToEnd;
                } else {
                    return seconds;
                }
            },

            /**
             * Time (in seconds) compared to current time within which seeking has no effect.
             * @constant {Number}
             */
            CURRENT_TIME_TOLERANCE: 1,

            /**
             * Check whether a time value is near to the current media play time.
             * @param {Number} seconds The time value to test, in seconds from the start of the media
             * @protected
             */
            _isNearToCurrentTime: function(seconds) {
                var currentTime = this.getCurrentTime();
                var targetTime = this._getClampedTime(seconds);
                return Math.abs(currentTime - targetTime) <= this.CURRENT_TIME_TOLERANCE;
            },

            /**
             * Set the media resource to be played.
             * Calling this in any state other than EMPTY is an error.
             * @param {antie.devices.mediaplayer.MediaPlayer.TYPE} mediaType Value from the MediaPlayer.TYPE enum; audio or video.
             * @param {String} url location of the media resource to play
             * @param {String} mimeType type of media resource
             */
            setSource: function (mediaType, url, mimeType) {
                throw new Error("setSource method has not been implemented");
            },

            /**
             * Request that the media start playing from Time.
             * A media source must have been set with setSource before calling this.
             * This can be used to resume media after changing source.
             * This may transition to the buffering state if enough media data is not yet available to play.
             * If the media is buffering, call this to resume playback in a playing state once buffering ends.
             * Calling this in state EMPTY is an error.
             * Clamps the time to the seekable range of the media.
             * If trying to play at (or past) the very end of the media, this will actually begin playback just before the end.
             * This allows the media playback to complete normally.
             * @param {Number} seconds Time to play from in seconds from the start of the media
             */
            playFrom: function (seconds) {
                throw new Error("playFrom method has not been implemented");
            },

            /**
             * Begin playback of the media resource from wherever the device chooses.
             * For On Demand assets, this will normally be the start, for Live stream assets it should be the live point
             * but could be the start of the stream window on some devices.
             * This function can only be called from the STOPPED state; calling it from any other state is an error.
             * To begin playback from a specified time offset, use the playFrom function instead.
             */
            beginPlayback: function () {
                throw new Error("beginPlayback method has not been implemented");
            },

            /**
             * Request that the media be paused.
             * If the Media is playing, call this to pause it.
             * If the media is buffering, call this to resume playback in a paused state once buffering ends.
             * Calling this in state EMPTY or STOPPED is an error.
             */
            pause: function () {
                throw new Error("pause method has not been implemented");
            },

            /**
             * Request that the media resume playing after being paused.
             * If the Media is paused, call this to resume playing it.
             * If the media is buffering, call this to resume playback in a playing state once buffering ends.
             * Calling this in state EMPTY or STOPPED is an error.
             */
            resume: function () {
                throw new Error("resume method has not been implemented");
            },

            /**
             * Request that the media be stopped.
             * If the Media is playing, call this to stop the media.
             * Note that the source is still set after calling stop.
             * Call reset after stop to unset the source.
             * Calling this in state EMPTY is an error.
             */
            stop: function () {
                throw new Error("stop method has not been implemented");
            },

            /**
             * Reset the Media Player.
             * When the media is stopped, calling reset will reset the player to a clean state with no source set.
             * Calling this in any state other than STOPPED or ERROR is an error.
             */
            reset: function () {
                throw new Error("reset method has not been implemented");
            },

            /**
             * Get the source URL.
             * If no source is set (in state EMPTY for example), then this returns undefined.
             * @return {String} The URL
             */
            getSource: function () {
                throw new Error("getSource method has not been implemented");
            },

            /**
            * Get the source MIME type.
            * If no source is set (in state EMPTY for example), then this returns undefined.
            * @return {String} The MIME type
            */
            getMimeType: function () {
                throw new Error("getMimeType method has not been implemented");
            },

            /**
            * Get the current play time.
            * If no current time is available, then this returns undefined.
            * @return {Number} The current play time in seconds from the start of the media.
            */
            getCurrentTime: function () {
                throw new Error("getCurrentTime method has not been implemented");
            },

            /**
            * Get the available seekable range of media.
            * Returns a range Object with 'start' and 'end' numeric properties, giving the start and end of the available media in seconds from the start of the media.
            * For VOD playback, 'start' is zero and 'end' is the last possible seek time (in many cases equal to duration).
            * For Live playback, 'start' may be non-zero, reflecting the amount of 'live rewind' available before the current play position.
            * For live playback, 'end' is the current live time.
            * For live playback, both 'start' and 'end' may advance over time.
            * If no range is available, this returns undefined.
            * @return {Object} Object with 'start' and 'end' times in seconds, or undefined.
            */
            getSeekableRange: function () {
                throw new Error("getSeekableRange method has not been implemented");
            },

            /**
             * Get the duration of the media in seconds.
             * For VOD playback, this is the duration of the media.
             * For Live playback, this is positive Infinity.
             * If no duration is available, this returns undefined.
             * @return {Number} Duration of media in seconds, or Infinity, or undefined.
             */
            getDuration: function() {
                throw new Error("getDuration method has not been implemented");
            },

            /**
            * Get the current state of the Media PLayer state machine.
            * @return {antie.devices.mediaplayer.MediaPlayer.STATE} The current state of the Media Player state machine.
            */
            getState: function () {
                throw new Error("getState method has not been implemented");
            },

            _getClampOffsetFromConfig: function() {
                var clampOffsetFromEndOfRange;
                var config = RuntimeContext.getDevice().getConfig();
                if (config && config.streaming && config.streaming.overrides) {
                    clampOffsetFromEndOfRange = config.streaming.overrides.clampOffsetFromEndOfRange;
                }

                if(clampOffsetFromEndOfRange !== undefined) {
                    return clampOffsetFromEndOfRange;
                } else {
                    return this.CLAMP_OFFSET_FROM_END_OF_RANGE;
                }
            }
        });

        /**
        * An enumeration of possible media player states.
        * @name antie.devices.mediaplayer.MediaPlayer.STATE
        * @enum {String}
        */
        MediaPlayer.STATE = {
            EMPTY:      "EMPTY",     // No source set
            STOPPED:    "STOPPED",   // Source set but no playback
            BUFFERING:  "BUFFERING", // Not enough data to play, waiting to download more
            PLAYING:    "PLAYING",   // Media is playing
            PAUSED:     "PAUSED",    // Media is paused
            COMPLETE:   "COMPLETE",  // Media has reached its end point
            ERROR:      "ERROR"      // An error occurred
        };

        /**
        * Media Player event names
        * @name antie.devices.mediaplayer.MediaPlayer.EVENT
        * @enum {String}
        */
        MediaPlayer.EVENT = {
            STOPPED:   "stopped",   // Event fired when playback is stopped
            BUFFERING: "buffering", // Event fired when playback has to suspend due to buffering
            PLAYING:   "playing",   // Event fired when starting (or resuming) playing of the media
            PAUSED:    "paused",    // Event fired when media playback pauses
            COMPLETE:  "complete",  // Event fired when media playback has reached the end of the media
            ERROR:     "error",     // Event fired when an error condition occurs
            STATUS:    "status",    // Event fired regularly during play
            SENTINEL_ENTER_BUFFERING:  "sentinel-enter-buffering", // Event fired when a sentinel has to act because the device has started buffering but not reported it
            SENTINEL_EXIT_BUFFERING:   "sentinel-exit-buffering",  // Event fired when a sentinel has to act because the device has finished buffering but not reported it
            SENTINEL_PAUSE:            "sentinel-pause",           // Event fired when a sentinel has to act because the device has failed to pause when expected
            SENTINEL_PLAY:             "sentinel-play",            // Event fired when a sentinel has to act because the device has failed to play when expected
            SENTINEL_SEEK:             "sentinel-seek",            // Event fired when a sentinel has to act because the device has failed to seek to the correct location
            SENTINEL_COMPLETE:         "sentinel-complete",        // Event fired when a sentinel has to act because the device has completed the media but not reported it
            SENTINEL_PAUSE_FAILURE:    "sentinel-pause-failure",   // Event fired when the pause sentinel has failed twice, so it is giving up
            SENTINEL_SEEK_FAILURE:     "sentinel-seek-failure"     // Event fired when the seek sentinel has failed twice, so it is giving up
        };

        /**
         * An enumeration of valid Media Types.
         * @name antie.devices.mediaplayer.MediaPlayer.TYPE
         * @enum {String}
         */
        MediaPlayer.TYPE = {
            VIDEO: "video",
            AUDIO: "audio"
        };

        return MediaPlayer;
    }
);
