/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.ActivateFirstHandlerTest = AsyncTestCase('ActivateFirstHandler');

    this.ActivateFirstHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.ActivateFirstHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var runTest = function (self, queue, fn) {
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
                'antie/widgets/carousel/keyhandlers/activatefirsthandler',
                'antie/widgets/carousel/carouselcore',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/navigators/bookendednavigator',
                'antie/widgets/carousel/aligners/aligner',
                'antie/events/keyevent',
                'antie/widgets/container',
                'antie/events/beforealignevent'
            ],
            wrapped
        );
    };

    var createCarouselAndAttachHandler = function (CarouselCore, Handler, orientation) {
        var carousel, handler;
        carousel = new CarouselCore('myCarousel', orientation);
        handler = new Handler();
        handler.attach(carousel);
        return carousel;
    };

    this.ActivateFirstHandlerTest.prototype.testHandlerCausesSetActiveIndexOnBeforeAlign = function (queue) {
        runTest(this, queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, beforeAlignEvent, targetIndex;
                carousel = createCarouselAndAttachHandler(CarouselCore, Handler);
                targetIndex = 1;
                this.sandbox.spy(carousel, 'setActiveIndex');

                beforeAlignEvent = new BeforeAlignEvent(carousel, targetIndex);
                carousel.bubbleEvent(beforeAlignEvent);
                assertTrue(carousel.setActiveIndex.withArgs(targetIndex).calledOnce);
            }
        );
    };

    this.ActivateFirstHandlerTest.prototype.testHandlerRespondsOnlyToOwnCarouselEvents = function (queue) {
        runTest(this, queue,
            function (application, Handler, CarouselCore, WidgetStrip, Mask, Navigator, Aligner, KeyEvent, Container, BeforeAlignEvent) {
                var carousel, beforeAlignEvent, targetIndex;
                carousel = createCarouselAndAttachHandler(CarouselCore, Handler);
                targetIndex = 1;
                this.sandbox.spy(carousel, 'setActiveIndex');

                beforeAlignEvent = new BeforeAlignEvent(null, targetIndex);
                carousel.bubbleEvent(beforeAlignEvent);
                assert(carousel.setActiveIndex.notCalled);
            }
        );
    };
}());
