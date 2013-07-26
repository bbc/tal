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
    this.StyleTopLeftAnimationTest = AsyncTestCase("StyleTopLeftAnimation");

    this.StyleTopLeftAnimationTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.StyleTopLeftAnimationTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.StyleTopLeftAnimationTest.prototype.getDefaultConfig = function() {
        var config = {
            "modules": {
                "base": "antie/devices/browserdevice",
                "modifiers": [
                    'antie/devices/anim/styletopleft'
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
        return config;
    };

    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, inner, startTime;
            device = application.getDevice();
            div = device.createContainer("id_mask");
            inner = device.createContainer("id");
            startTime = Date.now();
            device.appendChildElement(div, inner);

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(-100, parseFloat(inner.style.left.replace(/px$/, '')));
                    assertEquals(-200, parseFloat(inner.style.top.replace(/px$/, '')));
                    assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
                });
                device.scrollElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithAnimNoMovement = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, inner;
            device = application.getDevice();
            div = device.createContainer("id_mask");
            inner = device.createContainer("id");
            device.appendChildElement(div, inner);

            inner.style.top = "200px";
            inner.style.left = "100px";

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');
                onComplete = callbacks.add(function() {
                    assert('onComplete called', true);
                });
                device.scrollElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, inner, startTime;
            device = application.getDevice();
            div = device.createContainer("id_mask");
            inner = device.createContainer("id");
            startTime = Date.now();
            device.appendChildElement(div, inner);

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(-100, parseFloat(inner.style.left.replace(/px$/, '')));
                    assertEquals(-200, parseFloat(inner.style.top.replace(/px$/, '')));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.scrollElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: true,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    /**
     * Test scrollElementTo() skips animation when specified in config.
     */
    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithNoAnimInConfig = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig(); 
        config.animationDisabled = "true";
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, inner, startTime;
            device = application.getDevice();
            div = device.createContainer("id_mask");
            inner = device.createContainer("id");
            startTime = Date.now();
            device.appendChildElement(div, inner);

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(-100, parseFloat(inner.style.left.replace(/px$/, '')));
                    assertEquals(-200, parseFloat(inner.style.top.replace(/px$/, '')));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.scrollElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };


    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(100, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(200, parseFloat(div.style.top.replace(/px$/, '')));
                    assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    from: {
                        left: 100,
                        top: 200
                    },
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnimAndNoDefaultValues = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(100, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(200, parseFloat(div.style.top.replace(/px$/, '')));
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    from: {
                        left: div.style.left,
                        top: div.style.top
                    },
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testHideElementWithAnimAndNoDefaultOpacity = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(0, parseFloat(div.style.opacity));
                });
                device.hideElement({
                    el: div,
                    style: div.style,
                    from: {
                        opacity: div.style.opacity
                    },
                    to: {
                        opacity: 0
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };

    /**
     * This test is designed to icolate an edge case which existed in the framework in which if an element is shown
     * and hidden without an opacity value set the animation fails
     * @param queue
     */
    this.StyleTopLeftAnimationTest.prototype.testShowAndHideElementToWithAnimAndNoDefaultOpacity = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, hideElement, showElementonComplete, hideElementonComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                hideElement = function() {
                    device.hideElement({
                        el: div,
                        style: div.style,
                        from: {
                            opacity: div.style.opacity
                        },
                        to: {
                            opacity: 0
                        },
                        skipAnim: false,
                        onComplete: hideElementonComplete
                    });
                };

                showElementonComplete = callbacks.add(function() {
                    assertEquals(1, parseFloat(div.style.opacity));
                    hideElement();
                });

                hideElementonComplete = callbacks.add(function() {
                    assertEquals(0, parseFloat(div.style.opacity));
                });

                device.showElement({
                    el: div,
                    style: div.style,
                    from: {
                        opacity: div.style.opacity
                    },
                    to: {
                        opacity: 1
                    },
                    skipAnim: false,
                    onComplete: showElementonComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };


    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoLeftValue = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(0, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(200, parseFloat(div.style.top.replace(/px$/, '')));
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    from: {
                        top: 200
                    },
                    to: {
                        top: 200
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoTopValue = function(queue) {
        expectAsserts(3);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(100, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(0, parseFloat(div.style.top.replace(/px$/, '')));
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    from: {
                        left: 100
                    },
                    to: {
                        left: 100
                    },
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnimNoMovement = function(queue) {
        expectAsserts(2);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div;
            device = application.getDevice();
            div = device.createContainer("id");

            div.style.top = "200px";
            div.style.left = "100px";

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assert('onComplete called', true);
                });

                device.moveElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(100, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(200, parseFloat(div.style.top.replace(/px$/, '')));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: true,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    /**
     * Test moveElementTo() skips animation when specified in config.
     */
    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoAnimInConfig = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig(); 
        config.animationDisabled = "true";
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals(100, parseFloat(div.style.left.replace(/px$/, '')));
                    assertEquals(200, parseFloat(div.style.top.replace(/px$/, '')));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testHideElementWithAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("hidden", div.style.visibility);
                    assertEquals(0, parseFloat(div.style.opacity));
                    assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
                });
                device.hideElement({
                    el: div,
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testHideElementWithNoAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("hidden", div.style.visibility);
                    assertEquals(0, parseFloat(div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.hideElement({
                    el: div,
                    skipAnim: true,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    /**
     * Test hideElement() skips animation when specified in config.
     */
    this.StyleTopLeftAnimationTest.prototype.testHideElementWithNoAnimInConfig = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig(); 
        config.animationDisabled = "true";
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("hidden", div.style.visibility);
                    assertEquals(0, parseFloat(div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.hideElement({
                    el: div,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testShowElementWithAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("visible", div.style.visibility);
                    assertEquals(1, parseFloat(div.style.opacity));
                    assert("Took some time", Date.now() - startTime > noAnimToleranceMs);
                });
                device.showElement({
                    el: div,
                    skipAnim: false,
                    onComplete: onComplete
                });
                assert(tweenSpy.called);
            });
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testShowElementWithNoAnim = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("visible", div.style.visibility);
                    assertEquals(1, parseFloat(div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.showElement({
                    el: div,
                    skipAnim: true,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    /**
     * Test showElement() skips animation when specified in config.
     */
    this.StyleTopLeftAnimationTest.prototype.testShowElementWithNoAnimInConfig = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, startTime;
            device = application.getDevice();
            div = device.createContainer("id");
            startTime = Date.now();

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy, onComplete;
                tweenSpy = this.sandbox.spy(device, '_tween');

                onComplete = callbacks.add(function() {
                    assertEquals("visible", div.style.visibility);
                    assertEquals(1, parseFloat(div.style.opacity));
                    assert("Complete (almost) immediately", Date.now() - startTime < noAnimToleranceMs);
                });
                device.showElement({
                    el: div,
                    onComplete: onComplete
                });
                assertFalse(tweenSpy.called);
            });
        }, config);
    };

    /**
     * Where specific parameters for FPS, duration and easing are passed to showElement(), ensure
     * these are passed on to the tweening engine.
     */
    this.StyleTopLeftAnimationTest.prototype.testSpecificShowAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.showElement({
                el: div,
                fps: 15,
                duration: 123,
                easing: "easeOutQuad"
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS passed through', 15, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration passed through', 123, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing passed through', "easeOutQuad", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * Where specific parameters for FPS, duration and easing are passed to hideElement(), ensure
     * these are passed on to the tweening engine.
     */
    this.StyleTopLeftAnimationTest.prototype.testSpecificHideAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.hideElement({
                el: div,
                fps: 16,
                duration: 321,
                easing: "elastic"
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS passed through', 16, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration passed through', 321, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing passed through', "elastic", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to showElement(),
     * and no defaults are specified in the device config file, ensure the hardcoded default parameters
     * are passed to the tweening engine.
     */
    this.StyleTopLeftAnimationTest.prototype.testDefaultShowAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.showElement({
                el: div // No animation properties provided, defaults will be used
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS is default', 25, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration is default', 840, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing is default', "linear", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to hideElement(),
     * and no defaults are specified in the device config file, ensure the hardcoded default parameters
     * are passed to the tweening engine.
     */
    this.StyleTopLeftAnimationTest.prototype.testDefaultHideAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.hideElement({
                el: div // No animation properties provided, defaults will be used
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS is default', 25, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration is default', 840, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing is default', "linear", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to showElement(),
     * ensure the defaults from the device config file are used.
     */
    this.StyleTopLeftAnimationTest.prototype.testConfigurationShowAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        // This is the configuration!!        
        var config = this.getDefaultConfig();
        config.defaults = {
            "showElementFade": {
                "fps": 11, 
                "duration": 888, 
                "easing": "easeInCubic"
            }
        };

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.showElement({
                el: div // No animation properties provided, config will be used
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS is from config', 11, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration is from config', 888, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing is from config', "easeInCubic", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * Where no specific parameters are provided for FPS, duration and easing in a call to hideElement(),
     * ensure the defaults from the device config file are used.
     */
    this.StyleTopLeftAnimationTest.prototype.testConfigurationHideAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        // This is the configuration!!        
        var config = this.getDefaultConfig();
        config.defaults = {
            "hideElementFade": {
                "fps": 22, 
                "duration": 777, 
                "easing": "easeInQuint"
            }
        };

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, tweenStub;
            device = application.getDevice();
            div = device.createContainer("id");
            
            tweenStub = this.sandbox.stub(device, "_tween");
            device.hideElement({
                el: div // No animation properties provided, config will be used
            });
            
            assert('Tween called once', tweenStub.calledOnce);
            assertEquals('FPS is from config', 22, tweenStub.getCall(0).args[0].fps);
            assertEquals('Duration is from config', 777, tweenStub.getCall(0).args[0].duration);
            assertEquals('Easing is from config', "easeInQuint", tweenStub.getCall(0).args[0].easing);
        }, config);
    };
    
    /**
     * When passing an options object to moveElementTo(), ensure that the options object is the same after
     * the call as before.
     */
    this.StyleTopLeftAnimationTest.prototype.testNoSideEffectsMoveElementTo = function(queue) {
        expectAsserts(1);

        var config = this.getDefaultConfig();
        
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            _assertNoSideEffects(device, device.moveElementTo);
        }, config);
    };
    
    /**
     * When passing an options object to scrollElementTo(), ensure that the options object is the same after
     * the call as before.
     */
    this.StyleTopLeftAnimationTest.prototype.testNoSideEffectsScrollElementTo = function(queue) {
        expectAsserts(1);

        var config = this.getDefaultConfig();
        
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            _assertNoSideEffects(device, device.scrollElementTo);
        }, config);
    };
    
    /**
     * When passing an options object to showElement(), ensure that the options object is the same after
     * the call as before.
     */
    this.StyleTopLeftAnimationTest.prototype.testNoSideEffectsShowElement = function(queue) {
        expectAsserts(1);

        var config = this.getDefaultConfig();
        
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            _assertNoSideEffects(device, device.showElement);
        }, config);
    };
    
    /**
     * When passing an options object to hideElement(), ensure that the options object is the same after
     * the call as before.
     */
    this.StyleTopLeftAnimationTest.prototype.testNoSideEffectsHideElement = function(queue) {
        expectAsserts(1);

        var config = this.getDefaultConfig();
        
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            _assertNoSideEffects(device, device.hideElement);
        }, config);
    };

    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleFiresOnCompleteWhenSkipped = function(queue) {
        var config = this.getDefaultConfig();
        expectAsserts(1);
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var device, div, el, options, completeSpy;
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };

                options = {
                    el: el,
                    from: {
                        bottom: 30,
                        right: 50
                    },
                    to: {
                        bottom: 0,
                        right: 100
                    },
                    duration: 100,

                    onComplete: function() {
                    },
                    skipAnim: true
                };

                device = application.getDevice();
                completeSpy = this.sandbox.spy(options, 'onComplete');
                device.tweenElementStyle(options);
                assertTrue("onComplete called", completeSpy.calledOnce);
            },
            config
        );
    };

    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleFiresOnCompleteWhenNoChange = function(queue) {
        var config = this.getDefaultConfig();
        expectAsserts(1);
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var device, div, el, options, completeSpy;
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                options = {
                    el: el,
                    to: {
                        bottom: 0,
                        right: 600
                    },
                    duration: 100,
                    onComplete: function() {
                    },
                    skipAnim: true
                };

                device = application.getDevice();
                completeSpy = this.sandbox.spy(options, 'onComplete');
                device.tweenElementStyle(options);
                assertTrue("onComplete called", completeSpy.calledOnce);
            },
            config
        );
    };

    this.StyleTopLeftAnimationTest.prototype.testFromValuesSetInTweenElementStyle = function(queue) {
        var config = this.getDefaultConfig();
        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var device, div, el;
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                
                
                device = application.getDevice();
                div = _createScrollableDiv(device);
                
                device.tweenElementStyle(
                    {
                        el: el,
                        from: {
                            bottom: 30,
                            right: 50
                        },
                        to: {
                            bottom: 0,
                            right: 100
                        },
                        duration: 100
                    }
                );
                assertTrue('From value of bottom has been set', parseInt(el.style.bottom, 10) > 20);
                assertTrue('From value of right has been set', parseInt(el.style.right, 10) < 60);
            }, 
            config
        );
    };
    
    this.StyleTopLeftAnimationTest.prototype.testToValuesReachedAfterTweenElementStyle = function(queue) {
        var config;
        config = this.getDefaultConfig();
        expectAsserts(2);

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var device, div, el;
                
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                device = application.getDevice();
                div = _createScrollableDiv(device);

                device.tweenElementStyle(
                    {
                        el: el,
                        from: {
                            bottom: 30,
                            right: 50
                        },
                        to: {
                            bottom: 0,
                            right: 100
                        },
                        duration: 30
                    }
                );
                
                queue.call('Check destinations after animation', function(callbacks) {
                    var assertDestinationReached = callbacks.add(
                        function () {
                        assertEquals('To value of bottom has been set', 0, parseInt(el.style.bottom, 10));
                        assertEquals('To value of right has been set', 100, parseInt(el.style.right, 10));
                    });
                    setTimeout(assertDestinationReached, 100);
                });

            }, 
            config
        );
    };
    
    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleEqualEndpointsReturnNull = function(queue) {
        var config;
        config = this.getDefaultConfig();

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var el, device, tween;
                device = application.getDevice();
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                tween = device.tweenElementStyle(
                    {
                        el: el,
                        to: {
                            bottom: 0,
                            right: 600
                        },
                        duration: 30
                    }
                );
                
                assertEquals("Equal Endpoints return null", tween, null);
            }, 
            config
        );
    };
    
    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleRespectsSkipAnim = function(queue) {
        var config;
        config = this.getDefaultConfig();

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var el, device;
                device = application.getDevice();
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                device.tweenElementStyle(
                    {
                        el: el,
                        to: {
                            bottom: 100,
                            right: 200
                        },
                        duration: 3000,
                        skipAnim: true
                    }
                );
                
                assertEquals("Bottom target reached immediately", "100px", el.style.bottom);
            }, 
            config
        );
    };
    
    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleRespectsGlobalAnimDisable = function(queue) {
        var config;
        config = this.getDefaultConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var el, device;
                device = application.getDevice();
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                device.tweenElementStyle(
                    {
                        el: el,
                        to: {
                            bottom: 100,
                            right: 200
                        },
                        duration: 3000
                    }
                );
                
                assertEquals("Bottom target reached immediately", "100px", el.style.bottom);
            }, 
            config
        );
    };
    
    this.StyleTopLeftAnimationTest.prototype.testTweenElementStyleSetsUnits = function(queue) {
        var config;
        config = this.getDefaultConfig();
        config.animationDisabled = "true";

        queuedApplicationInit(
            queue, 
            'lib/mockapplication', 
            [], 
            function(application) {
                var el, device;
                device = application.getDevice();
                el = {
                    style: {
                        getPropertyValue: function(property) {
                            return el.style[property];
                        },
                        bottom: "0px",
                        right: "600px"
                    }
                };
                device.tweenElementStyle(
                    {
                        el: el,
                        to: {
                            bottom: 100,
                            right: 200
                        },
                        duration: 50,
                        units: {
                            bottom: "FEET"
                        },
                        skipAnim: true
                    }
                );
                
                assertEquals("Bottom has correct units", "100FEET", el.style.bottom);
                assertEquals("Right has correct units", "200px", el.style.right);
            }, 
            config
        );
    };
    
    /** Kick off two animations slightly separated in time (less than one frame). Assert that updates to
     * the underlying DOM elements are forced into synchronisation.
     */
    this.StyleTopLeftAnimationTest.prototype.testAnimationsDoNotInterleaveMoveElementTo = function(queue) {
        expectAsserts(1);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var startTime, device, div1, div2;
            
            startTime = Date.now();
            device = application.getDevice();
            div1 = device.createContainer("id");
            div2 = device.createContainer("id2");
            div1.style.left = '0px';
            div2.style.left = '0px';

            // Start moving div1 immediately
            device.moveElementTo({
                el: div1,
                style: div1.style,
                to: {
                    top: 100,
                    left: 100
                },
                skipAnim: false,
                fps: 5,
                duration: 300
            });

            // Start moving div2 after 50ms, a quarter of a frame at 5fps
            queue.call('Kick off second animation after a delay', function(callbacks) {
                var moveElement = callbacks.add(function() {
                    device.moveElementTo({
                        el: div2,
                        style: div2.style,
                        to: {
                            top: 100,
                            left: 100
                        },
                        skipAnim: false,
                        fps: 5,
                        duration: 300
                    });
                });

                setTimeout(moveElement, 50);
            });

            // Poll for the style.left properties changing on the two divs. Ensure this happens at the same time
            // (as far as possible with polling :/)
            queue.call('Wait for style.left to change', function(callbacks) {
                var assertions, timer;
                // Wait until assertions have been done. Assert that the two divs have been updated by comparing
                // their respective left positions.
                // Only ensure they're ROUGHLY similar, because the shifty library isn't completely accurate
                // in its timing even within itself, resulting in slightly different tween values from the same
                // input.
                assertions = callbacks.add(function() {
                    var tolerance = 5;
                    //console.log('div1.style.left: ' + div1.style.left);
                    //console.log('div2.style.left: ' + div2.style.left);
                    assert('Expecting div1 and div2 styles to be roughly equal', Math.abs(parseFloat(div1.style.left) - parseFloat(div2.style.left)) < tolerance);
                });

                // Poll for changes every 10ms. Perform assertions when one property changes.  
                timer = setInterval(function() {
                    // If either style.left property has changed, ensure the other has too
                    if (parseInt(div1.style.left, 10) > 1 || parseInt(div2.style.left, 10) > 1) {
                        clearInterval(timer);
                        assertions();
                    }
                }, 10);
            });
        }, config);
    };

    /**
     * Stopping an animation should send it immediately to its end state. Assert that the animation is in
     * its end state immediately after cancellation with no need to wait for a callback.
     */
    this.StyleTopLeftAnimationTest.prototype.testMoveElementJumpsImmediatelyToEndWhenCancelled = function(queue) {
        expectAsserts(4);

        var config = this.getDefaultConfig();

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device, div, anim;
            device = application.getDevice();
            div = device.createContainer("id");
            div.style.left = '0px';
            div.style.top = '0px';

            anim = device.moveElementTo({
                el: div,
                style: div.style,
                to: {
                    left: 100,
                    top: 200
                },
                skipAnim: false,
                duration: 250
            });

            // Check that the element hasn't gone to its end state immediately.
            assertFalse('Element in its end position (left)', div.style.top === "100px");
            assertFalse('Element in its end position (top)', div.style.top === "200px");

            queue.call('Wait a moment and cancel the animation', function(callbacks) {
                // Wait a fraction of a second, cancel animation, then check it's jumped to its end state.
                setTimeout(callbacks.add(function() {
                    device.stopAnimation(anim);
                    assertEquals('Element in its end position (left)', '100px', div.style.left);
                    assertEquals('Element in its end position (top)', '200px', div.style.top);
                }), 100);
            });
        }, config);
    };

    /**
     * Helper: For one of the functions in styletopleft that takes an options object as its parameter,
     * ensure that the function does not have the side-effect of modifying the options object.
     * @param {antie.devices.Device} device The device object containing the styletopleft functionality.
     * @param {function} optionsParamFunction The function to execute on the device object.
     */
    function _assertNoSideEffects(device, optionsParamFunction) {
        var div, options1, options2, onComplete;
        div = _createScrollableDiv(device);
    
        // Create two options objects - one to pass to the styletopleft method, one for reference
        options1 = _createStandardOptionsForElement(div);
        options2 = _createStandardOptionsForElement(div);
        
        // Ensure that options1 is the same as options2 after the call to styletopleft.
        // (assertEquals does a deep comparison)
        onComplete = function() {
            assertEquals('Options is the same after tween has completed', options1, options2);
        };
    
        // Configure onComplete method on options object.
        options1.onComplete = onComplete;
        options2.onComplete = onComplete;
    
        // Perform the styletopleft method.
        optionsParamFunction.call(device, options1);
    }
    
    /**
     * Helper: Create a scrollable div, for testing scrollElementTo() functionality.
     * @param {antie.devices.Device} device The device, with styletopleft functionality.
     */
    function _createScrollableDiv(device) {
        var div = device.createContainer("id_mask"),
        inner = device.createContainer("id");
    
        device.appendChildElement(div, inner);
        return div;
    }
    
    /**
     * Helper: Create a standardised options object for passing to scrollElementTo() and moveElementTo().
     * This contains a set of known values for the various parameters, and animation skipping set to true.
     * @param {Element} element DOM Element which the options object applies to.
     * @param {Function} [onComplete] Optional callback to be passed in the options object, called when the tween completes.
     */
    function _createStandardOptionsForElement(element) {
        return {
            el: element,
            from: {
                opacity: 0,
                top: 0,
                left: 0
            },
            to: {
                opacity: 1,
                top: 100,
                left: 100
            },
            fps: 25,
            duration: 10,
            easing: 'linear',
            skipAnim: true
        };
    }

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/anim/styletopleft'], this.StyleTopLeftAnimationTest);
})();
