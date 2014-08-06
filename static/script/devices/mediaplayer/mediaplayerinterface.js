/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
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
    "antie/devices/mediaplayer/mediaplayerinterface",
    [
        "antie/class",
        "antie/callbackmanager"

    ],
    function(Class, CallbackManager) {
        "use strict";

        var MediaPlayerInterface = Class.extend({

            init: function() {
                this._callbackManager = new CallbackManager();
            },

            /**
            * Add an event callback to receive all media player events from now on.
            *
            * Note that failing to remove callbacks when you are finished with them can stop garbage collection
            * of objects/closures containing those callbacks and so create memory leaks in your application.
            * @param thisArg The object to use as "this" when calling the callback.
            * @param callback Function to which events are passed (e.g. to be bubbled up the component hierarchy).
            */
            addEventCallback: function(thisArg, callback) {
                this._callbackManager.addCallback(thisArg, callback);
            },

            /**
            * Stop receiving events with the specified callback.
            * @param thisArg The object specified to use as "this" when adding the callback.
            * @param eventCallback Function to which events are no longer to be passed
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
             * @param event The type of the event to be emitted.
             * @protected
             */
            _emitEvent: function(eventType) {

                var event = {
                    type: eventType,
                    currentTime: this.getCurrentTime(),
                    range: this.getRange(),
                    url: this.getSource(),
                    mimeType: this.getMimeType(),
                    state: this.getState()
                };

                this._callbackManager.callAll(event);
            },

            /**
            * Set the media resource to be played.
            * Calling this in any state other than EMPTY is an error.
            * @param mediaType Value from the MediaPlayerInterface.TYPE enum; audio or video.
            * @param url location of the media resource to play
            * @param mimeType type of media resource
            */
            setSource: function (mediaType, url, mimeType) {
                throw new Error("setSource method has not been implemented");
            },

            /**
            * Request that the media start playing.
            * A media source must have been set with setSource before calling this.
            * If the Media is paused, call this to unpause it.
            * This may transition to the buffering state if enough media data is not yet available to play.
            * Calling this in state EMPTY is an error.
            */
            play : function () {
                throw new Error("play method has not been implemented");
            },

            /**
            * Request that the media start playing from Time.
            * A media source must have been set with setSource before calling this.
            * This can be used to resume media after changing source.
            * This may transition to the buffering state if enough media data is not yet available to play.
            * If the media is buffering, call this to resume playback in a playing state once buffering ends.
            * Calling this in state EMPTY is an error.
            */
            playFrom: function (time) {
                throw new Error("playFrom method has not been implemented");
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
            * Get the source url.
            * If no source is set (in state EMPTY for example), then this returns undefined.
            * @return string The url
            */
            getSource: function () {
                throw new Error("getSource method has not been implemented");
            },

            /**
            * Get the source mimeType.
            * If no source is set (in state EMPTY for example), then this returns undefined.
            * @return string The mimeType
            */
            getMimeType: function () {
                throw new Error("getMimeType method has not been implemented");
            },

            /**
            * Get the current play time.
            * If no current time is available, then this returns undefined.
            * @return number The current play time in seconds from the start of the media.
            */
            getCurrentTime: function () {
                throw new Error("getCurrentTime method has not been implemented");
            },

            /**
            * Get the available range of media.
            * Returns a range Object with 'start' and 'end' numeric properties, giving the start and end of the available media in seconds from the start of the media.
            * For VOD playback, 'start' is zero and 'end' is the media duration.
            * For Live playback, 'start' may be non-zero, reflecting the amount of 'live rewind' available before the current play position.
            * For live playback, 'end' is the current live time.
            * For live playback, both 'start' and 'end' may advance over time.
            * If no range§ is available, then this returns an object with 'start' and 'end' properties which both have the value undefined.
            * @return object Object with 'start' and 'end' numeric properties.
            */
            getRange: function () {
                throw new Error("getRange method has not been implemented");
            },

            /**
            * Get the current state of the Media PLayer state machine.
            * @return {MediaPlayerInterface.STATE} The current state of the Media Player state machine.
            */
            getState: function () {
                throw new Error("getState method has not been implemented");
            }
        });

        /**
        * Media Player State Machine
        */
        MediaPlayerInterface.STATE = {
            EMPTY:      0, // No source set
            STOPPED:    1, // Source set but no playback
            BUFFERING:  2, // Not enough data to play, waiting to download more
            PLAYING:    3, // Media is playing
            PAUSED:     4, // Media is paused
            COMPLETE:   5, // Media has reached its end point
            ERROR:      6  // An error occurred
        };

        /**
        * Media Player event names
        */
        MediaPlayerInterface.EVENT = {
            STOPPED: "stopped",     // Event fired when playback is stopped
            BUFFERING: "buffering", // Event fired when playback has to suspend due to buffering
            PLAYING: "playing",     // Event fired when starting (or resuming) playing of the media
            PAUSED: "paused",       // Event fired when media playback pauses
            COMPLETE: "complete",   // Event fired when media playback has reached the end of the media
            ERROR: "error",         // Event fired when an error condition occurs
            STATUS: "status"       // Event fired regularly during play
        };

        /**
        * Media Types
        */
        MediaPlayerInterface.TYPE = {
            VIDEO: 0,
            AUDIO: 1
        };

        return MediaPlayerInterface;
    }
);
