/**
 * @fileOverview Requirejs module containing antie.VideoSource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/videosource',
    ['antie/mediasource'],
    function(MediaSource) {
        'use strict';

        /**
         * An video media source. Provides storage of source and type information about an video media source.
         * @name antie.VideoSource
         * @class
         * @extends antie.MediaSource
         * @param {String} src The URI of the media.
         * @param {String} type The type of the media.
         */
        var VideoSource = MediaSource.extend(/** @lends antie.VideoSource.prototype */ {
            /**
             * Get the media type of this source. In this case <code>MediaType.MEDIA_TYPE_VIDEO</code>.
             * @returns The media type of this content.
             */
            getMediaType: function getMediaType () {
                return MediaSource.MEDIA_TYPE_VIDEO;
            }
        });

        return VideoSource;
    });
