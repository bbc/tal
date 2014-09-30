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

    var createScrollableDiv = function(self, device) {
        var inner;
		self.div = device.createContainer("id_mask");
		document.body.appendChild(self.div);
		self.div.style.overflow = "hidden";
		self.div.style.width = "10px";
		self.div.style.height = "10px";
		self.div.style.position = "absolute";
		inner = device.createContainer("id");
		inner.style.position = "absolute";
		inner.style.top = 0;
		inner.style.left = 0;
		inner.style.width = "1000px";
		inner.style.height = "1000px";
		device.appendChildElement(self.div, inner);

		return inner;
	};

    var getDefaultCssConfig = function() {
        return {
            "modules": {
                "base": "antie/devices/browserdevice",
                "modifiers": [
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
	var getTransition = function(el) {
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

	this.CSS3AnimationTest.prototype.testScrollElementTo = function(queue) {
		expectAsserts(2);

		var self = this;
		var config;
		config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);
			device.scrollElementTo({
				el: self.div,
				to: {
					left: 100,
					top: 200
				},
				skipAnim: false
			});

            assertEquals("-100px", inner.style.getPropertyValue("left"));
            assertEquals("-200px", inner.style.getPropertyValue("top"));
		}, config);
	};

	// TODO: need to test that scrollElementTo() with skipAnim = false calls onComplete eventually

    this.CSS3AnimationTest.prototype.testScrollElementToWithAnimDoesNotCallOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, inner, onCompleteStub;
            device = application.getDevice();
            inner = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.scrollElementTo({
                el: self.div,
                to: {
                    left: 100,
                    top: 200
                },
                skipAnim: false,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.notCalled);
        }, config);
    };

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoLeftValue = function(queue) {
		expectAsserts(2);

		var config = getDefaultCssConfig();
		var self = this;

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);

			device.scrollElementTo({
				el: self.div,
				to: {
					top: 200
				},
				skipAnim: false
			});

            assertEquals("0px", inner.style.getPropertyValue("left"));
            assertEquals("-200px", inner.style.getPropertyValue("top"));
		}, config);
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoTopValue = function(queue) {
		expectAsserts(2);

		var self = this;
		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);

			device.scrollElementTo({
				el: self.div,
				to: {
					left: 100
				},
				skipAnim: false
			});

            assertEquals("-100px", inner.style.getPropertyValue("left"));
            assertEquals("0px", inner.style.getPropertyValue("top"));
		}, config);
	};

    this.CSS3AnimationTest.prototype.testScrollElementToWithNoAnimCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, inner, onCompleteStub;
            device = application.getDevice();
            inner = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.scrollElementTo({
                el: self.div,
                to: {
                    left: 100,
                    top: 200
                },
                skipAnim: true,
                onComplete: onCompleteStub
            });

            assertTrue(onCompleteStub.calledOnce);
        }, config);
    };

    this.CSS3AnimationTest.prototype.testScrollElementToWithNoAnimInConfigCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, inner, onCompleteStub;
            device = application.getDevice();
            inner = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.scrollElementTo({
                el: self.div,
                to: {
                    left: 100,
                    top: 200
                },
                onComplete: onCompleteStub
            });

            assertTrue(onCompleteStub.calledOnce);
        }, config);
    };

	/**
	 * scrollElementTo() requires an element with an ID ending in _mask. Ensure that the method
	 * returns a falsy value if the element passed in doesn't conform.
	 */
	this.CSS3AnimationTest.prototype.testScrollElementRejectsNonMaskElement = function(queue) {
		expectAsserts(1);

		var self = this;
		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);
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
		var self = this;

		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);
			result = device.scrollElementTo({
				el: self.div, // element has an id ending in _mask
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
		var self = this;

		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, inner, result;
			device = application.getDevice();
			inner = createScrollableDiv(self,device);
			self.div.removeChild(inner); // self.div now has no children

			result = device.scrollElementTo({
				el: self.div, // element has an id ending in _mask
				to: {
					left: 100,
					top: 200
				},
				skipAnim : false
			});

			assertFalse(!!result);
		}, config);
	};

	this.CSS3AnimationTest.prototype.testMoveElementTo = function(queue) {
		expectAsserts(2);
		var self = this;

		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device, div;
			device = application.getDevice();
			div = createScrollableDiv(self,device);

			device.moveElementTo({
				el: div,
				to: {
					left: 100,
					top: 200
				},
				skipAnim: false
			});

			assertEquals("100px", div.style.getPropertyValue("left"));
            assertEquals("200px", div.style.getPropertyValue("top"));
		}, config);
	};

	// TODO: need to test that moveElementTo() with skipAnim = false calls onComplete eventually

    this.CSS3AnimationTest.prototype.testMoveElementToWithAnimDoesNotCallOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, onCompleteStub;
            device = application.getDevice();
            div = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.moveElementTo({
                el: div,
                to: {
                    left: 100,
                    top: 200
                },
                skipAnim: false,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.notCalled);
        }, config);
    };

    this.CSS3AnimationTest.prototype.testMoveElementToWithNoAnimCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, onCompleteStub;
            device = application.getDevice();
            div = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.moveElementTo({
                el: div,
                to: {
                    left: 100,
                    top: 200
                },
                skipAnim: true,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

    this.CSS3AnimationTest.prototype.testMoveElementToWithNoAnimInConfigCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, onCompleteStub;
            device = application.getDevice();
            div = createScrollableDiv(self,device);
            onCompleteStub = self.sandbox.stub();

            device.moveElementTo({
                el: div,
                to: {
                    left: 100,
                    top: 200
                },
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

	this.CSS3AnimationTest.prototype.testHideElement = function(queue) {
		expectAsserts(2);
		var self = this;

		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			createScrollableDiv(self,device);

			device.hideElement({
				el: self.div,
				skipAnim: false
			});

            assertEquals("hidden", self.div.style.visibility);
            assertEquals(0, parseFloat(self.div.style.opacity));
		}, config);
	};

	// TODO: need to test that hideElement() with skipAnim = false calls onComplete eventually

    this.CSS3AnimationTest.prototype.testHideElementWithNoAnimCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, onCompleteStub;
            device = application.getDevice();
            onCompleteStub = self.sandbox.stub();
            createScrollableDiv(self,device);

            device.hideElement({
                el: self.div,
                skipAnim: true,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

    this.CSS3AnimationTest.prototype.testHideElementWithNoAnimInConfigCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, onCompleteStub;
            device = application.getDevice();
            onCompleteStub = self.sandbox.stub();
            createScrollableDiv(self,device);

            device.hideElement({
                el: self.div,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

	this.CSS3AnimationTest.prototype.testShowElement = function(queue) {
		expectAsserts(2);

		var self = this;
		var config = getDefaultCssConfig();

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			createScrollableDiv(self,device);

			device.showElement({
				el: self.div,
				skipAnim: false
			});

            assertEquals("visible", self.div.style.visibility);
            assertEquals(1, parseFloat(self.div.style.opacity));
		}, config);
	};

	// TODO: need to test that showElement() with skipAnim = false calls onComplete eventually

	this.CSS3AnimationTest.prototype.testShowElementWithNoAnimCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, onCompleteStub;
            device = application.getDevice();
            onCompleteStub = self.sandbox.stub();
            createScrollableDiv(self,device);

            device.showElement({
                el: self.div,
                skipAnim: true,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

    this.CSS3AnimationTest.prototype.testShowElementWithNoAnimInConfigCallsOnCompleteImmediately = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getDefaultCssConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, onCompleteStub;
            device = application.getDevice();
            onCompleteStub = self.sandbox.stub();
            createScrollableDiv(self,device);

            device.showElement({
                el: self.div,
                onComplete: onCompleteStub
            });

            assert(onCompleteStub.calledOnce);
        }, config);
    };

	/**
     * Where specific parameters for FPS, duration and easing are passed to showElement(), ensure
     * these are passed on the CSS3 transition property.
     */
    this.CSS3AnimationTest.prototype.testSpecificShowAnimationPropertiesPassedToTransition = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");

            device.showElement({
                el: div,
                duration: 123
            });

            transition = getTransition(div);

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

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");

            device.hideElement({
                el: div,
                duration: 321
            });

            transition = getTransition(div);

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

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");

            device.showElement({
                el: div // No animation properties provided, defaults will be used
            });

            transition = getTransition(div);

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

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, transition;
            device = application.getDevice();
            div = device.createContainer("id");

            device.hideElement({
                el: div // No animation properties provided, defaults will be used
            });

            transition = getTransition(div);

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

	var self = this;
        // This is the configuration!!
        var config;
        config = getDefaultCssConfig();

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
                durSpy = self.sandbox.spy(TransitionDefinition.prototype, "getPropertyDuration").withArgs("opacity");
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

	var self = this;
        // This is the configuration!!
        var config;
        config = getDefaultCssConfig();
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
                durSpy = self.sandbox.spy(TransitionDefinition.prototype, "getPropertyDuration").withArgs("opacity");
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

    var getElement = function(styleProps) {
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
            addEventListener: function() {},
            removeEventListener: function() {}
        };

        for (prop in additionalProperties) {
            if(prop.hasOwnProperty(prop)) {
                el.style[prop] = styleProps[prop];
            }
        }
        return el;
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleSetsStartAndEnd = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/devices/anim/css3/transitionelement'],
            function(application, TransitionElement) {
                var device, el, options, setSpy;
                device = application.getDevice();
                el = getElement({
                    width: "10px",
                    height: "10px"
                });
                setSpy = self.sandbox.spy(el.style, 'setProperty');

                options = {
                    el: el,
                    from: { width: 60 },
                    to: { width: 100 },
                    duration: 50
                };

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle');

                device.tweenElementStyle(options);
                assertTrue('From value set on element', setSpy.calledWith('width', '60px'));
                assertTrue('To value set on element', setSpy.calledWith('width', '100px'));
            },
            config
        );
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleFiresOnComplete = function(queue) {
        expectAsserts(1);
	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/devices/anim/css3/transitionelement'],
            function(application, TransitionElement) {
                var device, el, options, listenSpy;
                device = application.getDevice();
                el = getElement();

                options = {
                    el: el,
                    from: { width: 60 },
                    to: { width: 100 },
                    duration: 50,
                    onComplete: function(){},
                    skipAnim: true
                };

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                listenSpy = self.sandbox.spy(el, 'addEventListener');

                device.tweenElementStyle(options);
                assertTrue('onComplete callback added', listenSpy.calledOnce);

            },
            config
        );
    };

    this.CSS3AnimationTest.prototype.testTweenElementStyleSetsUnits = function(queue) {
        expectAsserts(1);
	var self = this;
        var config = getDefaultCssConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/devices/anim/css3/transitionelement'],
            function(application, TransitionElement) {
                var device, el, options, fromSpy;
                device = application.getDevice();
                el = getElement();

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

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle');

                fromSpy = self.sandbox.spy(el.style, 'setProperty');
                device.tweenElementStyle(options);
                assertTrue('setProperty called with expected parameters', fromSpy.calledWith('width', '60PIES'));
            },
            config
        );
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/anim/css3'], this.CSS3AnimationTest);

}());
