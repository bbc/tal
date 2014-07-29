/**
 * @fileOverview Requirejs module containing the antie.BrowserDevice subclass for Google TV devices.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/devices/googletv',
	[
		'antie/devices/browserdevice',
		'antie/application'
	],
	function(BrowserDevice, Application) {
		return BrowserDevice.extend({
			init: function(config) {
				// Change Application::getBestFitLayout to find the layout with a size
				// closest to that of the browser resolution, then use CSS zoom to fit
				// it to the exact screen size.
				Application.getCurrentApplication().getBestFitLayout = function() {
					var _screenSize = this._device.getScreenSize();
					var _layouts = this._device.getConfig().layouts;

					// sort the layouts by closest to reported screen resolution first
					_layouts.sort(function(a, b) {
						var adiff = {
								width: Math.abs(_screenSize.width - a.width),
								height: Math.abs(_screenSize.height - a.height)
						};
						var bdiff = {
								width: Math.abs(_screenSize.width - b.width),
								height: Math.abs(_screenSize.height - b.height)
						};
						var	ad = (adiff.width*adiff.width) + (adiff.height*bdiff.height),
							bd = (bdiff.width*bdiff.width) + (bdiff.height*bdiff.height);

						if(ad == bd) return 0;
						else if(ad < bd) return -1;
						else return 1;
					});

					var _selected = _layouts[0];

					// scale the closest layout to the exact screen resolution
					document.body.style.zoom = (screen.width / _selected.width);

					return _selected;
				};

				this._super(config);
			}
		});
	}
);
