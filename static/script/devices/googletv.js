/**
 * @fileOverview Requirejs module containing the antie.BrowserDevice subclass for Google TV devices.
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

require.def('antie/devices/googletv',
	[
		'antie/devices/browserdevice',
		'antie/runtimecontext'
	],
	function(BrowserDevice, RuntimeContext) {
		'use strict';

		return BrowserDevice.extend({
			init: function(config) {
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

				this._super(config);
			}
		});
	}
);
