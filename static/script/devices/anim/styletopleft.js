/**
 * @fileOverview Requirejs modifier for animations based on modifying CSS top/left properties
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
	'antie/devices/anim/styletopleft',
	[
		'antie/devices/browserdevice',
		'antie/devices/anim/shared/transitionendpoints',
		'antie/devices/anim/tween'
	],
	function(Device, TransitionEndPoints)  {
        'use strict';

		function movesScroll( startLeft, startTop, changeLeft, changeTop, options ){
		    var to, from;
			if ((changeLeft === 0) && (changeTop === 0)) {
					if (options.onComplete) {
						options.onComplete();
					}
					return null;
				}

			if (this.getConfig().animationDisabled || options.skipAnim) {
				if (options.to.left !== undefined) {
					options.el.style.left = options.to.left + "px";
				}
				if (options.to.top !== undefined) {
					options.el.style.top = options.to.top + "px";
				}

				if (options.onComplete) {
					options.onComplete();
				}
                return null;
			} else {
				from = {};
				if (startTop !== undefined) {
					from.top = startTop + "px";
				}
				if (startLeft !== undefined) {
					from.left = startLeft + "px";
				}

				to = {};
				if (options.to.top !== undefined) {
					to.top = (options.to.top) + "px";
				}
				if (options.to.left !== undefined) {
					to.left = (options.to.left) + "px";
				}

				return this._tween({
					el: options.el,
					style: options.el.style,
					from: from,
					to: to,
					offset: options.offset || 0,
					easing: options.easing,
					fps: options.fps,
					duration: options.duration,
					onComplete: options.onComplete
				});
			}
		}
        /* documented in antie.devices.Device */
		Device.prototype.scrollElementTo = function(options) {
		    var startLeft, changeLeft, startTop, changeTop, newOptions;
			// Helper function to return an object that inherits from the original
			function inherit(original) {
				function Inherited() {}
				
				Inherited.prototype = original;
				return new Inherited();
			}
			
			// Make a new modifiable options object inheriting from the original. Need to do this rather than
			// simply reverting any changes before returning, as the tweening library calls onComplete() which
			// may require an unchanged object.
			newOptions = inherit(options);
			if (options.to) {
				newOptions.to = inherit(options.to);
			}

			// Check validity of call and use child element as the real target
			if (new RegExp("_mask$").test(options.el.id)) {
				if (options.el.childNodes.length === 0) {
					return null;
				}
				options.el.style.position = 'relative';
				newOptions.el = options.el.childNodes[0];
				newOptions.el.style.position = 'relative';
			} else {
				return null;
			}
			
			// Make a copy of the 'to' property, with the sign of the 'top' and 'left' properties flipped.
			if (options.to && options.to.left) {
				newOptions.to.left = -options.to.left;
			}
			if (options.to && options.to.top) {
				newOptions.to.top = -options.to.top;
			}

			startLeft = newOptions.el.style.left.replace(/px/, '') || 0;
			changeLeft = (options.to.left !== undefined) ? (options.to.left - Math.abs(startLeft)) : 0;
			startTop = newOptions.el.style.top.replace(/px/, '') || 0;
			changeTop = (options.to.top !== undefined) ? (options.to.top - Math.abs(startTop)) : 0;

			return movesScroll.apply( this, [ startLeft, startTop, changeLeft, changeTop, newOptions ] );
		};

        /* documented in antie.devices.Device */
		Device.prototype.moveElementTo = function(options) {
		    var startLeft, changeLeft, startTop, changeTop;
			// Performance consideration: if left or top is null they are ignored to prevent the additional
			// work animating them.

			startLeft = parseInt(options.el.style.left.replace(/px|em|pt/,""), 10) || 0;
			changeLeft = (options.to.left !== undefined) ? (options.to.left - startLeft) : 0;
			startTop = parseInt(options.el.style.top.replace(/px|em|pt/,""), 10) || 0;
			changeTop = (options.to.top !== undefined) ? (options.to.top - startTop) : 0;

			return movesScroll.apply( this, [ startLeft, startTop, changeLeft, changeTop, options ] );
		};

        /* documented in antie.devices.device */
		Device.prototype.hideElement = function(options) {
		    var animationDefaults;
			if (this.getConfig().animationDisabled || options.skipAnim) {
				options.el.style.visibility = "hidden";
				options.el.style.opacity = 0;
				if (typeof options.onComplete === "function") {
					options.onComplete();
				}
                return null;
			} else {
				animationDefaults = this.getConfig().defaults && this.getConfig().defaults.hideElementFade || {};
				return this._tween({
					el: options.el,
					style: options.el.style,
					from: {
                        opacity: isNaN(parseInt(options.el.style.opacity, 10)) ? 1 : parseFloat(options.el.style.opacity)
					},
					to: {
						opacity: 0
					},
					fps: options.fps || animationDefaults.fps || 25,
					duration: options.duration || animationDefaults.duration || 840,
					easing: options.easing || animationDefaults.easing || 'linear',
					onComplete: function() {
						options.el.style.visibility = 'hidden';
						if (options.onComplete) {
							options.onComplete();
						}
					}
				});
			}
		};

		/* documented in antie.devices.device */
		Device.prototype.showElement = function(options) {
		    var animationDefaults;
			if (this.getConfig().animationDisabled || options.skipAnim) {
				options.el.style.visibility = "visible";
				options.el.style.opacity = 1;
				if (typeof options.onComplete === "function") {
					options.onComplete();
				}
                return undefined;
			} else {
				animationDefaults = this.getConfig().defaults && this.getConfig().defaults.showElementFade || {};
				return this._tween({
					el: options.el,
					style: options.el.style,
					from: {
                        opacity : isNaN(parseInt(options.el.style.opacity, 10)) ? 0 : parseFloat(options.el.style.opacity)
					},
					to: {
						opacity: 1
					},
					fps: options.fps || animationDefaults.fps || 25,
					duration: options.duration || animationDefaults.duration || 840,
					easing: options.easing || animationDefaults.easing || 'linear',
					onComplete: options.onComplete,
					onStart: function () {
						options.el.style.visibility = 'visible';
					}
				});
			}
		};
        
        Device.prototype.tweenElementStyle = function(options) {
            
            var endPoints;

            function fireComplete() {
                if(options.onComplete) {
                    options.onComplete();
                }
            }

            function skipAnimation() {
                var i, properties, property;
                properties = endPoints.getProperties();
                for(i = 0; i !== properties.length; i += 1) {
                    property = properties[i];
                    options.el.style[property] = endPoints.getPropertyDestination(property);
                }
            }
            
            function getTweenOptions(){
                var i, properties, property, tweenOptions;
                properties = endPoints.getProperties();
                tweenOptions = {
                    el: options.el,
                    style: options.el.style,
                    fps: options.el.fps,
                    duration: options.duration,
                    easing: options.easing,
                    onComplete: options.onComplete
                };
                tweenOptions.to = {};
                tweenOptions.from = {};
                
                for(i = 0; i !== properties.length; i += 1) {
                    property = properties[i];
                    tweenOptions.to[property] = endPoints.getPropertyDestination(property);
                    tweenOptions.from[property] = endPoints.getPropertyOrigin(property);
                }
                return tweenOptions;
            }
            
            endPoints = new TransitionEndPoints(options);
            endPoints.completeOriginsUsingElement(options.el);
            
            if(endPoints.toAndFromAllEqual()) {
                fireComplete();
                return null;
            } 
            
            if(options.skipAnim  || this.getConfig().animationDisabled) {
                skipAnimation();
                fireComplete();
                return undefined;
            }
            
            return this._tween(getTweenOptions());
        };
        
        /* documented in antie.devices.Device */
		Device.prototype.stopAnimation = function(anim) {
			anim.stop(true);
		};

        /* documented in antie.devices.Device */
		Device.prototype.isAnimationDisabled = function(){
			return false;
		};
	}
);