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
    this.CarouselFactoryTest = AsyncTestCase("CarouselFactory");

    this.CarouselFactoryTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.CarouselFactoryTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.CarouselFactoryTest.prototype.runTest = function (queue, fn) {
        var self = this;
        
        function wrapped(application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip) {
            fn.call(self, application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip);
        }

        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/factories/carouselfactory',
                'antie/widgets/carousel',
                'antie/widgets/carousel/keyhandlers/alignfirsthandler',
                'antie/widgets/carousel/navigators/wrappingnavigator',
                'antie/widgets/carousel/strips/wrappingstrip'
            ],
            wrapped
        );
    };

    this.CarouselFactoryTest.prototype.testVerticalBookenededAlignFirstCarouselHasVerticalOrientation = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler) {
                var factory, carousel;
                factory = new CarouselFactory();
                carousel = factory.newVerticalBookendedAlignFirstCarousel();
                assertEquals(Carousel.orientations.VERTICAL, carousel.orientation());
            }
        );
    };

    this.CarouselFactoryTest.prototype.testVerticalBookenededAlignFirstCarouselHasAlignFirstHandlerAttached = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler) {
                var factory, carousel;
                this.sandbox.stub(AlignFirstHandler.prototype);
                factory = new CarouselFactory();
                carousel = factory.newVerticalBookendedAlignFirstCarousel();
                assertTrue(AlignFirstHandler.prototype.attach.calledOnce);
            }
        );
    };

    this.CarouselFactoryTest.prototype.testNewVerticalVisuallyWrappedAlignFirstCarouselHasVerticalOrientation = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler) {
                var factory, carousel;
                factory = new CarouselFactory();
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel();
                assertEquals(Carousel.orientations.VERTICAL, carousel.orientation());
            }
        );
    };

    this.CarouselFactoryTest.prototype.testNewVerticalVisuallyWrappedAlignFirstCarouselHasAlignFirstHandlerAttached = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler) {
                var factory, carousel;
                this.sandbox.stub(AlignFirstHandler.prototype);
                factory = new CarouselFactory();
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel();
                assertTrue(AlignFirstHandler.prototype.attach.calledOnce);
            }
        );
    };

    this.CarouselFactoryTest.prototype.testNewVerticalVisuallyWrappedAlignFirstCarouselHasWrappingNavigatorSet = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator) {
                var factory, carousel, navSetSpy;
                navSetSpy = this.sandbox.spy(Carousel.prototype, 'setNavigator');
                factory = new CarouselFactory();
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel();
                assertTrue(navSetSpy.calledWith(WrappingNavigator));
            }
        );
    };

    this.CarouselFactoryTest.prototype.testNewVerticalVisuallyWrappedAlignFirstCarouselHasWrappingStripSet = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip) {
                var factory, carousel, stripSetSpy;
                stripSetSpy = this.sandbox.spy(Carousel.prototype, 'setWidgetStrip');
                factory = new CarouselFactory();
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel();
                assertTrue(stripSetSpy.calledWith(WrappingStrip));
            }
        );
    };

    this.CarouselFactoryTest.prototype.testPassedInAnimOptionsSetOnKeyHandler = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip) {
                var factory, carousel, options;
                this.sandbox.stub(AlignFirstHandler.prototype);
                factory = new CarouselFactory();
                options = {test: "test"};
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel('test', options);
                assertTrue(AlignFirstHandler.prototype.setAnimationOptions.calledWith(options));
            }
        );
    };

    this.CarouselFactoryTest.prototype.testDefaultEmptyAnimOptions = function (queue) {
        this.runTest(queue,
            function (application, CarouselFactory, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip) {
                var factory, carousel, options;
                this.sandbox.stub(AlignFirstHandler.prototype);
                factory = new CarouselFactory();
                options = {};
                carousel = factory.newVerticalVisuallyWrappedAlignFirstCarousel('test');
                assertTrue(AlignFirstHandler.prototype.setAnimationOptions.calledWith(options));
            }
        );
    };
}());