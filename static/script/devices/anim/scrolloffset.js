/**
 * @fileOverview Requirejs modifier for animations based on scroll offsets
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def(
	'antie/devices/anim/scrolloffset',
	[
		'antie/devices/browserdevice',
		'antie/devices/anim/tween'
	],
	function(Device) {
		/**
		 * Scroll an element so that its top-left corner is at the given position.
		 * @name antie.devices.Device#scrollElementTo
		 * @function
		 * @param {Element} el The element you wish to scroll.
		 * @param {Integer} [left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
		 * @param {Integer} [top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
		 * @param {Boolean} [skipAnim] By default the scroll will be animated, pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the scroll has been completed.
		 * @returns A handle to any animation started by this movement. {@see #stopAnimation}
		 */
		Device.prototype.scrollElementTo = function(options) {
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.

			var startLeft = options.el.scrollLeft;
			var changeLeft = (options.to.left !== undefined) ? (options.to.left - startLeft) : 0;
			var startTop = options.el.scrollTop;
			var changeTop = (options.to.top !== undefined) ? (options.to.top - startTop) : 0;
			if ((changeLeft === 0) && (changeTop === 0)) {
				if (options.onComplete) {
					options.onComplete();
				}
				return null;
			}
			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				if (options.to.left !== undefined) {
					options.el.scrollLeft = options.to.left;
				}
				if (options.to.top !== undefined) {
					options.el.scrollTop = options.to.top;
				}
				if (options.onComplete) {
					options.onComplete();
				}
			} else {
				var from = {};
				var to = {};
				if (options.to.top !== undefined) {
					from.scrollTop = startTop;
					to.scrollTop = options.to.top;
				};
				if (options.to.left !== undefined) {
					from.scrollLeft = startLeft;
					to.scrollLeft = options.to.left;
				};

				return this._tween({
					el: options.el,
					from: from,
					offset: options.offset || 0,
					to: to,
					easing: 'scrolling',
					fps: options.fps,
					duration: options.duration,
					onComplete: options.onComplete
				});
			}
		};

		/**
		 * Moves an element so that its top-left corner is at the given position.
		 * @name antie.devices.Device#moveElementTo
		 * @function
		 * @param {Element} el The element you wish to move.
		 * @param {Integer} [left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
		 * @param {Integer} [top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
		 * @param {Boolean} [skipAnim] By default the movement will be animated, pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the move has been completed.
		 */
		Device.prototype.moveElementTo = function(options) {
			// Performance consideration: if left or top is undefined they are ignored to prevent the additional
			// work animating them.

			var startLeft = isNaN(parseInt(options.el.style.left.replace(/px|em|pt/,""))) 
								? 0 
								: parseInt(options.el.style.left.replace(/px|em|pt/,"")) || 0;
			var changeLeft = (options.to.left !== undefined) ? (options.to.left - startLeft) : 0;
			var startTop = isNaN(parseInt(options.el.style.top.replace(/px|em|pt/,"")))
								? 0
								: parseInt(options.el.style.top.replace(/px|em|pt/,"")) || 0;
			var changeTop = (options.to.top !== undefined) ? (options.to.top - startTop) : 0;

			if ((changeLeft === 0) && (changeTop === 0)) {
				return;
			}

			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style.left = (options.to.left || startLeft) + "px";
				options.el.style.top = (options.to.top || startTop) + "px";
				if (options.onComplete) {
					options.onComplete();
				}
			} else {
				var from = {};
				var to = {};

				if (options.to.top !== undefined) {
					from.top = startTop + "px";
					to.top = options.to.top + "px";
				};
				if (options.to.left !== undefined) {
					from.left = startLeft + "px";
					to.left = options.to.left + "px";
				};

				return this._tween({
					el: options.el,
					from: from,
					to: to,
					offset: options.offset || 0,
					easing: options.easing,
					fps: options.fps,
					duration: options.duration,
					onComplete: options.onComplete
				});
			}
		};

		/**
		 * Hides an element.
		 * @param {Element} el The element you wish to hide.
		 * @param {Boolean} [skipAnim] By default the hiding of the element will be animated (faded-out). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been hidden.
		 */
		Device.prototype.hideElement = function(options) {
			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style.visibility = "hidden";
				options.el.style.opacity = 0;
				if (typeof options.onComplete == "function") {
					options.onComplete();
				}
			} else {
				return this._tween({
					el: options.el,
					from: {
						opacity: options.el.style.opacity
					},
					to: {
						opacity: 0
					},
					easing: 'fading',
					onComplete: function() {
						options.el.style.visibility = 'hidden';
						if (options.onComplete) {
							options.onComplete();
						}
					}
				});
			}
		};

		/**
		 * Shows an element.
		 * @param {Element} el The element you wish to show.
		 * @param {Boolean} [skipAnim] By default the revealing of the element will be animated (faded-in). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been shown.
		 */
		Device.prototype.showElement = function(options) {
			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style.visibility = "visible";
				options.el.style.opacity = 1;
				if (typeof options.onComplete == "function") {
					options.onComplete();
				}
			} else {
				return this._tween({
					el: options.el,
					from: {
						opacity: options.el.style.opacity
					},
					to: {
						opacity: 1
					},
					easing: 'fading',
					onComplete: options.onComplete,
					onStart: function () {
						options.el.style.visibility = 'visible';
					}
				});
			}
		};

		/**
		 * Stops the specified animation. The any completeHandler for the animation will be executed.
		 * @name antie.devices.Device#stopAnimation
		 * @function
		 * @param {object} A handle to the animation you wish to stop.
		 */
		Device.prototype.stopAnimation = function(anim) {
			anim.stop(true);
		};
		
		/**
		 * Describes if the device supports animation or not
		 */
		Device.prototype.isAnimationDisabled = function(){
			return false;
		};
	}
);
