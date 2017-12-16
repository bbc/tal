/**
 * @fileOverview Requirejs module containing antie.AudioSource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/audiosource',
    ['antie/mediasource'],
    function(MediaSource) {
        'use strict';

        /**
         * An audio media source. Provides storage of source and type information about an audio media source.
         * @name antie.AudioSource
         * @class
         * @extends antie.MediaSource
         * @param {String} src The URI of the media.
         * @param {String} type The type of the media.
         */
        var AudioSource = MediaSource.extend(/** @lends antie.AudioSource.prototype */ {
            /**
             * Get the media type of this source. In this case <code>MediaType.MEDIA_TYPE_AUDIO</code>.
             * @returns The media type of this content.
             */
            getMediaType: function getMediaType () {
                return MediaSource.MEDIA_TYPE_AUDIO;
            }
        });

        return AudioSource;
    });
