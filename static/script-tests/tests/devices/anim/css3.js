/**
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

(function() {
    // How many milliseconds to give a 'no animation' transition to complete
    var noAnimToleranceMs = 20;
    
    // jshint newcap: false
    this.CSS3AnimationTest = AsyncTestCase("Css3AnimationTest");

	this.CSS3AnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
		this.div = null;
	};

	this.CSS3AnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
		if(this.div) {
			this.div.parentNode.removeChild(this.div);
		}
	};

    this.CSS3AnimationTest.prototype.createScrollableDiv = function(device) {
        var inner;
		this.div = device.createContainer("id_mask");
		document.body.appendChild(this.div);
		this.div.style.overflow = "hidden";
		this.div.style.width = "10px";
		this.div.style.height = "10px";
		this.div.style.position = "absolute";
		inner = device.createContainer("id");
		inner.style.position = "absolute";
		inner.style.top = 0;
		inner.style.left = 0;
		inner.style.width = "1000px";
		inner.style.height = "1000px";
		device.appendChildElement(this.div, inner);

		return inner;
	};

    this.CSS3AnimationTest.prototype.getDefaultCssConfig = function() {
        return {
            "modules": {
                "base": "antie/devices/browserdevice",
                "modifiers": [
                    'antie/devices/data/json2',
                    'antie/devices/anim/css3'
                ]
            },
            "input": {
                "map": {}
            },
            "layouts": [
                {
                    "width": 960,
                    "height": 540,
                    "module": "fixtures/layouts/default",
                    "classes": ["browserdevice540p"]
                }
            ],
            "deviceConfigurationKey": "devices-html5-1"
        };
    };
    
	/**
	 * Get the transition properties for a given element from its CSS.
	 */
	this.CSS3AnimationTest.prototype.getTransition = function(el) {
		var regexp, match, durationMultiplier;
		regexp = /transition:\s*(\w+)\s+(\d+)(m?)s\s+(\w+)/i;
		match = regexp.exec(el.style.cssText);
		if (match) {
			durationMultiplier = match[3] === "m" ? 1 : 1000;
			return {
				property: match[1],
				duration: parseInt(match[2], 10) * durationMultiplier,
				easing: match[4]
			};
		} 
		
		return false;
		
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config;
		config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, self, startTime;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			self = this;
			startTime = Date.now();
			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("-100px", inner.style.getPropertyValue("left"));
					assertEquals("-200px", inner.style.getPropertyValue("top"));
					assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
				});

				device.scrollElementTo({
					el: this.div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: false,
					onComplete: onComplete
				});

			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoLeftValue = function(queue) {
		expectAsserts(2);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, self;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			self = this;
			
			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("0px", inner.style.getPropertyValue("left"));
					assertEquals("-200px", inner.style.getPropertyValue("top"));
				});

				device.scrollElementTo({
					el: this.div,
					to: {
						top: 200
					},
					skipAnim: false,
					onComplete: onComplete
				});
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoTopValue = function(queue) {
		expectAsserts(2);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, self;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			self = this;
			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("-100px", inner.style.getPropertyValue("left"));
					assertEquals("0px", inner.style.getPropertyValue("top"));
				});

				device.scrollElementTo({
					el: this.div,
					to: {
						left: 100
					},
					skipAnim: false,
					onComplete: onComplete
				});
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, startTime;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			startTime = Date.now();

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("-100px", inner.style.getPropertyValue("left"));
					assertEquals("-200px", inner.style.getPropertyValue("top"));
					assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
				});
				device.scrollElementTo({
					el: this.div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: true,
					onComplete: onComplete
				});
			});
		}, config);
	};
	
   this.CSS3AnimationTest.prototype.testScrollElementToWithNoAnimInConfig = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, inner, startTime;
            device = application.getDevice();
            inner = this.createScrollableDiv(device);
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var onComplete = callbacks.add(function() {
                    assertEquals("-100px", inner.style.getPropertyValue("left"));
                    assertEquals("-200px", inner.style.getPropertyValue("top"));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.scrollElementTo({
                    el: this.div,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
            });
        }, config);
    };

	/**
	 * scrollElementTo() requires an element with an ID ending in _mask. Ensure that the method
	 * returns a falsy value if the element passed in doesn't conform.
	 */
	this.CSS3AnimationTest.prototype.testScrollElementRejectsNonMaskElement = function(queue) {
		expectAsserts(1);
		
		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			result = device.scrollElementTo({
				el: inner, // element does NOT have an id ending in _mask
				to: {
					left: 100,
					top: 200
				},
				skipAnim : false
			});
			
			assertFalse(!!result);
		}, config);
	};
	
	/**
	 * scrollElementTo() requires an element with an ID ending in _mask. Ensure that the method
	 * returns a truthy result if this is correctly passed in.
	 */
	this.CSS3AnimationTest.prototype.testScrollElementToRequiresMaskElement = function(queue) {
		expectAsserts(1);
		
		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			result = device.scrollElementTo({
				el: this.div, // element has an id ending in _mask
				to: {
					left: 100,
					top: 200
				},
				skipAnim : false
			});
			
			assert('scrollElementTo() returns truthy result (not null)', !!result);
		}, config);
	};
	
	/**
	 * scrollElementTo() requires an element with an ID ending in _mask and a child node.
	 * Ensure that the method returns a falsy value if the _mask element has no children.
	 */
	this.CSS3AnimationTest.prototype.testScrollElementToRequiresMaskElementChild = function(queue) {
		expectAsserts(1);
		
		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = this.createScrollableDiv(device);
			this.div.removeChild(inner); // this.div now has no children
			
			result = device.scrollElementTo({
				el: this.div, // element has an id ending in _mask
				to: {
					left: 100,
					top: 200
				},
				skipAnim : false
			});
			
			assertFalse(!!result);
		}, config);
	};	

	this.CSS3AnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, div, startTime;
			device = application.getDevice();
			div = this.createScrollableDiv(device);
			startTime = Date.now();

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("100px", div.style.getPropertyValue("left"));
					assertEquals("200px", div.style.getPropertyValue("top"));
					assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
				});
				device.moveElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: false,
					onComplete: onComplete
				});

			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, div, startTime;
			device = application.getDevice();
			div = this.createScrollableDiv(device);
			startTime = Date.now();

			queue.call("Wait for tween", function(callbacks) {

				var onComplete = callbacks.add(function() {
					assertEquals("100px", div.style.getPropertyValue("left"));
					assertEquals("200px", div.style.getPropertyValue("top"));
					assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
				});
				device.moveElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: true,
					onComplete: onComplete
				});
			});
		}, config);
	};
	
   this.CSS3AnimationTest.prototype.testMoveElementToWithNoAnimInConfig = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = this.createScrollableDiv(device);
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {

                var onComplete = callbacks.add(function() {
                    assertEquals("100px", div.style.getPropertyValue("left"));
                    assertEquals("200px", div.style.getPropertyValue("top"));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.moveElementTo({
                    el: div,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
            });
        }, config);
    };


	this.CSS3AnimationTest.prototype.testHideElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, startTime;
			device = application.getDevice();
			startTime = Date.now();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("hidden", this.div.style.visibility);
					assertEquals(0, parseFloat(this.div.style.opacity));
					assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
				});
				device.hideElement({
					el: this.div,
					skipAnim: false,
					onComplete: onComplete
				});
			});
		}, config);
	};
	this.CSS3AnimationTest.prototype.testHideElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, startTime;
			device = application.getDevice();
			startTime = Date.now();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("hidden", this.div.style.visibility);
					assertEquals(0, parseFloat(this.div.style.opacity));
					assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
				});
				device.hideElement({
					el: this.div,
					skipAnim: true,
					onComplete: onComplete
				});
			});
		}, config);
	};
	
   this.CSS3AnimationTest.prototype.testHideElementWithNoAnimInConfig = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultCssConfig(); 
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, startTime;
            device = application.getDevice();
            startTime = Date.now();
            this.createScrollableDiv(device);

            queue.call("Wait for tween", function(callbacks) {
                var onComplete = callbacks.add(function() {
                    assertEquals("hidden", this.div.style.visibility);
                    assertEquals(0, parseFloat(this.div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.hideElement({
                    el: this.div,
                    onComplete: onComplete
                });
            });
        }, config);
    };

	this.CSS3AnimationTest.prototype.testShowElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, startTime;
			device = application.getDevice();
			startTime = Date.now();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("visible", this.div.style.visibility);
					assertEquals(1, parseFloat(this.div.style.opacity));
					assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
				});
				device.showElement({
					el: this.div,
					skipAnim: false,
					onComplete: onComplete
				});
			});
		}, config);
	};
	this.CSS3AnimationTest.prototype.testShowElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = this.getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, startTime;
			device = application.getDevice();
			startTime = Date.now();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("visible", this.div.style.visibility);
					assertEquals(1, parseFloat(this.div.style.opacity));
					assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
				});
				device.showElement({
					el: this.div,
					skipAnim: true,
					onComplete: onComplete
				});
			});
		}, config);
	};

    this.CSS3AnimationTest.prototype.testShowElementWithNoAnimInConfig = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultCssConfig(); 
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, startTime;
            device = application.getDevice();
            startTime = Date.now();
            this.createScrollableDiv(device);

            queue.call("Wait for tween", function(callbacks) {
                var onComplete = callbacks.add(function() {
                    assertEquals("visible", this.div.style.visibility);
                    assertEquals(1, parseFloat(this.div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.showElement({
                    el: this.div,
                    onComplete: onComplete
                });
            });
        }, config);
    };

    /**
     * Where specific parameters for FPS, duration and easing are passed to showElement(), ensure
     * these are passed on the CSS3 transition property.
     */
    this.CSS3AnimationTest.prototype.testSpecificShowAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");
            
            device.showElement({
                el: div,
                duration: 123
            });
            
            transition = this.getTransition(div);
            
            assert('Valid transition property is set', !!transition);
            assertEquals('Duration passed through', 123, transition.duration);
        }, config);
    };
    
    /**
     * Where specific parameters for FPS, duration and easing are passed to hideElement(), ensure
     * these are passed on to the CSS3 transition property.
     */
    this.CSS3AnimationTest.prototype.testSpecificHideAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");

            device.hideElement({
                el: div,
                duration: 321
            });
            
            transition = this.getTransition(div);
            
            assert('Valid transition property is set', !!transition);
            assertEquals('Duration passed through', 321, transition.duration);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to showElement(),
     * and no defaults are specified in the device config file, ensure the hardcoded default parameters
     * are passed to the CSS3 transition property.
     */
    this.CSS3AnimationTest.prototype.testDefaultShowAnimationPropertiesPassedToTransiton = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");
            
            device.showElement({
                el: div // No animation properties provided, defaults will be used
            });
            
            transition = this.getTransition(div);
            
            assert('Valid transition property is set', !!transition);
            assertEquals('Duration passed through', 840, transition.duration);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to hideElement(),
     * and no defaults are specified in the device config file, ensure the hardcoded default parameters
     * are passed to the CSS3 transition property.
     */
    this.CSS3AnimationTest.prototype.testDefaultHideAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");
            
            device.hideElement({
                el: div // No animation properties provided, defaults will be used
            });
            
            transition = this.getTransition(div);
            
            assert('Valid transition property is set', !!transition);
            assertEquals('Duration passed through', 840, transition.duration);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to showElement(),
     * ensure the defaults from the device config file are used.
     */
    this.CSS3AnimationTest.prototype.testConfigurationShowAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

        // This is the configuration!!
        var config;
        config = this.getDefaultCssConfig();
        
        config.defaults = {
            "showElementFade": {
                "fps": 11, 
                "duration": 555,
                "easing": "easeInCubic"
            }
        };

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [
                'antie/devices/anim/css3/transitiondefinition'
            ], 
            function(application, TransitionDefinition) {
                var device, div, durSpy;
                durSpy = this.sandbox.spy(TransitionDefinition.prototype, "getPropertyDuration").withArgs("opacity");
                device = application.getDevice();
                div = device.createContainer("id");
                
                device.showElement({
                    el: div // No animation properties provided, config will be used
                });
                assert('Check prototype override: ', durSpy.called);
                assert('Check config value made it through: ', durSpy.returned(555));
            }, config
        );
    };
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to hideElement(),
     * ensure the defaults from the device config file are used.
     */
    this.CSS3AnimationTest.prototype.testConfigurationHideAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

        // This is the configuration!!        
        var config;
        config = this.getDefaultCssConfig();
        config.defaults = {
            "hideElementFade": {
                "fps": 22, 
                "duration": 777,
                "easing": "easeInQuint"
             }
        };

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [
                'antie/devices/anim/css3/transitiondefinition'
            ], 
            function(application, TransitionDefinition) {
                var device, div, durSpy;
                durSpy = this.sandbox.spy(TransitionDefinition.prototype, "getPropertyDuration").withArgs("opacity");
                device = application.getDevice();
                div = device.createContainer("id");
                
                device.hideElement({
                    el: div // No animation properties provided, config will be used
                });
                assert('Check prototype override: ', durSpy.called);
                assert('Check config value made it through: ', durSpy.returned(777));
            }, config
        );
    };

    this.CSS3AnimationTest.prototype.getElement = function(styleProps) {
        var el, prop, additionalProperties;
        additionalProperties = styleProps || {};
        el = {
            style: {
                setProperty: function(property, value) {
                    el.style[property] = value;
                },
                getPropertyValue: function(property) {
                    return el.style[property];
                }
            },
            addEventListener: function(name, f) {},
            removeEventListener: function(name, f) {}
        };
        return el;

        for (prop in additionalProperties) {
            if(prop.hasOwnProperty(prop)) {
                el.style[prop] = styleProps[prop];
            }
        }
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleSetsStartAndEnd = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application, MockElement) {
                var device, transition, el, options, setSpy;
                device = application.getDevice();
                el = this.getElement({
                    width: "10px",
                    height: "10px"
                });
                setSpy = this.sandbox.spy(el.style, 'setProperty');

                queue.call("Wait for tween", function(callbacks) {
                    var onComplete;
                    onComplete = callbacks.add(function() {
                        assertTrue('To value set on element', setSpy.calledWith('width', '100px'));
                    });

                    options = {
                        el: el,
                        from: { width: 60 },
                        to: { width: 100 },
                        duration: 50,
                        onComplete: onComplete
                    };

                    // Firefox cries if you try to call this on a fake DOM element, so stub it out
                    this.sandbox.stub(window, 'getComputedStyle');

                    device.tweenElementStyle(options);
                    assertTrue('From value set on element', setSpy.calledWith('width', '60px'));
                    setTimeout(onComplete, 50);
                });
            },
            config
        );
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleFiresOnComplete = function(queue) {
        expectAsserts(1);
        var config = this.getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application, MockElement) {
                var device, transition, el, options, listenSpy;
                device = application.getDevice();
                el = this.getElement();

                options = {
                    el: el,
                    from: { width: 60 },
                    to: { width: 100 },
                    duration: 50,
                    onComplete: function(){},
                    skipAnim: true
                };

                // Firefox cries if you try to call this on a fake DOM element, so stub it out
                this.sandbox.stub(window, 'getComputedStyle');

                listenSpy = this.sandbox.spy(el, 'addEventListener');

                device.tweenElementStyle(options);
                assertTrue('onComplete callback added', listenSpy.calledOnce);

            },
            config
        );
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleSetsUnits = function(queue) {
        expectAsserts(1);
        var config = this.getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application, MockElement) {
                var device, transition, el, options, fromSpy;
                device = application.getDevice();
                el = this.getElement();

                options = {
                    el: el,
                    from: { width: 60 },
                    to: { width: 100 },
                    units: {
                        width: "PIES"
                    },
                    duration: 50,
                    onComplete: function(){},
                    skipAnim: true
                };

                // Firefox cries if you try to call this on a fake DOM element, so stub it out
                this.sandbox.stub(window, 'getComputedStyle');

                fromSpy = this.sandbox.spy(el.style, 'setProperty');
                device.tweenElementStyle(options);
                assertTrue('onComplete callback added', fromSpy.calledWith('width', '60PIES'));
            },
            config
        );
    };
}());
