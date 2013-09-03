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
    this.BatchBinderTest = AsyncTestCase("BatchBinder");

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
                "antie/widgets/carousel/binders/batchbinder",
                "antie/formatter",
                "antie/widgets/carousel/strips/wrappingstrip"
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
                "antie/widgets/carousel/binders/batchbinder",
                "antie/formatter",
                "antie/widgets/carousel/strips/wrappingstrip"
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