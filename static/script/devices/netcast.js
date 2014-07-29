/**
 * @fileOverview Requirejs module containing the antie.BrowserDevice subclass for LG NetCast devices.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/devices/netcast',
	[
		'antie/devices/browserdevice'
	],
	function(BrowserDevice) {
		return BrowserDevice.extend({
			exit: function() {
				window.NetCastBack();
			}
		});
	}
);
