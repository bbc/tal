/**
 * @fileOverview Requirejs module containing antie.MediaSource class.
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

require.def('antie/mediasource',
        [
			'antie/class',
			'antie/runtimecontext',
			'antie/urlbuilder'
		],
        function(Class, RuntimeContext, URLBuilder) {
            'use strict';

			/**
			 * Base MediaSource (of unknown type). Provides storage of source and type information about a media source.
			 * @name antie.MediaSource
			 * @class
			 * @extends antie.Class
			 * @param {String} src The URI of the media.
			 * @param {String} type The type of the media.
			 */
            var MediaSource = Class.extend(/** @lends antie.MediaSource.prototype */ {
						/**
						 * Create a new MediaSource.
						 * @constructor
						 * @ignore
						 */
						init: function(src, type) {
                            this.src = src;
                            this.type = type;
                        },
						/**
						* Check if this MediaSource is equal to another.
						* @param {Object} mediaSource A MediaSource object to compare this one to.
						* @returns Boolean true if the provided mediaSource is equal to this. Otherwise false.
						*/
                        isEqual: function(mediaSource) {
                            return this.src === mediaSource.src && this.type === mediaSource.type;
                        },
						/**
						* Check to see if this media source refers to a live stream.
						* @returns Boolean true if this is a live stream. Otherwise false.
						*/
						isLiveStream: function() {
							return MediaSource.isLiveStream(this.type);
						},
						/**
						* Get the URL of this stream, built from the known source, config-provided template, and tag replacement.
						* @param {Object} [tags] A associative array of tags (%tag%) and values to repalce in the URL.
						* @returns The URL of this source.
						*/
						getURL: function(tags) {
							tags = tags || {};

							var config = RuntimeContext.getCurrentApplication().getDevice().getConfig();
							var streamingConfig = this.getMediaType() == MediaSource.MEDIA_TYPE_AUDIO ?
									config.streaming.audio : config.streaming.video;

							return new URLBuilder(streamingConfig.mediaURIFormat).getURL(this.src, tags);
						},
						/**
						* Get the content type of this source.
						* @returns The content type (MIME type) of this source.
						*/
						getContentType: function() {
							return this.type;
						},
						/**
						* Get the media type of this source. Either  <code>MediaType.MEDIA_TYPE_UNKNOWN</code>, <code>MediaType.MEDIA_TYPE_AUDIO</code> or <code>MediaType.MEDIA_TYPE_VIDEO</code>.
						* @returns The media type of this content.
						*/
						getMediaType: function() {
							return MediaSource.MEDIA_TYPE_UNKNOWN;
						}
                    });

			/**
			 * Unknown media type.
			 * @memberOf antie.MediaSource
			 * @name MEDIA_TYPE_UNKNOWN
			 * @constant
			 * @static
			 */
			MediaSource.MEDIA_TYPE_UNKNOWN = 0;

			/**
			 * Video media type.
			 * @memberOf antie.MediaSource
			 * @name MEDIA_TYPE_VIDEO
			 * @constant
			 * @static
			 */
			MediaSource.MEDIA_TYPE_VIDEO = 1;

			/**
			 * Audio media type.
			 * @memberOf antie.MediaSource
			 * @name MEDIA_TYPE_AUDIO
			 * @constant
			 * @static
			 */
			MediaSource.MEDIA_TYPE_AUDIO = 2;

			/**
			 * Returns Given a content type, returns if it refers to a live stream.
			 * @name isLiveStream
			 * @memberOf antie.MediaSource
			 * @static
			 * @function
			 * @param {String} type The type of the media.
			 * @returns Boolean true if the given type refers to a live stream.
			 */
			MediaSource.isLiveStream = function(type) {
				return type.toLowerCase() === "application/vnd.apple.mpegurl";
			};

            return MediaSource;
        });