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
    this.StyleTopLeftAnimationTest = AsyncTestCase("StyleTopLeftAnimation");

    this.StyleTopLeftAnimationTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.StyleTopLeftAnimationTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id_mask");
            var inner = device.createContainer("id");
            device.appendChildElement(div, inner);

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(-100, Math.round(parseFloat(inner.style.left.replace(/px$/, ''))));
                    assertEquals(-200, Math.round(parseFloat(inner.style.top.replace(/px$/, ''))));
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
        expectAsserts(1);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id_mask");
            var inner = device.createContainer("id");
            device.appendChildElement(div, inner);

            inner.style.top = "200px";
            inner.style.left = "100px";

            var tweenSpy = this.sandbox.spy(device, '_tween');
            device.scrollElementTo({
                el: div,
                style: div.style,
                to: {
                    left: 100,
                    top: 200
                }
            });
            assertFalse(tweenSpy.called);
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id_mask");
            var inner = device.createContainer("id");
            device.appendChildElement(div, inner);

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(-100, Math.round(parseFloat(inner.style.left.replace(/px$/, ''))));
                    assertEquals(-200, Math.round(parseFloat(inner.style.top.replace(/px$/, ''))));
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

    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
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

    this.StyleTopLeftAnimationTest.prototype.testHideElementToWithAnimAndNoDefaultOpacity = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(0, Math.round(parseFloat(div.style.opacity)));
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var hideElement = function() {
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
                }

                var showElementonComplete = callbacks.add(function() {
                    assertEquals(1, Math.round(parseFloat(div.style.opacity)));
                    hideElement();
                });

                var hideElementonComplete = callbacks.add(function() {
                    assertEquals(0, Math.round(parseFloat(div.style.opacity)));
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(0, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(0, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
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
        expectAsserts(1);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            div.style.top = "200px";
            div.style.left = "100px";

            var tweenSpy = this.sandbox.spy(device, '_tween');
            device.moveElementTo({
                el: div,
                style: div.style,
                to: {
                    left: 100,
                    top: 200
                }
            });
            assertFalse(tweenSpy.called);
        }, config);
    };
    this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
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

    this.StyleTopLeftAnimationTest.prototype.testHideElementWithAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals("hidden", div.style.visibility);
                    assertEquals(0, Math.round(parseFloat(div.style.opacity)));
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
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals("hidden", div.style.visibility);
                    assertEquals(0, Math.round(parseFloat(div.style.opacity)));
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

    this.StyleTopLeftAnimationTest.prototype.testShowElementWithAnim = function(queue) {
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals("visible", div.style.visibility);
                    assertEquals(1, Math.round(parseFloat(div.style.opacity)));
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
        expectAsserts(3);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Wait for tween", function(callbacks) {
                var tweenSpy = this.sandbox.spy(device, '_tween');

                var onComplete = callbacks.add(function() {
                    assertEquals("visible", div.style.visibility);
                    assertEquals(1, Math.round(parseFloat(div.style.opacity)));
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
     * Where specific parameters for FPS, duration and easing are passed to showElement(), ensure
     * these are passed on to the tweening engine.
     */
    this.StyleTopLeftAnimationTest.prototype.testSpecificShowAnimationPropertiesPassedToTween = function(queue) {
        expectAsserts(4);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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
        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1","defaults":{"showElementFade":{"fps":11, "duration": 888, "easing": "easeInCubic"}}};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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
        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1","defaults":{"hideElementFade":{"fps" : 22, "duration": 777, "easing": "easeInQuint"}}};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");
            
            var tweenStub = this.sandbox.stub(device, "_tween");
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
        
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
        
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
        
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

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
        
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
        	var device = application.getDevice();
        	_assertNoSideEffects(device, device.hideElement);
        }, config);
    };
    
    /**
     * Helper: For one of the functions in styletopleft that takes an options object as its parameter,
     * ensure that the function does not have the side-effect of modifying the options object.
     * @param {antie.devices.Device} device The device object containing the styletopleft functionality.
     * @param {function} optionsParamFunction The function to execute on the device object.
     */
    function _assertNoSideEffects(device, optionsParamFunction) {
    	var div = _createScrollableDiv(device);
    	
    	// Create two options objects - one to pass to the styletopleft method, one for reference
        var options1 = _createStandardOptionsForElement(div);
        var options2 = _createStandardOptionsForElement(div);
        
        // Ensure that options1 is the same as options2 after the call to styletopleft.
        // (assertEquals does a deep comparison)
    	var onComplete = function() {
    		assertEquals('Options is the same after tween has completed', options1, options2);
    	};
    	
    	// Configure onComplete method on options object.
    	options1.onComplete = onComplete;
    	options2.onComplete = onComplete;
    	
    	// Perform the styletopleft method.
    	optionsParamFunction.call(device, options1);
    };
    
    /**
     * Helper: Create a scrollable div, for testing scrollElementTo() functionality.
     * @param {antie.devices.Device} device The device, with styletopleft functionality.
     */
    function _createScrollableDiv(device) {
    	var div = device.createContainer("id_mask"),
    	inner = device.createContainer("id");
    	
    	device.appendChildElement(div, inner);
    	return div;
    };
    
    /**
     * Helper: Create a standardised options object for passing to scrollElementTo() and moveElementTo().
     * This contains a set of known values for the various parameters, and animation skipping set to true.
     * @param {Element} element DOM Element which the options object applies to.
     * @param {Function} [onComplete] Optional callback to be passed in the options object, called when the tween completes.
     */
    function _createStandardOptionsForElement(element, onComplete) {
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
    };
})();
