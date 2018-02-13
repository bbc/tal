/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.CullingStripTest = AsyncTestCase('CullingStrip');

    this.CullingStripTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.CullingStripTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.CullingStripTest.prototype.testIsAWidgetStrip = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/strips/widgetstrip'
            ],
            function (application, CullingStrip, vertical, WidgetStrip) {
                var strip = new CullingStrip('test', vertical);
                assertTrue('Culling strip is a Widget Strip', strip instanceof WidgetStrip);
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsOnInit = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, CullingStrip, vertical) {
                var strip = new CullingStrip('test', vertical);
                assertFalse('Widgets detached on init', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasDetachedWidgetsAfterAppend = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget'
            ],
            function (application, CullingStrip, vertical, Widget) {
                this.sandbox.stub(Widget.prototype);
                var strip = new CullingStrip('test', vertical);
                strip.append(new Widget(), 50);
                assertTrue('Widgets detached on append', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasDetachedWidgetsAfterInsert = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget'
            ],
            function (application, CullingStrip, vertical, Widget) {
                this.sandbox.stub(Widget.prototype);
                var strip = new CullingStrip('test', vertical);
                strip.insert(0, new Widget(), 50);
                assertTrue('Widgets detached on insert', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsAfterLastRemoved = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                var widget = new Widget();
                strip.append(widget, 50);
                strip.remove(widget);
                assertFalse('Widgets detached after last removed', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsAfterAllRemoved = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                var widgets;
                stubAppAndDevice(self, application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                widgets = createWidgets(2, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);
                strip.removeAll();
                assertFalse('Widgets not detached after all removed', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testWidgetNotRenderedOnAppend = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                spyOn(Widget.prototype, 'init');
                spyOn(Widget.prototype, 'addClass');
                spyOn(Widget.prototype, 'render');
                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};
                strip.append(new Widget());
                expect(Widget.prototype.render).not.toHaveBeenCalled();
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsRendersIndexedWidgetWithoutOutputElements = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widget = new Widget('test');
                spyOn(widget, 'render');
                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};
                strip.append(widget);
                strip.attachIndexedWidgets([0]);
                expect(widget.render.calls.count()).toBe(1);
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsDoesNotReRenderAttachedWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};

                widgets = createWidgets(2, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1]);

                strip.attachIndexedWidgets([0, 1]);
                expect(widgets[0].render.calls.count()).toBe(1);
                expect(widgets[1].render.calls.count()).toBe(1);
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsDetachesNonIndexedAttachedWidgets = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};

                widgets = createWidgets(3, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1]);
                strip.attachIndexedWidgets([0, 2]);

                expect(Device.prototype.removeElement).toHaveBeenCalledWith(widgets[1].outputElement);
                expect(Device.prototype.removeElement).not.toHaveBeenCalledWith(widgets[0].outputElement);
                expect(Device.prototype.removeElement).not.toHaveBeenCalledWith(widgets[2].outputElement);
            }
        );
    };

    this.CullingStripTest.prototype.testWidgetsBeforeCurrentlyAttachedBlockPrepended = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = createWidgets(4, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1, 2]);
                strip.attachIndexedWidgets([0, 3]);

                expect(Device.prototype.prependChildElement).toHaveBeenCalledWith(strip.outputElement, widgets[0].outputElement);
                expect(Device.prototype.appendChildElement).not.toHaveBeenCalledWith(strip.outputElement, widgets[0].outputElement);
            }
        );
    };

    this.CullingStripTest.prototype.testRenderCausesWidgetsToReRenderOnAttach = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = createWidgets(1, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([0]);
                expect(widgets[0].render.calls.count()).toBe(1);

                strip.render(new Device());
                expect(widgets[0].render.calls.count()).toBe(1);

                strip.attachIndexedWidgets([0]);
                expect(widgets[0].render.calls.count()).toBe(2);

            }
        );
    };

    this.CullingStripTest.prototype.testRenderWithNoOutputElementCreatesContainerAndSetsAsOutput = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                var device = new Device();
                device.createContainer.and.returnValue('test');
                var rendered = strip.render(device);
                assertEquals('test', strip.outputElement);
                assertEquals(rendered, strip.outputElement);
            }
        );
    };

    this.CullingStripTest.prototype.testRenderWithOutputDoesNotCreateNewOutputElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                var device = new Device();
                device.createContainer.and.returnValue('test');
                var el = {id: 'strip'};
                strip.outputElement = el;
                var rendered = strip.render(device);
                assertEquals(el, strip.outputElement);
                assertEquals(rendered, el);
            }
        );
    };

    this.CullingStripTest.prototype.testRenderClearsExistingOutput = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                var device = new Device();
                device.createContainer.and.returnValue('test');
                var el = {id: 'strip'};
                strip.outputElement = el;
                strip.render(device);
                expect(device.clearElement).toHaveBeenCalledWith(el);
            }
        );
    };

    this.CullingStripTest.prototype.testGetLengthToIndexErrorsIfNoLengthsSet = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var i, widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = createWidgets(3, Widget);
                stubRenderOn(self, widgets);
                for (i = 0; i !== widgets.length; i += 1) {
                    strip.append(widgets[i]);
                }

                strip.attachIndexedWidgets([1, 2]);
                function getLengthToIndex() {
                    strip.getLengthToIndex(2);
                }
                assertException(getLengthToIndex, 'Error');
            }
        );
    };

    this.CullingStripTest.prototype.testGetLengthToIndexCorrectWhenAllAttached = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = createWidgets(3, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([0, 1, 2]);
                assertEquals('Length when all attached', 80, strip.getLengthToIndex(2));
            }
        );
    };

    this.CullingStripTest.prototype.testGetLengthToIndexCorrectWhenSomeDetached = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                stubAppAndDevice(self, application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = createWidgets(3, Widget);
                stubRenderOn(self, widgets);
                appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1, 2]);
                assertEquals('Length when all attached', 40, strip.getLengthToIndex(2));
            }
        );
    };

    var stubAppAndDevice = function (self, application, Device, Widget) {
        for (var i in Device.prototype) {
            if(Device.prototype.hasOwnProperty(i)) {
                spyOn(Device.prototype, i);
            }
        }
        spyOn(Widget.prototype, 'getCurrentApplication').and.returnValue(application);
    };

    var appendAllTo = function (strip, widgetArray, widgetsLength) {
        var i, widget;
        for (i = 0; i !== widgetArray.length; i += 1) {
            widget = widgetArray[i];
            strip.append(widget, widgetsLength);
        }
    };

    var stubRenderOn = function (self, renderableObjectArray) {
        var i, renderable;
        function renderStub() {
            this.outputElement = {id: this.id};
        }

        for (i = 0; i !== renderableObjectArray.length; i += 1) {
            renderable = renderableObjectArray[i];
            spyOn(renderable, 'render').and.callFake(renderStub);
        }
    };

    var createWidgets = function (numberOfWidgets, Widget) {
        var i, widget, widgets;
        widgets = [];
        for (i = 0; i !== numberOfWidgets; i += 1) {
            widget = new Widget('test' + i);
            widgets.push(widget);
        }
        return widgets;
    };
}());
