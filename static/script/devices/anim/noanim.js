/**
 * @fileOverview Requirejs modifier containing animation implementation to disable all animation
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def(
	'antie/devices/anim/noanim',
	['antie/devices/browserdevice'],
	function(Device) {
		/**
		 * Scroll an element so that its top-left corner is at the given position.
		 * @param {Element} el The element you wish to scroll.
		 * @param {Integer} [left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
		 * @param {Integer} [top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
		 * @param {Boolean} [skipAnim] By default the scroll will be animated, pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the scroll has been completed.
		 * @returns A handle to any animation started by this movement. {@see #stopAnimation}
		 */
		Device.prototype.scrollElementTo = function(el, left, top, skipAnim, onComplete) {
			if(new RegExp("_mask$").test(el.id)) {
				if(el.childNodes.length == 0) return null;
				el.style.position = 'relative';
				el = el.childNodes[0];
				el.style.position = 'relative';
			} else {
				return null;
			}
			var startLeft = Math.abs(el.style.left.replace(/px/, '')) | 0;
			var changeLeft = (left !== null) ? (left - startLeft) : 0;
			var startTop = Math.abs(el.style.top.replace(/px/, '')) | 0;
			var changeTop = (top !== null) ? (top - startTop) : 0;
			if((changeLeft == 0) && (changeTop == 0)) {
				if(onComplete) onComplete();
				return null;
			}

			if(left !== null) el.style.left = 0 - left + "px";
			if(top !== null) el.style.top = 0 - top + "px";
			if(onComplete) onComplete();

			return null;
		};

		/**
		 * Moves an element so that its top-left corner is at the given position.
		 * @param {Element} el The element you wish to move.
		 * @param {Integer} [left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
		 * @param {Integer} [top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
		 * @param {Boolean} [skipAnim] By default the movement will be animated, pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the move has been completed.
		 */
		Device.prototype.moveElementTo = function(el, left, top, skipAnim, onComplete) {
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.
	
			var startLeft = parseInt(el.style.left.replace(/px|em|pt/,"")) | 0;
			var changeLeft = (left !== null) ? (left - startLeft) : 0;
			var startTop = parseInt(el.style.top.replace(/px|em|pt/,"")) | 0;
			var changeTop = (top !== null) ? (top - startTop) : 0;

			if((changeLeft == 0) && (changeTop == 0)) return;

			if(left !== null) {el.style.left = left + "px";}
			if(top !== null) {el.style.top = top + "px";}
			if(onComplete) onComplete();
		}

		/**
		 * Stops the specified animation. The any completeHandler for the animation will be executed.
		 * @param {object} A handle to the animation you wish to stop.
		 */
		Device.prototype.stopAnimation = function(anim) {
			// Do nothing - there was no animation in the first place
		};

		/**
		 * Hides an element.
		 * @param {Element} el The element you wish to hide.
		 * @param {Boolean} [skipAnim] By default the hiding of the element will be animated (faded-out). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been hidden.
		 */
		Device.prototype.hideElement = function(el, skipAnim, onComplete) {
			el.style.visibility = "hidden";
			el.style.opacity = 0;
			if (typeof onComplete == "function") {
				onComplete();
			}
		};

		/**
		 * Shows an element.
		 * @param {Element} el The element you wish to show.
		 * @param {Boolean} [skipAnim] By default the revealing of the element will be animated (faded-in). Pass <code>true</code> here to prevent animation.
		 * @param {Function} [onComplete] Callback function to be called when the element has been shown.
		 */
		Device.prototype.showElement = function(el, skipAnim, onComplete) {
			el.style.visibility = "visible";
			el.style.opacity = 1;
			if (typeof onComplete == "function") {
				onComplete();
			}
		};

		/**
		 * Stops the specified animation. The any completeHandler for the animation will be executed.
		 * @name antie.devices.Device#stopAnimation
		 * @function
		 * @param {object} A handle to the animation you wish to stop.
		 */
		Device.prototype.stopAnimation = function(anim) {
			// Left intentionally blank
		};

        /**
         * Describes if the device supports animation or not
         */
        Device.prototype.isAnimationDisabled = function(){
            return true;
        };	
	}
);
