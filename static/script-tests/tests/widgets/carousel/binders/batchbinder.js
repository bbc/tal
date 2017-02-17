/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.BatchBinderTest = AsyncTestCase('BatchBinder');

    this.BatchBinderTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.BatchBinderTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.BatchBinderTest.prototype.testAppendAllToDisablesAutoUpdateBeforeBind = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binders/batchbinder',
                'antie/formatter',
                'antie/widgets/carousel/strips/wrappingstrip'
            ],
            function (application, BatchBinder, Formatter, WrappingStrip) {
                var binder, fakeStrip;
                expectAsserts(2);
                this.sandbox.stub(Formatter.prototype);
                this.sandbox.stub(WrappingStrip.prototype);
                WrappingStrip.prototype.bubbleEvent.restore();
                binder = new BatchBinder(new Formatter(), []);
                fakeStrip = new WrappingStrip();
                this.sandbox.stub(fakeStrip, 'bubbleEvent', function (ev) {
                    if (ev.type === 'beforedatabind') {
                        assertTrue(fakeStrip.autoCalculate.calledWith(false));
                        assertFalse(fakeStrip.autoCalculate.calledWith(true));
                    }
                });
                binder.appendAllTo(fakeStrip);
            }
        );
    };

    this.BatchBinderTest.prototype.testAppendAllToEnablesAutoUpdateAfterBind = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/binders/batchbinder',
                'antie/formatter',
                'antie/widgets/carousel/strips/wrappingstrip'
            ],
            function (application, BatchBinder, Formatter, WrappingStrip) {
                var binder, fakeStrip;
                expectAsserts(2);
                this.sandbox.stub(Formatter.prototype);
                this.sandbox.stub(WrappingStrip.prototype);
                WrappingStrip.prototype.bubbleEvent.restore();
                binder = new BatchBinder(new Formatter(), []);
                fakeStrip = new WrappingStrip();
                this.sandbox.stub(fakeStrip, 'bubbleEvent', function (ev) {
                    if (ev.type === 'databound') {
                        assertTrue(fakeStrip.autoCalculate.calledWith(true));
                        assertTrue(fakeStrip.recalculate.calledOnce);
                    }
                });
                binder.appendAllTo(fakeStrip);
            }
        );
    };
}());
