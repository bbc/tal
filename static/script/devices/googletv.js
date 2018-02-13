/**
 * @fileOverview Requirejs module containing the antie.BrowserDevice subclass for Google TV devices.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/devices/googletv',
	[
		'antie/devices/browserdevice',
		'antie/runtimecontext'
	],
	function(BrowserDevice, RuntimeContext) {
		'use strict';

		return BrowserDevice.extend({
			init: function init (config) {
				// Change Application::getBestFitLayout to find the layout with a size
				// closest to that of the browser resolution, then use CSS zoom to fit
				// it to the exact screen size.
				RuntimeContext.getCurrentApplication().getBestFitLayout = function() {
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

				init.base.call(this, config);
			}
		});
	}
);
