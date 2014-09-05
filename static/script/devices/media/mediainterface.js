/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
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
    'antie/devices/media/mediainterface',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';

        var MediaInterface = Class.extend({

            /**
             * @param id ID to use in media DOM elements.
             * @param mediaType "audio" or "video"
             * @param eventCallback Function to which events are passed (e.g. to be bubbled up the component hierarchy).
             */
            init: function(id, mediaType, eventCallback){

            },
            /**
             * Hook to allow devices to any necessary rendering steps. By default does nothing.
             * @param device The Device on which we are operating.
             */
            render: function(device){

            },
            /**
             * @param options See Media.show
             */
            show: function(options){
                throw new Error("Show method has not been implemented.");
            },
            /**
             * @param options See Media.hide
             */
            hide: function(options){
                throw new Error("Hide method has not been implemented.");
            },
            /**
             * @param options See Media.moveTo
             */
            moveTo: function(options){
                throw new Error("MoveTo method has not been implemented.");
            },
            /**
             * @param left X coordinate of top-left corner.
             * @param top Y coordinate of top-left corner
             * @param width Width
             * @param height Height
             */
            setWindow: function(left, top, width, height){
                throw new Error("SetWindow method has not been implemented.");
            },
            getError: function(){
                throw new Error("GetError method has not been implemented.");
            },
            /**
             * @param sources List of media sources
             * @param tags Associative array of "tags" in the URL that are replaced (when the URL is templated).
             */
            setSources: function(sources, tags){
                throw new Error("SetSources method has not been implemented.");
            },
            getSources: function(){
                throw new Error("GetSources method has not been implemented.");
            },
            getCurrentSource: function(){
                throw new Error("GetCurrentSource method has not been implemented.");
            },
            getNetworkState: function(){
                throw new Error("GetNetworkState method has not been implemented.");
            },
            getPreload: function(){
                throw new Error("GetPreload method has not been implemented.");
            },
            setPreload: function(preload){
                throw new Error("SetPreload method has not been implemented.");
            },
            getBuffered: function(){
                throw new Error("GetBuffered method has not been implemented.");
            },
            load: function(){
                throw new Error("Load method has not been implemented.");
            },
            /**
             * @param type Mime type (string)
             */
            canPlayType: function(type){
                throw new Error("CanPlayType method has not been implemented.");
            },
            getReadyState: function(){
                throw new Error("GetReadyState method has not been implemented.");
            },
            getSeeking: function(){
                throw new Error("GetSeeking method has not been implemented.");
            },
            /**
             * @param currentTime Number of seconds since the start of the media.
             */
            setCurrentTime: function(currentTime){
                throw new Error("SetCurrentTime method has not been implemented.");
            },
            getCurrentTime: function(){
                throw new Error("GetCurrentTime method has not been implemented.");
            },
            getInitialTime: function(){
                throw new Error("GetInitialTime method has not been implemented.");
            },
            getDuration: function(){
                throw new Error("GetDuration method has not been implemented.");
            },
            getStartOffsetTime: function(){
                throw new Error("GetStartOffsetTime method has not been implemented.");
            },
            getPaused: function(){
                throw new Error("GetPaused method has not been implemented.");
            },
            getDefaultPlaybackRate: function(){
                throw new Error("GetDefaultPlaybackRate method has not been implemented.");
            },
            getPlaybackRate: function(){
                throw new Error("GetPlaybackRate method has not been implemented.");
            },
            /**
             * @param playbackRate Number representing the playback rate
             */
            setPlaybackRate: function(playbackRate){
                throw new Error("SetPlaybackRate method has not been implemented.");
            },
            getPlayed: function(){
                throw new Error("GetPlayed method has not been implemented.");
            },
            getSeekable: function(){
                throw new Error("GetSeekable method has not been implemented.");
            },
            getEnded: function(){
                throw new Error("GetEnded method has not been implemented.");
            },
            getAutoPlay: function(){
                throw new Error("GetAutoPlay method has not been implemented.");
            },
            /**
             * @param autoplay Boolean indicating if media should be automatically played on load.
             */
            setAutoPlay: function(autoplay){
                throw new Error("SetAutoPlay method has not been implemented.");
            },
            getLoop: function(){
                throw new Error("GetLoop method has not been implemented.");
            },
            /**
             * @param loop Boolean indicating if the media should loop.
             */
            setLoop: function(loop){
                throw new Error("SetLoop method has not been implemented.");
            },
            play: function(){
                throw new Error("Play method has not been implemented.");
            },
            stop: function(){
                throw new Error("Stop method has not been implemented.");
            },
            pause: function(){
                throw new Error("Pause method has not been implemented.");
            },
            /**
             * @param controls Boolean indicating if native controls should be used.
             */
            setNativeControls: function(controls){
                throw new Error("SetNativeControls method has not been implemented.");
            },
            getNativeControls: function(){
                throw new Error("GetNativeControls method has not been implemented.");
            },
            destroy: function(){

            }
        });

        MediaInterface.EMBED_MODE_EXTERNAL = 0;
        MediaInterface.EMBED_MODE_BACKGROUND = 1;
        MediaInterface.EMBED_MODE_EMBEDDED = 2;

        MediaInterface.NETWORK_EMPTY = 0;
        MediaInterface.NETWORK_IDLE = 1;
        MediaInterface.NETWORK_LOADING = 2;
        MediaInterface.NETWORK_NO_SOURCE = 3;

        MediaInterface.MEDIA_ERR_UNKNOWN = 0;
        MediaInterface.MEDIA_ERR_ABORTED = 1;
        MediaInterface.MEDIA_ERR_NETWORK = 2;
        MediaInterface.MEDIA_ERR_DECODE = 3;
        MediaInterface.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

        MediaInterface.HAVE_NOTHING = 0;
        MediaInterface.HAVE_METADATA = 1;
        MediaInterface.HAVE_CURRENT_DATA = 2;
        MediaInterface.HAVE_FUTURE_DATA = 3;
        MediaInterface.HAVE_ENOUGH_DATA = 4;

        return MediaInterface;
    }
);
