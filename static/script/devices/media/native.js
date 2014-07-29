/**
 * @fileOverview Requirejs module containing device modifier to launch native external media players
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def(
	'antie/devices/media/native',
	[
		'antie/devices/device',
		'antie/widgets/media'
	],
	function(Device, Media) {
		Device.prototype.getPlayerEmbedMode = function(mediaType) {
			return Media.EMBED_MODE_EXTERNAL;
		};
	}
);
