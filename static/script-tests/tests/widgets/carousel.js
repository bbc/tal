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

    this.CarouselTest.prototype.queueTest = function(queue, fn) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel',
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/button",
                "antie/widgets/container",
                "antie/widgets/carousel/carouselcore"

            ],
            fn
        );
    };

    this.CarouselTest.prototype.stubClassPrototypes = function (classArray) {
        function stubUnstubbedFunctions(Class) {
            var prototype, propertyName, property;
            prototype = Class.prototype;
            for (propertyName in prototype) {
                property = prototype[propertyName];
                if ((typeof property === 'function') && !(property.restore && property.restore.sinon) && propertyName !== 'self') {
                    self.sandbox.stub(prototype, propertyName);
                }
            }
        }
        var i, currentClass, self;
        self = this;

        for (i = 0; i !== classArray.length; i += 1) {
            currentClass = classArray[i];
            stubUnstubbedFunctions(classArray[i]);
        }
    },

    this.CarouselTest.prototype.testContainerAPIRedirectsToAppropriateClasses = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator]);

            carousel = new Carousel('myCarousel');
            assertFalse("append", WidgetStrip.prototype.append.called);
            carousel.appendChildWidget(new Button());
            assertTrue("Append child widget appends to widget strip", WidgetStrip.prototype.append.called);

            assertFalse("getChildWidget", WidgetStrip.prototype.getChildWidget.called);
            carousel.getChildWidget("test");
            assertTrue("getChildWidget gets from widget strip", WidgetStrip.prototype.getChildWidget.called);

            assertFalse("getChildWidgetCount", WidgetStrip.prototype.getChildWidgetCount.called);
            carousel.getChildWidgetCount();
            assertTrue("getChildWidgetCount gets from widget strip", WidgetStrip.prototype.getChildWidgetCount.called);

            assertFalse("getChildWidgets", WidgetStrip.prototype.getChildWidgets.called);
            carousel.getChildWidgets();
            assertTrue("getChildWidgets gets from widget strip", WidgetStrip.prototype.widgets.called);

            assertFalse("hasChildWidget", WidgetStrip.prototype.hasChildWidget.called);
            carousel.hasChildWidget(new Button());
            assertTrue("hasChildWidget queries widget strip", WidgetStrip.prototype.hasChildWidget.called);

            assertFalse("setIndex", Navigator.prototype.setIndex.called);
            carousel.setActiveChildIndex(2);
            assertTrue("setActiveIndex sets on navigator", Navigator.prototype.setIndex.called);

            assertFalse("getActiveIndex", Navigator.prototype.currentIndex.called);
            carousel.getActiveChildIndex();
            assertTrue("getActiveIndex gets from navigator", Navigator.prototype.currentIndex.called);

            carousel.addClass("setTest");
            assertTrue("addClass passes through to widget strip", WidgetStrip.prototype.addClass.calledWith("setTest"));

            carousel.hasClass("hasTest");
            assertTrue("hasClass passes through to widget strip", WidgetStrip.prototype.hasClass.calledWith("hasTest"));

            carousel.removeClass("removeClass");
            assertTrue("removeClass passes through to widget strip", WidgetStrip.prototype.removeClass.calledWith("removeClass"));

            assertFalse("getClasses", WidgetStrip.prototype.getClasses.called);
            carousel.getClasses();
            assertTrue("getClasses passes through to widget strip", WidgetStrip.prototype.getClasses.called);

        }
        this.queueTest(queue, testFunction);

    };

    this.CarouselTest.prototype.testAppendChildWidgetCallsContainerPrototypeDuringInit = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.append = this.sandbox.stub();
            carousel = new Carousel();
            assertTrue(Container.prototype.appendChildWidget.calledOnce);
            assertFalse(CarouselCore.prototype.append.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testAppendChildWidgetCallsAppendAfterInit = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.append = this.sandbox.stub();
            carousel = new Carousel();
            carousel.append(new Button());
            assertTrue(Container.prototype.appendChildWidget.calledOnce);
            assertTrue(CarouselCore.prototype.append.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testSetActiveChildWidgetWithMaskCallsContainerPrototype = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.setActiveWidget = this.sandbox.stub();
            carousel = new Carousel();
            carousel.setActiveChildWidget(carousel._mask);
            assertTrue(Container.prototype.setActiveChildWidget.calledOnce);
            assertFalse(CarouselCore.prototype.setActiveWidget.called);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testSetActiveChildWidgetWithNonMaskCallsSetActiveWidget = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.setActiveWidget = this.sandbox.stub();
            carousel = new Carousel();
            carousel.setActiveChildWidget(new Button());
            assertFalse(Container.prototype.setActiveChildWidget.called);
            assertTrue(CarouselCore.prototype.setActiveWidget.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testHasChildWidgetWithMaskIdCallsCore = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.hasChildWidget = this.sandbox.stub();
            carousel = new Carousel();
            carousel.hasChildWidget(carousel._mask.id);
            assertTrue(CarouselCore.prototype.hasChildWidget.calledOnce);
            assertFalse(WidgetStrip.prototype.hasChildWidget.called);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testHasChildWidgetWithNonMaskIdCallsWidgetStrip = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.hasChildWidget = this.sandbox.stub();
            carousel = new Carousel();
            carousel.hasChildWidget("testId");
            assertFalse(CarouselCore.prototype.hasChildWidget.called);
            assertTrue(WidgetStrip.prototype.hasChildWidget.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testGetChildWidgetWithMaskIdCallsCore = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel, widget;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.getChildWidget = this.sandbox.stub();
            carousel = new Carousel();
            widget = carousel.getChildWidget(carousel._mask.id);
            assertEquals(carousel._mask, widget);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testGetChildWidgetWithNonMaskIdCallsWidgetStrip = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.getChildWidget = this.sandbox.stub();
            carousel = new Carousel();
            carousel.getChildWidget("testId");
            assertTrue(WidgetStrip.prototype.getChildWidget.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };

    this.CarouselTest.prototype.testInsertChildWidgetCallsInsert = function (queue) {
        function testFunction(application, Carousel, WidgetStrip, Mask, Navigator, Button, Container, CarouselCore) {
            var carousel;
            this.stubClassPrototypes([WidgetStrip, Mask, Button, Navigator, Container]);
            CarouselCore.prototype.insert = this.sandbox.stub();
            carousel = new Carousel();
            carousel.insertChildWidget(new Button());
            assertTrue(CarouselCore.prototype.insert.calledOnce);
        }
        this.queueTest(queue, testFunction);
    };
}());