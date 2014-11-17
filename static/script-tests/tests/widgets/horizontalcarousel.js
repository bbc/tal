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
	this.HorizontalCarouselTest = AsyncTestCase("HorizontalCarousel");

	var addTestButtons = function(noButtonsReq, widget, Button) {
		for(var i = 0; i < noButtonsReq; i++) {
			var button = new Button();
			widget.appendChildWidget(button);
			button.outputElement.style.position = "relative";
			button.outputElement.style.width = "100px";
			button.outputElement.style.height = "100px";
			button.outputElement.style.outline = "1px solid blue";
		}
	}
	this.HorizontalCarouselTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HorizontalCarouselTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.HorizontalCarouselTest.prototype.testInterface = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/horizontalcarousel","antie/widgets/horizontallist"],
			function(application, HorizontalCarousel, HorizontalList) {
				assertEquals('HorizontalCarousel should be a function', 'function', typeof HorizontalCarousel);
				assert('HorizontalCarousel should extend from HorizontalList', new HorizontalCarousel() instanceof HorizontalList);
		});
	};
 	this.HorizontalCarouselTest.prototype.testRenderContainer = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.appendChildWidget(new Button());
					var device = application.getDevice();
					var deviceCreateContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);
					assert(deviceCreateContainerSpy.called);
				}
		);
	};

	this.HorizontalCarouselTest.prototype.testRenderList = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list"],
				function(application, HorizontalCarousel, List) {
					var widget = new HorizontalCarousel("id2");
					widget.setRenderMode(List.RENDER_MODE_LIST);
					var device = application.getDevice();
					var deviceCreateListSpy = this.sandbox.spy(device, 'createList');
					var el = widget.render(device);
					assert(deviceCreateListSpy.called);
				}
		);
	};

    this.HorizontalCarouselTest.prototype.testShowCallsShowElementWithCorrectArgs = function(queue) {
        /*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/horizontalcarousel", "antie/widgets/list"],
            function(application, HorizontalCarousel, List) {
                var widget = new HorizontalCarousel("id2");
                widget.setRenderMode(List.RENDER_MODE_LIST);

                var device = application.getDevice();
                var el = widget.render(device);


                var config = device.getConfig();
                var animate = !config.widgets || !config.widgets.horizontalcarousel || (config.widgets.horizontalcarousel.fade !== false);

                var options = {
                    el : widget._maskElement,
                    skipAnim : animate
                };

                var deviceCreateListSpy = this.sandbox.spy(device, 'showElement');
                widget.show({});

                assertEquals( "mask", widget._maskElement, deviceCreateListSpy.args[ 0 ][ 0 ].el );
                assertEquals( "anim", !animate, deviceCreateListSpy.args[ 0 ][ 0 ].skipAnim );
            }
        );
    };

	this.HorizontalCarouselTest.prototype.testAnimationParametersPassedToAnimation = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list"],
				function(application, HorizontalCarousel, List) {
					var widget = new HorizontalCarousel("id3");
					widget.setRenderMode(List.RENDER_MODE_LIST);
					widget._activeWidgetAnimationFPS = 10;
					widget._activeWidgetAnimationDuration = 300;
					widget._activeWidgetAnimationEasing = 'easeOutBounce';
					var device = application.getDevice();
					var deviceCreateListSpy = this.sandbox.spy(device, 'createList');
					var el = widget.render(device);
					assert(deviceCreateListSpy.called);
					assertEquals(widget._activeWidgetAnimationFPS, 10);
					assertEquals(widget._activeWidgetAnimationDuration, 300);
					assertEquals(widget._activeWidgetAnimationEasing, 'easeOutBounce');
				}
		);
	};

	this.HorizontalCarouselTest.prototype.testRenderInnerElements = function(queue) {
	   /*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
	   expectAsserts(8);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   ["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
			   function(application, HorizontalCarousel, List, Button) {
				   var widget = new HorizontalCarousel("id");
				   application.getRootWidget().appendChildWidget(widget);
				   widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				   widget.appendChildWidget(new Button("buttonID"));

				   var device = application.getDevice();
				   assertEquals(1, application.getRootWidget().outputElement.childNodes.length);
				   var el = application.getRootWidget().outputElement.childNodes[0];
				   assertEquals("id_mask", el.id);
				   assertClassName("horizontallistmask", el);

				   assertEquals(1, el.childNodes.length);

				   var listEl = el.childNodes[0];
				   assertEquals("id", listEl.id);
				   assertClassName("horizontalcarousel", listEl);

				   assertEquals(1, listEl.childNodes.length);
				   var buttonEl = listEl.childNodes[0];
				   assertEquals("buttonID", buttonEl.id);
			   }
	   );
   };
 	this.HorizontalCarouselTest.prototype.testRenderTwice = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					var device = application.getDevice();
					var deviceCreateContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);
					var el2 = widget.render(device);
					assertSame(el, el2);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeDOM = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("testCarousel");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_DOM, 900);

					var b = new Button("testCarouselButton");
					widget.appendChildWidget(b);

					application.getRootWidget().appendChildWidget(widget);

					widget.setActiveChildWidget(b, true);
					widget.refreshViewport();

					assertEquals(1, widget.outputElement.childNodes.length);
					assertClassName("button", b.outputElement);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeClasses = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("testCarousel");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_CLASSES);

					var b = new Button("testCarouselButton");
					widget.appendChildWidget(b);

					application.getRootWidget().appendChildWidget(widget);

					widget.setActiveChildWidget(b, true);
					widget.refreshViewport();

					assertEquals(1, widget.outputElement.childNodes.length);
					assertClassName("button", b.outputElement);
					assertClassName("inviewport", b.outputElement);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeNone = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_NONE);
					widget.appendChildWidget(new Button());
					var device = application.getDevice();
					var el = widget.render(device);
					assertMatch(/_mask$/, el.id);
				}
		);
	};

    // FIXME: Test intermittently fails
 	this.HorizontalCarouselTest.prototype.testAlignmentCenter = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_CENTER);
					var el = widget.render(device);
					el.style.width = "150px";
					el.style.height = "100px";
					el.style.outline = "1px solid red";

					application.getRootWidget().appendChildWidget(widget);

					var b1 = new Button();
					var b2 = new Button();
					widget.appendChildWidget(b1);
					widget.appendChildWidget(b2);

					b1.outputElement.style.position = "relative";
					b1.outputElement.style.width = "100px";
					b1.outputElement.style.height = "100px";
					b1.outputElement.style.outline = "1px solid blue";
					b2.outputElement.style.position = "relative";
					b2.outputElement.style.width = "100px";
					b2.outputElement.style.height = "100px";
					b2.outputElement.style.outline = "1px solid green";

					var deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');

					widget.setActiveChildIndex(1, true);

					assert(deviceScrollElementSpy.called);
					var pos = deviceScrollElementSpy.getCall(0).args[0].to.left;
					assertEquals(75, pos);
				}
		);
	};

    // FIXME: Test intermittently fails
 	this.HorizontalCarouselTest.prototype.testAlignmentLeft = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);

					var b1 = new Button();
					var b2 = new Button();
					widget.appendChildWidget(b1);
					widget.appendChildWidget(b2);

					b1.outputElement.style.position = "relative";
					b1.outputElement.style.width = "100px";
					b1.outputElement.style.height = "100px";
					b1.outputElement.style.outline = "1px solid blue";
					b2.outputElement.style.position = "relative";
					b2.outputElement.style.width = "100px";
					b2.outputElement.style.height = "100px";
					b2.outputElement.style.outline = "1px solid green";

					var deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');

					widget.setActiveChildIndex(1, true);

					assert(deviceScrollElementSpy.called);

					var pos = deviceScrollElementSpy.getCall(0).args[0].to.left;
					assertEquals(100, pos);
				}
		);
	};

    // FIXME: Test intermittently fails
 	this.HorizontalCarouselTest.prototype.testAlignmentRight = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_RIGHT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);

					var b1 = new Button();
					var b2 = new Button();
					widget.appendChildWidget(b1);
					widget.appendChildWidget(b2);

					b1.outputElement.style.position = "relative";
					b1.outputElement.style.width = "100px";
					b1.outputElement.style.height = "100px";
					b1.outputElement.style.outline = "1px solid blue";
					b2.outputElement.style.position = "relative";
					b2.outputElement.style.width = "100px";
					b2.outputElement.style.height = "100px";
					b2.outputElement.style.outline = "1px solid green";

					var deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');

					widget.setActiveChildIndex(1, true);

					assert(deviceScrollElementSpy.called);

					var pos = deviceScrollElementSpy.getCall(0).args[0].to.left;
					assertEquals(50, pos);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testMoveToLeftNoWrap = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);					
					addTestButtons(3, widget, Button);

					// Position carousel at right-most item (of 3)
					widget.setActiveChildIndex(2, true);
					
					// Set up spy to watch for movement, then trigger it
					var deviceScrollElementStub = this.sandbox.stub(device, 'scrollElementTo');
					
					// Move left - now on centre item
					widget.selectPreviousChildWidget();

					assertEquals(1, deviceScrollElementStub.callCount);
					
					// Expect carousel to be repositioned to 100px (one item) from the left-hand edge
					// (middle item is aligned to the left as per ALIGNMENT_LEFT option)
					assertEquals(100, deviceScrollElementStub.getCall(0).args[0].to.left);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testMoveToRightNoWrap = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);

					addTestButtons(2, widget, Button);

					// Position carousel at left-most item
					widget.setActiveChildIndex(0, true);
					
					// Set up spy to watch for movement, then trigger it
					var deviceScrollElementStub = this.sandbox.stub(device, 'scrollElementTo');
					
					// Move right - now on centre item
					widget.selectNextChildWidget();

					assertEquals(1, deviceScrollElementStub.callCount);
					
					// Expect carousel to be repositioned to 100px (one item) from the left-hand edge
					// (middle item is aligned to the left as per ALIGNMENT_LEFT option)
					assertEquals(100, deviceScrollElementStub.getCall(0).args[0].to.left);
				}
		);
 	};
	this.HorizontalCarouselTest.prototype.testDataBindingCreatesWrappedCarousel = function(queue)
	{
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(4);
		var dataSource, widget;		
		
		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/button", "antie/formatter"],
				function(application, HorizontalCarousel, Button, Formatter) {
					var device = application.getDevice();

                    var clock = sinon.useFakeTimers();

					// Data binding must be used in order for the wrapped carousel elements to be created.
					dataSource = ["a", "b", "c", "d"];
					var SimpleFormatter = Formatter.extend({
						format: function(iterator) {
							return new Button(iterator.next());
						}
					});
					
					widget = new HorizontalCarousel("id", new SimpleFormatter(), dataSource);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device); // Creates cloned elements after a delay
					el.style.width = "500px"; // Set target width for wrapped carousel manually (usually done via CSS)

					// Add carousel to root widget.
					application.getRootWidget().appendChildWidget(widget);
					
					// Set the width of each button, again usually done via CSS!
					var childWidgets = widget.getChildWidgets();
					for(var buttonIndex in childWidgets) {
						childWidgets[buttonIndex].outputElement.style.width = "100px";
					}
					
					// No clones created yet:
					assertEquals(dataSource.length, widget.getChildWidgetCount());
					assertEquals(0, document.getElementsByClassName('clone').length);

                    // _onDataBound in the horizontal carousel is responsible for cloning the items. It is called after
                    // a delay. Therefore we have to wait before asserting that the cloned items are present.
                    // We expect 4 cloned items at either end, padding the carousel to full width at its extremities
                    // (one real item at 100px, 4 clones at 100px each = 100px + (4 * 100px) = 500px)

                    clock.tick(150);

                    // We expect to still have the same number of real 'widgets'...
                    assertEquals(dataSource.length, widget.getChildWidgetCount());

                    // ... but have an additional 8 cloned elements (4 either side of the real widgets) to
                    // display the wrapped carousel.
                    assertEquals(8, document.getElementsByClassName('clone').length);

                    clock.restore();

				});
	};
	this.HorizontalCarouselTest.prototype.testGetWrappedElementToLeft = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);
		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/button"],
				function(application, HorizontalCarousel, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					var b1 = new Button();
					var b2 = new Button();
					
					widget.appendChildWidget(b1);
					widget.appendChildWidget(b2);
					
					var wrappedElementLeft = widget._getWrappedElement(HorizontalCarousel.SELECTION_DIRECTION_LEFT, b2.outputElement);
					
					assert('Element to the left of B2 is B1!', b1.outputElement === wrappedElementLeft);
				});
		
	}
	this.HorizontalCarouselTest.prototype.testGetWrappedElementToRight = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);
		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/button"],
				function(application, HorizontalCarousel, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					var b1 = new Button();
					var b2 = new Button();
					
					widget.appendChildWidget(b1);
					widget.appendChildWidget(b2);
					
					var wrappedElementRight = widget._getWrappedElement(HorizontalCarousel.SELECTION_DIRECTION_RIGHT, b1.outputElement)
					
					assert('Element to the right of B1 is B2', b2.outputElement === wrappedElementRight);
				});
		
	}
	this.HorizontalCarouselTest.prototype.testMoveToLeftWrapped = function(queue)
	{
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(7);
		var widget, deviceScrollElementSpy;
		
		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
		
		queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/horizontalcarousel", "antie/widgets/button", "antie/formatter"],
            function(application, HorizontalCarousel, Button, Formatter) {
                var device = application.getDevice();

                var clock = sinon.useFakeTimers();

                var dataSource = ["a", "b", "c", "d"];
                var SimpleFormatter = Formatter.extend({
                    format: function(iterator) {
                        return new Button(iterator.next());
                    }
                });

                widget = new HorizontalCarousel("id", new SimpleFormatter(), dataSource);
                widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
                widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
                deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');
                var el = widget.render(device); // Creates cloned elements after a delay - wait until done
                el.style.width = "500px"; // Set carousel width

                application.getRootWidget().appendChildWidget(widget);

                // Set attributes on each button, usually done via CSS!
                var childWidgets = widget.getChildWidgets();
                for(var buttonIndex in childWidgets) {
                    var style = childWidgets[buttonIndex].outputElement.style;
                    style.position = "relative";
                    style.width = "100px";
                    style.height = "100px";
                    style.outline = "1px solid blue";
                }

                // Wait for cloned items to be created, then attempt to move to the left. Assert that this triggers
                // an attempt to move the carousel to the fake, cloned element at the end of the carousel.

                clock.tick(150);

                // Check we have cloned elements now.
                assertEquals(8, document.getElementsByClassName('clone').length);

                widget.setActiveChildIndex(0, false);

                // Move the carousel to the left
                deviceScrollElementSpy.reset();
                widget.selectPreviousChildWidget();

                assertEquals('scrollElementTo called first time', 1, deviceScrollElementSpy.callCount);

                // 00 01 02 03 04 05 06 07 08 09 10 11
                // F  F  F  F  R  R  R  R  F  F  F  F    (F = Fake, R = Real)

                // Begin at item 04 (real)
                // Move left to item 03 (fake clone of item 07), at 300px from left (00, 01 and 02 to left)

                assertEquals(300, deviceScrollElementSpy.getCall(0).args[0].to.left);
                assert('Animation NOT skipped on first call', !deviceScrollElementSpy.getCall(0).args[0].skipAnim);
                deviceScrollElementSpy.reset();


                // Assert that a second move occurs, this time with animation skipped, to reposition to the
                // real widget at the opposite end of the carousel.

                clock.tick(850); // t = 1000


                // Note: The onComplete callback is called twice using css3 animation...
                assertEquals('scrollElementTo called a second time', 1, deviceScrollElementSpy.callCount);

                // 00 01 02 03 04 05 06 07 08 09 10 11
                // F  F  F  F  R  R  R  R  F  F  F  F    (F = Fake, R = Real)

                // Move across the carousel to item 07, last real item
                // 4 fake items (00, 01, 02, 03) and 3 real items (04, 05, 06) are to the left (700px)

                // Repositioned to right-hand side of carousel: 4 fake items + 3 real ones off the left of the screen
                assertEquals(700, deviceScrollElementSpy.getCall(0).args[0].to.left)
                assert('Animation skipped on second call', deviceScrollElementSpy.getCall(0).args[0].skipAnim);

                clock.restore();

            }, config); // Use styletopleft rather than CSS3 animation
    };

	this.HorizontalCarouselTest.prototype.testMoveToRightWrapped = function(queue)
	{
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(7);
		var widget, deviceScrollElementSpy;
		
		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
		
		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/button", "antie/formatter"],
				function(application, HorizontalCarousel, Button, Formatter) {
					var device = application.getDevice();

                    var clock = sinon.useFakeTimers();

					var dataSource = ["a", "b", "c", "d"];
					var SimpleFormatter = Formatter.extend({
						format: function(iterator) {
							return new Button(iterator.next());
						}
					});
					
					widget = new HorizontalCarousel("id", new SimpleFormatter(), dataSource);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');
					var el = widget.render(device); // Creates cloned elements after a delay - wait until done
					el.style.width = "500px"; // Set carousel width
					
					application.getRootWidget().appendChildWidget(widget);
					
					// Set attributes on each button, usually done via CSS!
					var childWidgets = widget.getChildWidgets();
					for(var buttonIndex in childWidgets) {
						var style = childWidgets[buttonIndex].outputElement.style;
						style.position = "relative";
						style.width = "100px";
						style.height = "100px";
						style.outline = "1px solid blue";
					}

                    // Wait for cloned items to be created, then attempt to move to the left. Assert that this triggers
                    // an attempt to move the carousel to the fake, cloned element at the end of the carousel.

                    clock.tick(150);

                    // Check we have cloned elements now.
                    assertEquals(8, document.getElementsByClassName('clone').length);

                    widget.setActiveChildIndex(3, false);

                    // Move the carousel to the left
                    deviceScrollElementSpy.reset();
                    widget.selectNextChildWidget();

                    assertEquals('scrollElementTo called first time', 1, deviceScrollElementSpy.callCount);

                    // 00 01 02 03 04 05 06 07 08 09 10 11
                    // F  F  F  F  R  R  R  R  F  F  F  F    (F = Fake, R = Real)

                    // Begin at item 07, last real item
                    // Move right to item 08, first fake item (clone of item 04).
                    // 4 fake + 4 real items to the left = 800px

                    assertEquals(800, deviceScrollElementSpy.getCall(0).args[0].to.left);
                    assert('Animation NOT skipped on first call', !deviceScrollElementSpy.getCall(0).args[0].skipAnim);
                    deviceScrollElementSpy.reset();

		
                    // Assert that a second move occurs, this time with animation skipped, to reposition to the
                    // real widget at the opposite end of the carousel.

                    clock.tick(850); // t = 1000

                    // Note: The onComplete callback is called twice using css3 animation...
                    assertEquals('scrollElementTo called a second time', 1, deviceScrollElementSpy.callCount);

                    // 00 01 02 03 04 05 06 07 08 09 10 11
                    // F  F  F  F  R  R  R  R  F  F  F  F    (F = Fake, R = Real)

                    // Move to item 04, first real item. 4 fake items to the left = 400px

                    // Repositioned to left-hand side of carousel: 4 fake items off screen
                    assertEquals(400, deviceScrollElementSpy.getCall(0).args[0].to.left);
                    assert('Animation skipped on second call', deviceScrollElementSpy.getCall(0).args[0].skipAnim);

                    clock.restore();

                }, config); // Use styletopleft rather than CSS3 animation

    };
 	this.HorizontalCarouselTest.prototype.testAnimationCompleteCallbackIsSpecified = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_VISUAL);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);					
					addTestButtons(2, widget, Button);

					var deviceScrollElementStub = this.sandbox.stub(device, 'scrollElementTo');

					widget.setActiveChildIndex(0, false); // Don't reposition
					widget.selectNextChildWidget();

					assertEquals(1, deviceScrollElementStub.callCount);
					
					var onComplete = deviceScrollElementStub.getCall(0).args[0].onComplete;
					assertEquals('function', typeof onComplete);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testAnimationHandleIsSet = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

					var widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);					
					addTestButtons(2, widget, Button);

					var deviceScrollElementStub = this.sandbox.stub(device, 'scrollElementTo');
					var scrollHandle = { };
					deviceScrollElementStub.returns(scrollHandle);
					widget.setActiveChildIndex(0, false); // Don't reposition
					widget.selectNextChildWidget();

					assertSame('Scrollhandle set', scrollHandle,  widget._scrollHandle);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testAnimationHandleIsReset = function(queue) {
		/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
		expectAsserts(2);

		var widget;
		
		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button", "antie/devices/anim/css3"],
				function(application, HorizontalCarousel, List, Button) {
					var device = application.getDevice();

                    var clock = sinon.useFakeTimers();

					widget = new HorizontalCarousel("id");
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setAlignment(HorizontalCarousel.ALIGNMENT_LEFT);
					var el = widget.render(device);
					el.style.width = "150px";

					application.getRootWidget().appendChildWidget(widget);					
					addTestButtons(2, widget, Button);

					var deviceScrollElementSpy = this.sandbox.spy(device, 'scrollElementTo');

                    clock.tick(300);

                    widget.setActiveChildIndex(0, false); // Don't reposition
                    widget.selectNextChildWidget();

                    // Check the scrollhandle is set, just to confirm that it is being set then unset,
                    // rather than never being set!
                    assert('Scrollhandle set', !!widget._scrollHandle);

                    clock.tick(1200); // t = 1500

					assert('Scrollhandle not set', !widget._scrollHandle);

                    clock.restore();
            }
        );


	};
})();
