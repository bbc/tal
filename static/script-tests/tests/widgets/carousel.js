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

    this.CarouselTest.prototype.testContainerAPIRedirectsToAppropriateClasses = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel',
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/button"

            ],
            function (application, Carousel, WidgetStrip, Mask, Navigator, Button) {
                var carousel;
                this.sandbox.stub(WidgetStrip.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(Button.prototype);
                this.sandbox.stub(Navigator.prototype);
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
        );
    };
}());