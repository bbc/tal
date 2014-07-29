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
		var _css3Prefix =	/WebKit/.test(navigator.userAgent) ? "webkit" : (
					/Gecko/.test(navigator.userAgent) ? "moz" : (
					/Opera/.test(navigator.userAgent) ? "o" : 
					""));

		var _transitionEndEvent = (_css3Prefix.length && _css3Prefix !== "moz") ? (_css3Prefix + "TransitionEnd") : "transitionend";

		if(_css3Prefix === "o") _css3Prefix = "O";
		else if(_css3Prefix === "moz") _css3Prefix = "Moz";
		var _transitionProperty = _css3Prefix.length ? (_css3Prefix + "Transition") : "transition";
		var _transformProperty = _css3Prefix.length ? (_css3Prefix + "Transform") : "transform";

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

		for(var p in ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']) {
			if((cssDetect.style[p] !== undefined) && testMediaQuery(_mediaQuery)) {
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
		Device.prototype.scrollElementTo = function(el, left, top, skipAnim, onComplete) {
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.

			if(new RegExp("_mask$").test(el.id)) {
				if(el.childNodes.length == 0) return null;
				el.style.position = 'absolute';
				el = el.childNodes[0];
				el.style.position = 'absolute';
			} else {
				return null;
			}

			var currentTranslation = getCurrentTranslation(el);
			left = ((left !== null && left !== undefined) ? (0 - left) : currentTranslation.left) || 0;
			top = ((top !== null && top !== undefined) ? (0 - top) : currentTranslation.top) || 0;

			var newTranslation = _translate + "(" + left + "px, " + top + "px" + (_supports3D ? ", 0" : "") + ")";
			if(el.lastAntieCSS3Scroll === newTranslation) {
				skipAnim = true;
			} else {
				el.lastAntieCSS3Scroll = newTranslation;
			}

			//this.getLogger().debug('Scrolling ' + el.id + ' to ' + left + ',' + top + '... ' + newTranslation);
			if(skipAnim) {
				el.style[_transformProperty] = newTranslation;
				if(onComplete) onComplete();
			} else {
				this.removeClassFromElement(el.parentNode, "notscrolling");	
				this.addClassToElement(el.parentNode, "scrolling");	
				this.removeClassFromElement(this.getTopLevelElement(), "notanimating");
				this.addClassToElement(this.getTopLevelElement(), "animating");

				var self = this;
				el.addEventListener(_transitionEndEvent, function(evt) {
					if(evt.target === el) {
						el.removeEventListener(_transitionEndEvent, arguments.callee, true);

						self.removeClassFromElement(el.parentNode, "scrolling");	
						self.addClassToElement(el.parentNode, "notscrolling");	
						self.removeClassFromElement(self.getTopLevelElement(), "animating");
						self.addClassToElement(self.getTopLevelElement(), "notanimating");
						self.removeClassFromElement(el, "transition");	
	
						if(onComplete) onComplete();
					}
				}, true);
				this.addClassToElement(el, "transition");	

				// the above className change does not happen instantly
				setTimeout(function() {
					el.style[_transformProperty] = newTranslation;
				}, 10);

				return onComplete || true;
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
		Device.prototype.moveElementTo = function(el, left, top, skipAnim, onComplete) {
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.

			var currentTranslation = getCurrentTranslation(el);
			left = ((left !== null && left !== undefined) ? left : currentTranslation.left) || 0;
			top = ((top !== null && top !== undefined) ? top : currentTranslation.top) || 0;

			var newTranslation = _translate + "(" + left + "px, " + top + "px" + (_supports3D ? ", 0" : "") + ")";
	
			//this.getLogger().debug("Moving " + el.id + " to " + left + "," + top + "... " + newTranslation + " skipAnim: " + skipAnim);
			
			if(skipAnim) {
				el.style[_transformProperty] = newTranslation;
				if(onComplete) onComplete();
			} else {
				this.removeClassFromElement(el, "notmoving");	
				this.addClassToElement(el, "moving");	
				this.removeClassFromElement(this.getTopLevelElement(), "notanimating");
				this.addClassToElement(this.getTopLevelElement(), "animating");

				var self = this;
				el.addEventListener(_transitionEndEvent, function(evt) {
					if(evt.target === el) {
						el.removeEventListener(_transitionEndEvent, arguments.callee, true);

						self.removeClassFromElement(el, "moving");	
						self.addClassToElement(el, "notmoving");	
						self.removeClassFromElement(self.getTopLevelElement(), "animating");
						self.addClassToElement(self.getTopLevelElement(), "notanimating");
						self.removeClassFromElement(el, "transition");	
	
						if(onComplete) onComplete();
					}
				}, true);
				this.addClassToElement(el, "transition");	

				// the above className change does not happen instantly
				setTimeout(function() {
					el.style[_transformProperty] = newTranslation;
				}, 10);

				return onComplete || true;
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
			if(typeof(anim) === "function") {
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
		Device.prototype.hideElement = function(el, skipAnim, onComplete) {
			if (skipAnim) {
				el.style[_transitionProperty] = "";
				el.style.visibility = "hidden";
				el.style.opacity = 0;
				if (typeof onComplete == "function") {
					onComplete();
				}
			} else {
				var self = this;
				el.addEventListener(_transitionEndEvent, function(evt) {
					if(evt.target === el) {
						el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						el.style[_transitionProperty] = "";
						el.style.visibility = "hidden";
						if(onComplete) onComplete();
					}
				}, true);

				el.style[_transitionProperty] = "opacity 1s linear";
				setTimeout(function() {
					el.style.opacity = 0;
				}, 100);

				return onComplete || true;
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
		Device.prototype.showElement = function(el, skipAnim, onComplete) {
			if (skipAnim) {
				el.style[_transitionProperty]= "";
				el.style.visibility = "visible";
				el.style.opacity = 1;
				if (typeof onComplete == "function") {
					onComplete();
				}
			} else {
				el.style.opacity = 0;
				el.style.visibility = "visible";

				var self = this;
				el.addEventListener(_transitionEndEvent, function(evt) {
					if(evt.target === el) {
						el.removeEventListener(_transitionEndEvent, arguments.callee, true);
						el.style[_transitionProperty] = "";
						if(onComplete) onComplete();
					}
				}, true);

				el.style[_transitionProperty] = "opacity 1s linear";
				setTimeout(function() {
					el.style.opacity = 1;
				}, 100);

				return onComplete || true;
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
