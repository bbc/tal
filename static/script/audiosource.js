/**
 * @fileOverview Requirejs module containing antie.AudioSource class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def('antie/audiosource',
        ['antie/mediasource'],
        function(MediaSource) {
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
						getMediaType: function() {
							return MediaSource.MEDIA_TYPE_AUDIO;
						}						
                    });

            return AudioSource;
        });