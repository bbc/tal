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
		Device.prototype._tween = function(el, propsOf, from, to, className, onComplete, onStart) {
			var anim = new Tweenable();
			var self = this;
			var opts = {
				from: {},
				to: {},
				duration: 500,
				easing: 'easeFromTo',
				start: function() {
					if(className) {
						self.removeClassFromElement(el, "not" + className);
						self.addClassToElement(el,  className);
					}
					self.removeClassFromElement(self.getTopLevelElement(), "notanimating");
					self.addClassToElement(self.getTopLevelElement(), "animating");
					if(onStart) {
						onStart();
					}
				},
				step: function() {
					for(var p in to) {
						if(this[p] != null) {
							propsOf[p] = this[p];
						}
					}
				},
				callback: function() {
					if(className) {
						self.removeClassFromElement(el, className);
						self.addClassToElement(el, "not" + className);
					}
					self.removeClassFromElement(self.getTopLevelElement(), "animating");
					self.addClassToElement(self.getTopLevelElement(), "notanimating");
					if(onComplete) {
						onComplete();
					}
				}
			};

			for(var p in from) {
				if(from[p] != null) {
					opts.from[p] = from[p];
				}
			}
			for(var p in to) {
				if(to[p] != null) {
					opts.to[p] = to[p];
				}
			}

			anim.tween(opts);

			return anim;
		};
	}
);