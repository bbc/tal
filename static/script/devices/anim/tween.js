/**
 * @fileOverview Requirejs modifier for animations based on scroll offsets
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

require.def(
	'antie/devices/anim/tween',
	[
		'antie/devices/browserdevice',
		'antie/lib/shifty'
	],
	function(Device, Tweenable) {
		Device.prototype._tween = function (options) {
			var anim = new Tweenable(options);
			var self = this;

			var opts = {
					initialState: options.from || {},
					from: options.from || {},
					to: options.to || {},
					duration: options.duration || 840,
					easing: options.easing || 'easeFromTo',
					fps: options.fps || 25,
					start: function() {
						if (options.className) {
							self.removeClassFromElement(options.el, "not" + options.className);
							self.addClassToElement(options.el,  options.className);
						}
						self.removeClassFromElement(self.getTopLevelElement(), "notanimating");
						self.addClassToElement(self.getTopLevelElement(), "animating");
						if (options.onStart) {
							options.onStart();
						}
					},
					step: function () {
						for (var p in options.to) {
							if (this[p] != null) {
								if (/scroll/.test(p)) {
									options.el[p] = this[p];
								} else {
									options.el.style[p] = this[p];
								}
							}
						}
					},
					callback: function () {
						if(options.className) {
							self.removeClassFromElement(options.el, options.className);
							self.addClassToElement(options.el, "not" + options.className);
						}
						self.removeClassFromElement(self.getTopLevelElement(), "animating");
						self.addClassToElement(self.getTopLevelElement(), "notanimating");
						if (options.onComplete) {
							options.onComplete();
						}
					}
				};

			anim.tween(opts);

			return anim;
		};
	}
);