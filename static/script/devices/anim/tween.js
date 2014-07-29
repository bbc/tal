/**
 * @fileOverview Requirejs modifier for animations based on scroll offsets
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
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