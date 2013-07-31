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

(function () {
	/* jshint newcap: false, strict: false */
	this.CarouselTest = AsyncTestCase("Carousel");

	this.CarouselTest.prototype.setUp = function () {
		this.sandbox = sinon.sandbox.create();
	};

	this.CarouselTest.prototype.tearDown = function () {
		this.sandbox.restore();
	};

	this.CarouselTest.prototype.testCarouselCreatesOneMaskWithCorrectId = function (queue) {
		var self = this;
		queuedApplicationInit(queue,
			'lib/mockapplication',
			[
				"antie/widgets/carousel",
				"antie/widgets/widget"
			],
			function (application, Carousel, Widget) {
				var carousel, createWidgetSpy;
				createWidgetSpy = self.sandbox.spy(Widget.prototype, 'init').withArgs('myCarousel_CarouselMask');
				carousel = new Carousel('myCarousel');
				assertTrue(createWidgetSpy.calledOnce);
			}
		);
	};

	this.CarouselTest.prototype.testCarouselCreatesOneWidgetStripWithCorrectId = function (queue) {
		var self = this;
		queuedApplicationInit(queue,
			'lib/mockapplication',
			[
				"antie/widgets/carousel",
				"antie/widgets/container"
			],
			function (application, Carousel, Container) {
				var carousel, createContainerStub;
				createContainerStub = self.sandbox.spy(Container.prototype, 'init').withArgs('myCarousel_WidgetStrip');
				carousel = new Carousel('myCarousel');
				assertTrue(createContainerStub.calledOnce);
			}
		);
	};

	this.CarouselTest.prototype.testMaskAddedAsChildOfCarousel = function (queue) {
		queuedApplicationInit(queue,
			'lib/mockapplication',
			["antie/widgets/carousel",
            "antie/widgets/carousel/mask"],
			function (application, Carousel, Mask) {
				var carousel, appendStub, appendedWidget;
                appendStub = this.sandbox.stub(Carousel.prototype, 'appendChildWidget');
				carousel = new Carousel('myCarousel');
                appendedWidget = appendStub.getCall(0).args[0];
				assertTrue("Mask added as child of carousel", appendedWidget instanceof Mask);
			}
		);
	};

	this.CarouselTest.prototype.testCarouselRendersMask = function (queue) {
		queuedApplicationInit(queue,
			'lib/mockapplication',
			["antie/widgets/carousel"],
			function (application, Carousel) {
				var carousel, renderSpy, device;
				device = application.getDevice();

				carousel = new Carousel('myCarousel');

				renderSpy = this.sandbox.stub(carousel._mask, 'render');
				carousel.render(device);

				assertTrue("Carousel renders mask", renderSpy.calledOnce);
			}
		);
	};

    this.CarouselTest.prototype.testCarouselRenderSetsOutputElementToElementReturnedByMaskRender = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            ["antie/widgets/carousel"],
            function (application, Carousel) {
                var carousel, device;
                device = application.getDevice();

                carousel = new Carousel('myCarousel');

                this.sandbox.stub(carousel._mask, 'render').returns("test");
                carousel.render(device);

                assertEquals("Carousel output element set to mask output element", "test", carousel.outputElement);
            }
        );
    };

	this.CarouselTest.prototype.testAppendAddsToWidgetStrip = function (queue) {
		queuedApplicationInit(queue,
			'lib/mockapplication',
			["antie/widgets/carousel"],
			function (application, Carousel) {
				var carousel, appendChildStub, appendedFromCarouselWidget;

				appendedFromCarouselWidget = {
                    dummy: "dummyWidget",
                    addClass: this.sandbox.stub()
                };

				carousel = new Carousel('myCarousel');
				carousel._widgetStrip.append = this.sandbox.stub().withArgs(appendedFromCarouselWidget);

				carousel.append(appendedFromCarouselWidget);

				assertTrue("Carousel appends widget to WidgetStrip", carousel._widgetStrip.append.calledOnce);
			}
		);
	};

    this.CarouselTest.prototype.testAppendAddsCarouselItemClassToWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            ["antie/widgets/carousel"],
            function (application, Carousel) {
                var carousel, fakeWidget;

                fakeWidget = { addClass: this.sandbox.stub() };

                carousel = new Carousel('myCarousel');
                carousel._widgetStrip.append = this.sandbox.stub();

                carousel.append(fakeWidget);

                assertTrue("Carousel adds carouselItem class to appended widget", fakeWidget.addClass.calledWith('carouselItem'));
            }
        );
    };

    this.CarouselTest.prototype.testItemsReturnsWidgetStripWidgets = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            ["antie/widgets/carousel"],
            function (application, Carousel) {
                var carousel, fakeWidget;
                carousel = new Carousel('myCarousel');
                carousel._widgetStrip.widgets = this.sandbox.stub().returns(["test"]);
                assertEquals("Widget strip widgets returned", ["test"], carousel.items());
            }
        );
    };

    this.CarouselTest.prototype.testNavigationDefaultsToBookend = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/button",
                "antie/widgets/carousel/navigators/bookendednavigator"
            ],
            function (application, Carousel, Button, BookendedNavigator) {
                var carousel, navSpy;
                navSpy = this.sandbox.spy(Carousel.prototype, 'setNavigator');
                carousel = new Carousel('myCarousel');
                assertTrue('Navigator set', navSpy.called);
                assertEquals('Navigator set to bookended', navSpy.getCall(0).args[0], BookendedNavigator);
            }
        );
    };

    this.CarouselTest.prototype.testSpinAlignsIndexedWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/bookendednavigator"
            ],
            function (application, Carousel, Mask, BookendedNavigator) {
                var carousel, maskStub, navStub, INDEX;
                INDEX = 3;
                maskStub = this.sandbox.stub(Mask.prototype, 'alignToIndex').withArgs(INDEX);

                carousel = new Carousel('myCarousel');
                carousel.alignToIndex(INDEX);

                assertTrue("Mask asked to align to index", maskStub.calledOnce);
            }
        );
    };

    this.CarouselTest.prototype.testSpinAlignmentSet = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/button",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/bookendednavigator"
            ],
            function (application, Carousel, Button, Mask, BookendedNavigator) {
                var carousel, maskStub, navStub;
                var device = application.getDevice();
                this.sandbox.stub(device, 'moveElementTo');
                maskStub = this.sandbox.stub(Mask.prototype, 'setAlignPoint');

                carousel = new Carousel('myCarousel');
                carousel.append(new Button());
                carousel.setAlignPoint(50);

                assertTrue("Mask asked to change align point", maskStub.calledOnce);
            }
        );
    };

    this.CarouselTest.prototype.testWidgetStripSetDuringInit = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/mask"
            ],
            function (application, Carousel, Mask) {
                var carousel, stripStub;
                Mask.prototype.init = this.sandbox.stub();
                Mask.prototype.addClass = this.sandbox.stub();
                Carousel.prototype.appendChildWidget = this.sandbox.stub();
                stripStub = this.sandbox.stub(Carousel.prototype, 'setWidgetStrip');
                carousel = new Carousel('myCarousel');
                assertTrue("Widget Strip Set", stripStub.calledOnce);
            }
        );
    };

    this.CarouselTest.prototype.testSetWidgetStripInitsStrip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel"
            ],
            function (application, Carousel) {
                var carousel, FakeStrip;
                FakeStrip = this.sandbox.spy();

                carousel = new Carousel('myCarousel');
                carousel._navigator.setContainer = this.sandbox.stub();
                carousel._mask.setWidgetStrip = this.sandbox.stub();
                carousel.setWidgetStrip(FakeStrip);
                assertTrue("Widget Strip Initialised", FakeStrip.calledWithNew());
            }
        );
    };

    this.CarouselTest.prototype.testSetWidgetStripUpdatesNavigatorContainer = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel"
            ],
            function (application, Carousel) {
                var carousel, FakeNav, FakeStrip;
                FakeNav = function () {};
                FakeNav.prototype = {
                    init: function () {},
                    setContainer: this.sandbox.stub()
                };

                FakeStrip = this.sandbox.stub();

                carousel = new Carousel('myCarousel');
                carousel._mask.setWidgetStrip = this.sandbox.stub();
                carousel.setNavigator(FakeNav);
                carousel.setWidgetStrip(FakeStrip);
                assertTrue("Setting widget strip updated navigator", FakeNav.prototype.setContainer.calledOnce);
            }
        );
    };

    this.CarouselTest.prototype.testSetWidgetStripUpdatesMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/mask"
            ],
            function (application, Carousel, Mask) {
                var carousel, FakeStrip;
                this.sandbox.stub(Mask.prototype);

                FakeStrip = this.sandbox.stub();
                carousel = new Carousel('myCarousel');
                carousel.setWidgetStrip(FakeStrip);
                assertTrue("Setting widget strip updated mask", Mask.prototype.setWidgetStrip.calledOnce);
            }
        );
    };

    this.CarouselTest.prototype.testGetActiveIndexReturnsNavigatorIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/navigators/bookendednavigator"
            ],
            function (application, Carousel, BookendedNavigator) {
                var carousel, INDEX, returnedIndex;
                INDEX = 3;

                this.sandbox.stub(BookendedNavigator.prototype);
                BookendedNavigator.prototype.currentIndex.returns(INDEX);
                carousel = new Carousel('myCarousel');
                returnedIndex = carousel.getActiveIndex();

                assertTrue("Navigator asked for index", BookendedNavigator.prototype.currentIndex.calledOnce);
                assertEquals("getActiveIndex returns navigator index", INDEX, returnedIndex);
            }
        );
    };

    this.CarouselTest.prototype.testSetActiveIndexUpdatesNavigator = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/navigators/bookendednavigator"
            ],
            function (application, Carousel, BookendedNavigator) {
                var carousel, INDEX, returnedIndex;
                INDEX = 3;

                this.sandbox.stub(BookendedNavigator.prototype);
                carousel = new Carousel('myCarousel');
                returnedIndex = carousel.setActiveIndex(4);

                assertTrue("Navigator asked to set index", BookendedNavigator.prototype.setIndex.calledWith(4));

            }
        );
    };

    this.CarouselTest.prototype.testSpinToNextAsksAlignerToMoveForwardUsingNavigator = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/aligners/aligner"
            ],
            function (application, Carousel, Navigator, Aligner) {
                var carousel, alignArgs;

                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Aligner.prototype);
                carousel = new Carousel('myCarousel');
                carousel.alignNext();
                assertTrue("Aligner told to move forward", Aligner.prototype.alignNext.calledOnce);
                alignArgs = Aligner.prototype.alignNext.firstCall.args;
                assertTrue("Aligner passed navigator", alignArgs[0] instanceof Navigator);
            }
        );
    };

    this.CarouselTest.prototype.testSpinToPreviousAsksNavigatorToMoveBackwardUsingNavigator = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/aligners/aligner"
            ],
            function (application, Carousel, Navigator, Aligner) {
                var carousel, alignArgs;

                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Aligner.prototype);

                carousel = new Carousel('myCarousel');
                carousel.alignPrevious();
                assertTrue("Aligner told to move backward", Aligner.prototype.alignPrevious.calledOnce);
                alignArgs = Aligner.prototype.alignPrevious.firstCall.args;
                assertTrue("Aligner passed navigator", alignArgs[0] instanceof Navigator);
            }
        );
    };

    this.CarouselTest.prototype.testDefaultOrientationIsVertical = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel"
            ],
            function (application, Carousel, verticalOrientation) {
                var carousel;

                this.sandbox.spy(Carousel.prototype, '_setOrientation');
                carousel = new Carousel('myCarousel');
                assertTrue(Carousel.prototype._setOrientation.calledWith(Carousel.orientations.VERTICAL));

            }
        );
    };

    this.CarouselTest.prototype.testInitWithHorizontalOrientationSetsHorizontalOrientation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel"
            ],
            function (application, Carousel, verticalOrientation) {
                var carousel;

                this.sandbox.spy(Carousel.prototype, '_setOrientation');
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);
                assertTrue(Carousel.prototype._setOrientation.calledWith(Carousel.orientations.HORIZONTAL));

            }
        );
    };

    this.CarouselTest.prototype.testOrientationPassedToMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/orientations/vertical"
            ],
            function (application, Carousel, Mask, vertical) {
                var carousel;
                this.sandbox.stub(Mask.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.VERTICAL);

                assertEquals("Mask created with vertical orientation", vertical, Mask.prototype.init.firstCall.args[2]);

            }
        );
    };

    this.CarouselTest.prototype.testOrientationPassedToWidgetStrip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/orientations/horizontal"
            ],
            function (application, Carousel, WidgetStrip, horizontal) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);

                assertEquals("Widget Strip created with vertical orientation", horizontal, WidgetStrip.prototype.init.firstCall.args[1]);

            }
        );
    };

    this.CarouselTest.prototype.testBeforeAlignEventsFromMaskHaveTargetResetToCarousel = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/orientations/horizontal",
                "antie/events/beforealignevent"
            ],
            function (application, Carousel, WidgetStrip, horizontal, BeforeAlignEvent) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);
                carousel.parentWidget = { bubbleEvent: this.sandbox.stub() };
                carousel.bubbleEvent(new BeforeAlignEvent(carousel._mask, 0));
                assertNotEquals("event target equals mask",
                    carousel._mask, carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
                assertEquals("event target changed to carousel",
                    carousel, carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
            }
        );
    };

    this.CarouselTest.prototype.testBeforeAlignEventsNotFromMaskDontHaveTargetResetToCarousel = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/orientations/horizontal",
                "antie/events/beforealignevent"
            ],
            function (application, Carousel, WidgetStrip, horizontal, BeforeAlignEvent) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);
                carousel.parentWidget = { bubbleEvent: this.sandbox.stub() };
                carousel.bubbleEvent(new BeforeAlignEvent("test", 0));

                assertEquals("event target unchanged",
                    "test", carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
            }
        );
    };

    this.CarouselTest.prototype.testAfterAlignEventsFromMaskHaveTargetResetToCarousel = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/orientations/horizontal",
                "antie/events/afteralignevent"
            ],
            function (application, Carousel, WidgetStrip, horizontal, AfterAlignEvent) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);
                carousel.parentWidget = { bubbleEvent: this.sandbox.stub() };
                carousel.bubbleEvent(new AfterAlignEvent(carousel._mask, 0));
                assertNotEquals("event target equals mask",
                    carousel._mask, carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
                assertEquals("event target changed to carousel",
                    carousel, carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
            }
        );
    };

    this.CarouselTest.prototype.testAfterAlignEventsNotFromMaskDontHaveTargetResetToCarousel = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/orientations/horizontal",
                "antie/events/afteralignevent"
            ],
            function (application, Carousel, WidgetStrip, horizontal, AfterAlignEvent) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                carousel = new Carousel('myCarousel', Carousel.orientations.HORIZONTAL);
                carousel.parentWidget = { bubbleEvent: this.sandbox.stub() };
                carousel.bubbleEvent(new AfterAlignEvent("test", 0));

                assertEquals("event target unchanged",
                    "test", carousel.parentWidget.bubbleEvent.firstCall.args[0].target);
            }
        );
    };

}());