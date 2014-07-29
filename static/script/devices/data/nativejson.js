/*
 * @fileOverview Requirejs modifier to use native JSON decoding/encoding if supported by the browser
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def(
	"antie/devices/data/nativejson",
	['antie/devices/browserdevice'],
	function(Device) {
		/* Patch Device.prototype.encodeJson and Device.prototype.decodeJson */
		Device.prototype.decodeJson = function(json) {
			return JSON.parse(json);
		};
		Device.prototype.encodeJson = function(obj) {
			return JSON.stringify(obj);
		};
	}
);
