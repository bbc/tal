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
    this.WidgetTest = AsyncTestCase("Widget");

    this.WidgetTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.WidgetTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    this.WidgetTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget","antie/class"],
            function(application, Widget, Class) {
                assertEquals('Widget should be a function', 'function', typeof Widget);
                assert('Widget should extend from Class', new Widget() instanceof Class);
            });
    };
    this.WidgetTest.prototype.testRender = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                assertException(function() {
                    widget.render(application.getDevice());
                });
            }
        );
    };
    this.WidgetTest.prototype.testAddClassHasClass = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                assertFalse(widget.hasClass('a'));
                widget.addClass('a');
                assert(widget.hasClass('a'));
            }
        );
    };
    this.WidgetTest.prototype.testRemoveClassHasClass = function(queue) {
        expectAsserts(6);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                assertFalse(widget.hasClass('a'));
                assertFalse(widget.hasClass('b'));
                widget.addClass('a');
                widget.addClass('b');
                assert(widget.hasClass('a'));
                assert(widget.hasClass('b'));
                widget.removeClass('b');
                assert(widget.hasClass('a'));
                assertFalse(widget.hasClass('b'));
            }
        );
    };

    this.WidgetTest.prototype.testGetClasses = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                widget.addClass('a');
                widget.addClass('b');
                assertEquals(['widget','a','b'], widget.getClasses());
            }
        );
    };

    this.WidgetTest.prototype.testAddClassMultipleTimes = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                widget.addClass('a');
                widget.addClass('a');
                widget.addClass('a');
                widget.addClass('a');
                widget.addClass('b');
                assertEquals(['widget','a','b'], widget.getClasses());
            }
        );
    };

    this.WidgetTest.prototype.testAddEventListener = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget", "antie/events/event"],
            function(application, Widget, Event) {
                var widget = new Widget();
                var handler = this.sandbox.stub();
                widget.addEventListener('anevent', handler);
                widget.fireEvent(new Event('anevent'));
                assert(handler.called);
            }
        );
    };

    this.WidgetTest.prototype.testRemoveEventListener = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget", "antie/events/event"],
            function(application, Widget, Event) {
                var widget = new Widget();
                var handler = this.sandbox.stub();
                widget.addEventListener('anevent', handler);
                widget.removeEventListener('anevent', handler);
                widget.fireEvent(new Event('anevent'));
                assertFalse(handler.called);
            }
        );
    };

    this.WidgetTest.prototype.testBubbleEvent = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget", "antie/events/event"],
            function(application, Widget, Event) {
                var widget = new Widget();
                var parent = new Widget();
                widget.parentWidget = parent;

                var parentHandler = this.sandbox.stub();
                parent.addEventListener('anevent', parentHandler);
                var widgetHandler = this.sandbox.stub();
                widget.addEventListener('anevent', widgetHandler);

                widget.bubbleEvent(new Event('anevent'));

                assert(widgetHandler.called);
                assert(parentHandler.called);
                assert(widgetHandler.calledBefore(parentHandler));
            }
        );
    };

    this.WidgetTest.prototype.testBroadcastEvent = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget", "antie/events/event"],
            function(application, Widget, Event) {
                var widget = new Widget();
                var handler = this.sandbox.stub();
                widget.addEventListener('anevent', handler);
                widget.broadcastEvent(new Event('anevent'));
                assert(handler.called);
            }
        );
    };

    this.WidgetTest.prototype.testIsFocusable = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                assertFalse(widget.isFocusable());
            }
        );
    };

    this.WidgetTest.prototype.testGetCurrentApplication = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                assertSame(application, widget.getCurrentApplication());
            }
        );
    };

    this.WidgetTest.prototype.testSetGetDataItem = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var dataItem = {hello:"world"};
                var widget = new Widget();
                assertNull(widget.getDataItem());
                widget.setDataItem(dataItem);
                assertSame(dataItem, widget.getDataItem());
            }
        );
    };

    this.WidgetTest.prototype.testGetComponent = function(queue) {
        expectAsserts(1);

        // Uses subclass of Widget as we must use a renderable widget.
        queuedComponentInit(
            queue,
            "fixtures/components/emptycomponent",
            null,
            ["antie/widgets/container"],
            function(application, container, Container) {
                queue.call("Waiting for components to show", function(callbacks) {
                    var performAsserts = callbacks.add(function(evt) {
                        var widget = new Container();
                        evt.component.appendChildWidget(widget);
                        assertSame(evt.component, widget.getComponent());
                    });
                    container.addEventListener('beforerender', performAsserts);
                });
            }
        );
    };

    this.WidgetTest.prototype.testRemoveFocus = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                widget._isFocussed = true;
                widget.addClass('focus');
                widget.removeFocus();
                assertFalse(widget.hasClass('focus'));
                assertFalse(widget._isFocussed);
            }
        );
    };

    this.WidgetTest.prototype.testShowThrowsExceptionWhenNoOutputElementDefined = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();

                assertException("Error: Widget::show called - the current widget has not yet been rendered.", function() {
                    widget.show({
                        fps: 25,
                        duration: 1000
                    });
                });
            }
        );
    };

    this.WidgetTest.prototype.testShowCallsShowElementWithCorrectArgs = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                var spy = this.sandbox.spy(device, "showElement");

                var afterAnimationCallback = function() {
                };

                widget.show({
                    fps: 25,
                    duration: 1000,
                    onComplete : afterAnimationCallback
                });

                assertTrue(spy.calledOnce);
                assertEquals("25", spy.getCall(0).args[0].fps);
                assertEquals("1000", spy.getCall(0).args[0].duration);
                assertEquals(afterAnimationCallback, spy.getCall(0).args[0].onComplete);
            }
        );
    };

    this.WidgetTest.prototype.testShowMakesElementVisible = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                queue.call("Wait for tween", function(callbacks) {
                    var onComplete = callbacks.add(function() {
                        assertEquals("visible", widget.outputElement.style.visibility);
                        assertEquals(1, Math.round(parseFloat(widget.outputElement.style.opacity)));
                    });
                    widget.show({
                        to : {
                            top : 10,
                            left : 15
                        },
                        fps: 25,
                        duration: 1000,
                        onComplete : onComplete
                    });
                });
            }
        );
    };

    this.WidgetTest.prototype.testHideThrowsExceptionWhenNoOutputElementDefined = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();

                assertException("Error: Widget::hide called - the current widget has not yet been rendered.", function() {
                    widget.hide({
                        fps: 25,
                        duration: 1000
                    });
                });
            }
        );
    };

    this.WidgetTest.prototype.testHideCallsHideElementWithCorrectArgs = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                var spy = this.sandbox.spy(device, "hideElement");

                var afterAnimationCallback = function() {
                };

                widget.hide({
                    fps: 25,
                    duration: 1000,
                    onComplete : afterAnimationCallback
                });

                assertTrue(spy.calledOnce);
                assertEquals("25", spy.getCall(0).args[0].fps);
                assertEquals("1000", spy.getCall(0).args[0].duration);
                assertEquals(afterAnimationCallback, spy.getCall(0).args[0].onComplete);
            }
        );
    };

    this.WidgetTest.prototype.testHideMakesElementHidden = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                queue.call("Wait for tween", function(callbacks) {
                    var onComplete = callbacks.add(function() {
                        assertEquals("hidden", widget.outputElement.style.visibility);
                        assertEquals(0, Math.round(parseFloat(widget.outputElement.style.opacity)));
                    });
                    widget.hide({
                        to : {
                            top : 10,
                            left : 15
                        },
                        fps: 25,
                        duration: 1000,
                        onComplete : onComplete
                    });
                });
            }
        );
    };


    this.WidgetTest.prototype.testMoveToThrowsExceptionWhenNoOutputElementDefined = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();

                assertException("Error: Widget::moveTo called - the current widget has not yet been rendered.", function() {
                    widget.moveTo({
                        to: {
                            top: 10,
                            left: 15
                        },
                        fps: 25,
                        duration: 1000
                    });
                });
            }
        );
    };

    this.WidgetTest.prototype.testMoveToCallsMoveElementToWithCorrectArgs = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                var spy = this.sandbox.spy(device, "moveElementTo");

                var afterAnimationCallback = function() {
                };

                widget.moveTo({
                    to : {
                        top: 200,
                        left: 300
                    },
                    fps: 25,
                    duration: 1000,
                    onComplete : afterAnimationCallback
                });

                assertTrue(spy.calledOnce);
                assertEquals("25", spy.getCall(0).args[0].fps);
                assertEquals("1000", spy.getCall(0).args[0].duration);
                assertEquals(afterAnimationCallback, spy.getCall(0).args[0].onComplete);
            }
        );
    };

    this.WidgetTest.prototype.testMoveToMovesElementAsSpecified = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/widget"],
            function(application, Widget) {
                var widget = new Widget();
                var device = application.getDevice();

                // Mock out the output element
                widget.outputElement = device.createContainer("id_mask");
                document.body.appendChild(widget.outputElement);

                queue.call("Wait for tween", function(callbacks) {
                    var onComplete = callbacks.add(function() {
                        console.log("widget::::", widget.outputElement);
                        assertEquals(200, Math.round(parseFloat(widget.outputElement.style.left.replace(/px$/, ''))));
                        assertEquals(300, Math.round(parseFloat(widget.outputElement.style.top.replace(/px$/, ''))));
                    });
                    widget.moveTo({
                        from: {
                            left: 100,
                            top: 200
                        },
                        to: {
                            left: 200,
                            top: 300
                        },
                        skipAnim: false,
                        onComplete: onComplete
                    });
                });
            }, config
        );
    };

})();
