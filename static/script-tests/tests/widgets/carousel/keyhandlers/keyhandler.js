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
    this.KeyHandlerTest = AsyncTestCase("KeyHandler");

    this.KeyHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.KeyHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.KeyHandlerTest.prototype.runTest = function (queue, fn) {
        var self = this;
        function wrapped(application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
            self.sandbox.stub(WidgetStrip.prototype);
            self.sandbox.stub(Mask.prototype);
            self.sandbox.stub(Aligner.prototype);
            self.sandbox.stub(Navigator.prototype);
            fn.call(self, application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent);
        }

        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/keyhandlers/keyhandler',
                'antie/widgets/carousel/carouselcore',
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/bookendednavigator",
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/keyevent",
                "antie/widgets/container",
                "antie/events/beforealignevent"
            ],
            wrapped
        );
    };

    this.KeyHandlerTest.prototype.createCarouselAndAttachHandler = function (CarouselCore, Handler, orientation) {
        var carousel, handler;
        carousel = new CarouselCore('myCarousel', orientation);
        handler = new Handler();
        handler.attach(carousel);
        return carousel;
    };

    this.KeyHandlerTest.prototype.createContainerAndAppend = function (Container, toAppend) {
        var container;
        container = new Container();
        container.appendChildWidget(toAppend);
        return container;
    };

    this.KeyHandlerTest.prototype.testHandlerStopsUpKeyPropogation = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, container, upEvent;
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_UP);
                carousel.bubbleEvent(upEvent);
                assertFalse(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerStopsDownKeyPropogation = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, container, upEvent;
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(upEvent);
                assertFalse(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerBubblesLeftKeyEvent = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, container, upEvent;
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_LEFT);
                carousel.bubbleEvent(upEvent);
                assertTrue(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerCausesUpKeyToAlignPrevious = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, upEvent;
                Navigator.prototype.previousIndex = this.sandbox.stub().returns(3);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                this.sandbox.spy(carousel, 'alignPrevious');
                upEvent = new KeyEvent('keydown', KeyEvent.VK_UP);
                carousel.bubbleEvent(upEvent);
                assertTrue(carousel.alignPrevious.calledOnce);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerCausesDownKeyToAlignNext = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, upEvent;
                Navigator.prototype.nextIndex = this.sandbox.stub().returns(3);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                this.sandbox.spy(carousel, 'alignNext');
                upEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(upEvent);
                assertTrue(carousel.alignNext.calledOnce);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerDoesNotAlignOnUpWhenNoPreviousIndex = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, upEvent;
                Navigator.prototype.previousIndex.returns(null);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                this.sandbox.spy(carousel, 'alignPrevious');
                upEvent = new KeyEvent('keydown', KeyEvent.VK_UP);
                carousel.bubbleEvent(upEvent);
                assertFalse(carousel.alignPrevious.calledOnce);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerDoesNotAlignOnDownWhenNoNextIndex = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, downEvent;
                Navigator.prototype.nextIndex.returns(null);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                this.sandbox.spy(carousel, 'alignNext');
                downEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(downEvent);
                assertFalse(carousel.alignNext.calledOnce);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerBubblesUpEventWhenNoPreviousIndex = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, upEvent, container;
                Navigator.prototype.previousIndex.returns(null);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_UP);
                carousel.bubbleEvent(upEvent);
                assertTrue(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerBubblesDownEventWhenNoNextIndex = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, downEvent, container;
                Navigator.prototype.nextIndex.returns(null);
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                downEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(downEvent);
                assertTrue(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHorizontalHandlerStopsLeftKeyPropogation = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, container, upEvent;
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler, CarouselCore.orientations.HORIZONTAL);
                container = this.createContainerAndAppend(Container, carousel);
                container.bubbleEvent = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_LEFT);
                carousel.bubbleEvent(upEvent);
                assertFalse(container.bubbleEvent.called);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerPassesEmptyAnimationOptionsByDefault = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, upEvent;
                carousel = this.createCarouselAndAttachHandler(CarouselCore, Handler);
                carousel.alignNext = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(upEvent);
                assertEquals("Animation object empty by default", {}, carousel.alignNext.firstCall.args[0]);
            }
        );
    };

    this.KeyHandlerTest.prototype.testHandlerPassesSpecifiedAnimationOptions = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, upEvent, handler, options;
                options = {test: "test"};
                carousel = new CarouselCore('myCarousel');
                handler = new Handler();
                handler.setAnimationOptions(options);
                handler.attach(carousel);
                carousel.alignNext = this.sandbox.stub();
                upEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(upEvent);
                assertEquals("Animation object empty by default", options, carousel.alignNext.firstCall.args[0]);
            }
        );
    };

    this.KeyHandlerTest.prototype.testCallsCompleteBeforeNext = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, nextEvent, handler, options;
                options = {test: "test"};
                carousel = new CarouselCore('myCarousel');
                handler = new Handler();
                handler.setAnimationOptions(options);
                handler.attach(carousel);
                carousel.alignNext = this.sandbox.stub();
                carousel.completeAlignment = this.sandbox.stub();
                nextEvent = new KeyEvent('keydown', KeyEvent.VK_DOWN);
                carousel.bubbleEvent(nextEvent);
                assertTrue("completeAlignment called", carousel.completeAlignment.calledOnce);
                assertTrue("completeAlignment called before alignNext", carousel.completeAlignment.calledBefore(carousel.alignNext));
            }
        );
    };

    this.KeyHandlerTest.prototype.testCallsCompleteBeforePrevious = function (queue) {
        this.runTest(queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container) {
                var carousel, previousEvent, handler, options;
                options = {test: "test"};
                carousel = new CarouselCore('myCarousel');
                handler = new Handler();
                handler.setAnimationOptions(options);
                handler.attach(carousel);
                carousel.alignPrevious = this.sandbox.stub();
                carousel.completeAlignment = this.sandbox.stub();
                previousEvent = new KeyEvent('keydown', KeyEvent.VK_UP);
                carousel.bubbleEvent(previousEvent);
                assertTrue("completeAlignment called", carousel.completeAlignment.calledOnce);
                assertTrue("completeAlignment called before alignPrevious", carousel.completeAlignment.calledBefore(carousel.alignPrevious));
            }
        );
    };
}());