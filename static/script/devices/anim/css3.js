/**
 * @fileOverview Requirejs modifier for CSS3-based animations.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def(
	'antie/devices/anim/css3',
	['antie/devices/browserdevice'],
	function(Device) {
		// Browser specific transition values
		var _css3Prefix = /WebKit/.test(navigator.userAgent) 
								? "webkit" 
								: /Gecko/.test(navigator.userAgent) 
										? "moz" 
										: /Opera/.test(navigator.userAgent) 
												? "o" 
												: "";

		var _transitionEndEvent = (_css3Prefix.length && _css3Prefix !== "moz") 
										? (_css3Prefix + "TransitionEnd") 
										: "transitionend";

		if (_css3Prefix === "o") {
			_css3Prefix = "O";
		} else if (_css3Prefix === "moz") {
			_css3Prefix = "Moz";
		}
		var _transitionProperty = _css3Prefix.length 
										? (_css3Prefix + "Transition") 
										: "transition";
		var _transformProperty = _css3Prefix.length 
										? (_css3Prefix + "Transform") 
										: "transform";

		function testMediaQuery(mq) {
			var	st = document.createElement('style'),
				div = document.createElement('div'),
				ret;

			st.textContent = mq + '{#mediaQueryElement{height:3px}}';
			(document.head || document.getElementsByTagName('head')[0]).appendChild(st);
			div.id = 'mediaQueryElement';
			document.documentElement.appendChild(div);
			ret = div.offsetHeight === 3;
			st.parentNode.removeChild(st);
			div.parentNode.removeChild(div);

			return !!ret;
		};

		var cssDetect = document.createElement('cssdetect');
		cssDetect.cssText = "perspective:500";
		var _translate = "translate";
		var _supports3D = false;
		var _mediaQuery = "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-webkit-transform-3d),(mediaQueryElement)";

		for (var p in ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']) {
			if ((cssDetect.style[p] !== undefined) && testMediaQuery(_mediaQuery)) {
				_translate = "translate3d";
				_supports3D = true;
				break;
			}
		}

		function getCurrentTranslation(el) {
			var translation = /translate(3d?)\(([\-\.0-9]+)(px?),\s*([\-\.0-9]+)(px?)/.exec(el.style[_transformProperty]);
			return {
				left: translation ? translation[2] : 0,
				top: translation ? translation[4] : 0
			};
		}

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

			var currentTranslation = getCurrentTranslation(options.el);
			var left = ((options.to.left !== undefined) ? (0 - options.to.left) : currentTranslation.left) || 0;
			var top = ((options.to.top !== undefined) ? (0 - options.to.top) : currentTranslation.top) || 0;

			var newTranslation = _translate + "(" + left + "px, " + top + "px" + (_supports3D ? ", 0" : "") + ")";
			if (options.el.lastAntieCSS3Scroll === newTranslation) {
				options.skipAnim = true;
			} else {
				options.el.lastAntieCSS3Scroll = newTranslation;
			}

			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style[_transformProperty] = newTranslation;
				if (options.onComplete) {
					options.onComplete();
				}
			} else {
				this.addClassToElement(options.el, "transition");	
				this.removeClassFromElement(options.el.parentNode, "notscrolling");	
				this.addClassToElement(options.el.parentNode, "scrolling");	
				this.removeClassFromElement(this.getTopLevelElement(), "notanimating");
				this.addClassToElement(this.getTopLevelElement(), "animating");

				var self = this;
				options.el.addEventListener(_transitionEndEvent, function(evt) {
					if (evt.target === options.el) {
						options.el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						self.removeClassFromElement(options.el.parentNode, "scrolling");	
						self.addClassToElement(options.el.parentNode, "notscrolling");	
						self.removeClassFromElement(self.getTopLevelElement(), "animating");
						self.addClassToElement(self.getTopLevelElement(), "notanimating");
						self.removeClassFromElement(options.el, "transition");	
						if (options.onComplete) {
							options.onComplete();
						}
					}
				}, true);

				// the above className change does not happen instantly
				setTimeout(function() {
					options.el.style[_transformProperty] = newTranslation;
					if (options.onComplete) {
						options.onComplete();
					}
				}, 10);

				return true;
			}
		}

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
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.

			var currentTranslation = getCurrentTranslation(options.el);
			var left = ((options.to.left !== null && options.to.left !== undefined) ? options.to.left : currentTranslation.left) || 0;
			var top = ((options.to.top !== null && options.to.top !== undefined) ? options.to.top : currentTranslation.top) || 0;

			var newTranslation = _translate + "(" + left + "px, " + top + "px" + (_supports3D ? ", 0" : "") + ")";

			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style[_transformProperty] = newTranslation;
				if (options.onComplete) {
					options.onComplete();
				}
			} else {
				this.removeClassFromElement(options.el, "notmoving");	
				this.addClassToElement(options.el, "moving");	
				this.removeClassFromElement(this.getTopLevelElement(), "notanimating");
				this.addClassToElement(this.getTopLevelElement(), "animating");

				var self = this;
				options.el.addEventListener(_transitionEndEvent, function(evt) {
					if (evt.target === options.el) {
						options.el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						self.removeClassFromElement(options.el, "moving");	
						self.addClassToElement(options.el, "notmoving");	
						self.removeClassFromElement(self.getTopLevelElement(), "animating");
						self.addClassToElement(self.getTopLevelElement(), "notanimating");
						self.removeClassFromElement(options.el, "transition");	
						if (options.onComplete) {
							options.onComplete();
						}
					}
				}, true);
				this.addClassToElement(options.el, "transition");	

				// the above className change does not happen instantly
				setTimeout(function() {
					options.el.style[_transformProperty] = newTranslation;
				}, 10);

				return options.onComplete || true;
			}
		}

		/**
		 * Stops the specified animation. The any completeHandler for the animation will be executed.
		 * @name antie.devices.Device#stopAnimation
		 * @function
		 * @param {object} A handle to the animation you wish to stop.
		 */
		Device.prototype.stopAnimation = function(anim) {
			// TODO: is there any way to do this when animating via CSS3?
			if (typeof(anim) === "function") {
				anim();
			}
		};

		/**
		 * Hides an element.
		 * @name antie.devices.Device#hideElement
		 * @function
		 * @param {Element} el The element you wish to hide.
		 * @param {Boolean} [skipAnim] By default the hiding of the element will be animated (faded-out). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been hidden.
		 */
		Device.prototype.hideElement = function(options) {
			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style[_transitionProperty] = "";
				options.el.style.visibility = "hidden";
				options.el.style.opacity = 0;
				if (typeof options.onComplete == "function") {
					options.onComplete();
				}
			} else {
				var self = this;
				options.el.addEventListener(_transitionEndEvent, function(evt) {
					if (evt.target === options.el) {
						options.el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						options.el.style[_transitionProperty] = "";
						options.el.style.visibility = "hidden";
						if (options.onComplete) {
							options.onComplete();
						}
					}
				}, true);

				options.el.style[_transitionProperty] = "opacity 1s linear";
				setTimeout(function() {
					options.el.style.opacity = 0;
				}, 100);

				return options.onComplete || true;
			}
		};

		/**
		 * Shows an element.
		 * @name antie.devices.Device#showElement
		 * @function
		 * @param {Element} el The element you wish to show.
		 * @param {Boolean} [skipAnim] By default the revealing of the element will be animated (faded-in). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been shown.
		 */
		Device.prototype.showElement = function(options) {
			if (antie.framework.deviceConfiguration.animationDisabled || options.skipAnim) {
				options.el.style[_transitionProperty]= "";
				options.el.style.visibility = "visible";
				options.el.style.opacity = 1;
				if (typeof options.onComplete == "function") {
					options.onComplete();
				}
			} else {
				options.el.style.opacity = 0;
				options.el.style.visibility = "visible";
				var self = this;
				options.el.addEventListener(_transitionEndEvent, function(evt) {
					if (evt.target === options.el) {
						options.el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						options.el.style[_transitionProperty] = "";
						if (options.onComplete) {
							options.onComplete();
						}
					}
				}, true);

				options.el.style[_transitionProperty] = "opacity 1s linear";
				setTimeout(function() {
					options.el.style.opacity = 1;
				}, 100);

				return options.onComplete || true;
			}
		};
		

		/**
		* Describes if the device supports animation or not.
		*/
		Device.prototype.isAnimationDisabled = function(){
			return false;
		};
	}
);
