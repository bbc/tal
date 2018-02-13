/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.BinderTest = AsyncTestCase('Binder');

    this.BinderTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.BinderTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.BinderTest.prototype.testBindAllAppendsFormattedItemToWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder'
            ],
            function (application, Binder) {
                var binder, fakeWidget, fakeFormatter, fakeDataSource, fakeItem;
                fakeItem = {
                    fake: 'item'
                };
                fakeFormatter = {
                    format: function () {}
                };
                this.sandbox.stub(fakeFormatter, 'format', function (it) {
                    it.next();
                    return fakeItem;
                });
                fakeDataSource = {
                    load: function (callbacks) {
                        callbacks.onSuccess([fakeItem]);
                    }
                };
                binder = new Binder(fakeFormatter, fakeDataSource);
                fakeWidget = {
                    appendChildWidget: this.sandbox.stub(),
                    bubbleEvent: this.sandbox.stub()
                };
                binder.appendAllTo(fakeWidget);

                assertTrue('Item formatter called', fakeFormatter.format.calledOnce);
                assertTrue('Widget append called', fakeWidget.appendChildWidget.calledOnce);
                assertEquals('Formatted item appended to widget', fakeItem, fakeWidget.appendChildWidget.getCall(0).args[0]);
            }
        );
    };

    this.BinderTest.prototype.testArrayDataSourceDoesNotCallLoadOnBind = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/formatter',
                'antie/widgets/widget'
            ],
            function (application, Binder, Formatter, Widget) {
                var binder, dataSource, formatter, widget;
                this.sandbox.stub(Formatter.prototype);
                this.sandbox.stub(Widget.prototype);
                formatter = new Formatter();
                dataSource = [];
                dataSource.load = this.sandbox.stub();
                binder = new Binder(formatter, dataSource);
                widget = new Widget();
                binder.appendAllTo(widget);
                assertFalse('load called on array datasource', dataSource.load.called);

            }
        );
    };

    this.BinderTest.prototype.testArrayDataSourceUsedToBindWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/formatter',
                'antie/widgets/carousel/carouselcore',
                'antie/iterator'
            ],
            function (application, Binder, Formatter, Carousel, Iterator) {
                var binder, dataSource, formatter, carousel, callCount;
                callCount = 0;
                this.sandbox.stub(Formatter.prototype);
                this.sandbox.stub(Carousel.prototype);
                this.sandbox.stub(Iterator.prototype);
                Iterator.prototype.hasNext.restore();
                this.sandbox.stub(Iterator.prototype, 'hasNext', function () {
                    if (callCount === 0) {
                        callCount += 1;
                        return true;
                    } else {
                        callCount += 1;
                        return false;
                    }
                });
                formatter = new Formatter();
                dataSource = ['test'];

                binder = new Binder(formatter, dataSource);
                carousel = new Carousel();
                binder.appendAllTo(carousel);

                assertTrue('DataSource converted to iterator on bind', Iterator.prototype.init.calledWith(dataSource));
                assertTrue('Widget appended to carousel', carousel.appendChildWidget.called);
            }
        );
    };

    this.BinderTest.prototype.testBindAllAppendsItemsToWidgetInCorrectOrder = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder'
            ],
            function (application, Binder) {
                var binder, fakeWidget, fakeFormatter, fakeDataSource, fakeItem, fakeItem2, items, i;
                i = 0;
                fakeItem = {
                    fake: 'item'
                };
                fakeItem2 = {
                    fake: 'item2'
                };
                fakeFormatter = {
                    format: function () {}
                };
                items = [fakeItem, fakeItem2];
                this.sandbox.stub(fakeFormatter, 'format', function (it) {
                    var item = items[i];
                    i += 1;
                    it.next();
                    return item;
                });
                fakeDataSource = {
                    load: function (callbacks) {
                        callbacks.onSuccess([fakeItem, fakeItem2]);
                    }
                };
                binder = new Binder(fakeFormatter, fakeDataSource);
                fakeWidget = {
                    childWidgets: [],
                    appendChildWidget: function (widget) {
                        this.childWidgets.push(widget);
                    },
                    bubbleEvent: this.sandbox.stub()
                };
                binder.appendAllTo(fakeWidget);
                expect(fakeWidget.childWidgets).toEqual([
                    fakeItem,
                    fakeItem2
                ]);
            }
        );
    };

    this.BinderTest.prototype.testBindAllAppendsItemsProvidedAsIterator = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/iterator'
            ],
            function (application, Binder, Iterator) {
                var it, binder, fakeWidget, fakeFormatter, fakeDataSource, fakeItem, fakeItem2, i, items;
                i = 0;
                fakeItem = {
                    fake: 'item'
                };
                fakeItem2 = {
                    fake: 'item2'
                };
                items = [fakeItem, fakeItem2];
                it = new Iterator(items);

                fakeFormatter = {
                    format: function () {}
                };
                this.sandbox.stub(fakeFormatter, 'format', function (it) {
                    var item = items[i];
                    i += 1;
                    it.next();
                    return item;
                });

                fakeDataSource = {
                    load: function (callbacks) {
                        callbacks.onSuccess(it);
                    }
                };
                binder = new Binder(fakeFormatter, fakeDataSource);
                fakeWidget = {
                    childWidgets: [],
                    appendChildWidget: function (widget) {
                        this.childWidgets.push(widget);
                    },
                    bubbleEvent: this.sandbox.stub()
                };
                binder.appendAllTo(fakeWidget);
                expect(fakeWidget.childWidgets).toEqual([
                    fakeItem,
                    fakeItem2
                ]);
            }
        );
    };

    this.BinderTest.prototype.testBindAllBubblesBeforeDataBoundOnWidgetBeforeLoad = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/events/databoundevent'
            ],
            function (application, Binder, DataBoundEvent) {
                var binder, fakeWidget, fakeFormatter, fakeDataSource;

                fakeFormatter = {
                    format: function (it) {
                        it.next();
                        return {};
                    }
                };

                fakeDataSource = {
                    load: this.sandbox.stub()
                };

                binder = new Binder(fakeFormatter, fakeDataSource);

                fakeWidget = {
                    appendChildWidget: this.sandbox.stub(),
                    bubbleEvent: this.sandbox.stub()
                };

                binder.appendAllTo(fakeWidget);

                assertTrue('event bubbled on widget',
                    fakeWidget.bubbleEvent.calledOnce);
                assertTrue('event bubbled instance of databoundevent',
                    fakeWidget.bubbleEvent.getCall(0).args[0] instanceof DataBoundEvent);
                assertEquals('event bubbled beforedatabind',
                    'beforedatabind',
                    fakeWidget.bubbleEvent.getCall(0).args[0].type
                );
                assertEquals('event target is widget',
                    fakeWidget,
                    fakeWidget.bubbleEvent.getCall(0).args[0].target
                );
                sinon.assert.callOrder(fakeWidget.bubbleEvent, fakeDataSource.load);
            }
        );
    };

    this.BinderTest.prototype.testBindAllBubblesDataBoundOnWidgetAfterWidgetsAppended = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/events/databoundevent',
                'antie/iterator'
            ],
            function (application, Binder, DataBoundEvent, Iterator) {
                var binder, fakeWidget, fakeFormatter, fakeDataSource, fakeItem, it;
                fakeItem = {
                    fake: 'item'
                };
                fakeFormatter = {
                    format: function (it) {
                        it.next();
                        return {};
                    }
                };
                it = new Iterator([fakeItem]);
                fakeDataSource = {
                    load: function () {}
                };

                this.sandbox.stub(fakeDataSource, 'load', function (callbacks) {
                    callbacks.onSuccess(it);
                });

                binder = new Binder(fakeFormatter, fakeDataSource);
                fakeWidget = {
                    appendChildWidget: this.sandbox.stub(),
                    bubbleEvent: this.sandbox.stub()
                };
                binder.appendAllTo(fakeWidget);

                assertEquals('2 events, beforedatabind and databound bubbled on widget',
                    2,
                    fakeWidget.bubbleEvent.callCount);
                assertTrue('second event bubbled instance of databoundevent',
                    fakeWidget.bubbleEvent.getCall(1).args[0] instanceof DataBoundEvent);
                assertEquals('event bubbled databound',
                    'databound',
                    fakeWidget.bubbleEvent.getCall(1).args[0].type
                );
                assertEquals('event target is widget',
                    fakeWidget,
                    fakeWidget.bubbleEvent.getCall(1).args[0].target
                );
                assertEquals('event iterator is iterator returned by datasource',
                    it,
                    fakeWidget.bubbleEvent.getCall(1).args[0].iterator
                );
                assertTrue('bubble called after appendChildWidget', fakeWidget.bubbleEvent.calledAfter(fakeWidget.appendChildWidget));

            }
        );
    };

    this.BinderTest.prototype.testBindAllBubblesDataBindingErrorOnWidgetIfError = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binder',
                'antie/events/databoundevent'
            ],
            function (application, Binder, DataBoundEvent) {
                var binder, fakeWidget, fakeFormatter, fakeDataSource, error;
                error = 'ERROR';

                fakeFormatter = {
                    format: function (it) {
                        it.next();
                        return {};
                    }
                };
                fakeDataSource = {
                    load: function () {}
                };
                this.sandbox.stub(fakeDataSource, 'load', function (callbacks) {
                    callbacks.onError(error);
                });
                binder = new Binder(fakeFormatter, fakeDataSource);
                fakeWidget = {
                    appendChildWidget: this.sandbox.stub(),
                    bubbleEvent: this.sandbox.stub()
                };
                binder.appendAllTo(fakeWidget);

                assertEquals('2 events, beforedatabind and databindingerror bubbled on widget',
                    2,
                    fakeWidget.bubbleEvent.callCount);
                assertTrue('second event bubbled instance of databoundevent',
                    fakeWidget.bubbleEvent.getCall(1).args[0] instanceof DataBoundEvent);
                assertEquals('event bubbled databindingerror',
                    'databindingerror',
                    fakeWidget.bubbleEvent.getCall(1).args[0].type
                );
                assertEquals('event target is widget',
                    fakeWidget,
                    fakeWidget.bubbleEvent.getCall(1).args[0].target
                );
                assertTrue('event iterator is null',
                    null === fakeWidget.bubbleEvent.getCall(1).args[0].iterator
                );
                assertEquals('error passed to event',
                    error,
                    fakeWidget.bubbleEvent.getCall(1).args[0].error
                );
                assertTrue('bubble called after load', fakeWidget.bubbleEvent.calledAfter(fakeDataSource.load));
            }
        );
    };
}());
