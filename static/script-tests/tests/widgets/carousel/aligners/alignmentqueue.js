/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.AlignmentQueueTest = AsyncTestCase('AlignmentQueue');

    this.AlignmentQueueTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AlignmentQueueTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.AlignmentQueueTest.prototype.testQueuedAlignmentsExecuteInOrder = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, firstAlign, secondAlign;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.yieldsTo('onComplete');
                queue = new AlignmentQueue(new Mask());
                queue.add(3, {});
                queue.add(4, {});
                firstAlign = Mask.prototype.alignToIndex.withArgs(3);
                secondAlign = Mask.prototype.alignToIndex.withArgs(4);
                queue.start();
                assertTrue(firstAlign.calledBefore(secondAlign));
            }
        );
    };

    this.AlignmentQueueTest.prototype.testSecondQueuedAlignmentDoesntExecuteBeforeOnCompleteOfFirst = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, firstAlign, secondAlign;
                this.sandbox.stub(Mask.prototype);
                queue = new AlignmentQueue(new Mask());
                queue.add(3, {});
                queue.add(4, {});
                firstAlign = Mask.prototype.alignToIndex.withArgs(3);
                secondAlign = Mask.prototype.alignToIndex.withArgs(4);
                queue.start();
                assertTrue(firstAlign.calledOnce);
                assertEquals('alignToIndex called once', 1, Mask.prototype.alignToIndex.callCount);
                assertFalse(secondAlign.calledOnce);
            }
        );
    };

    this.AlignmentQueueTest.prototype.testSuppliedOnCompletesFiredInOrder = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, firstComplete, secondComplete;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.yieldsTo('onComplete');
                firstComplete = this.sandbox.stub();
                secondComplete = this.sandbox.stub();
                queue = new AlignmentQueue(new Mask());
                queue.add(3, {onComplete: firstComplete});
                queue.add(4, {onComplete: secondComplete});
                queue.start();
                assertTrue('First supplied onComplete called', firstComplete.calledOnce);
                assertTrue('Second supplied onComplete called', secondComplete.calledOnce);
                assertTrue('First onComplete called before second', firstComplete.calledBefore(secondComplete));
            }
        );
    };

    this.AlignmentQueueTest.prototype.testOptionPropertiesPassedThroughToMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                //onComplete tested elsewhere as sinon matcher struggles with it
                var fakeOptions = {
                    to: {},
                    from: {},
                    el: {},
                    fps: 25,
                    duration: 100,
                    easing: 'linear',
                    skipAnim: true
                };

                var queue, alignStub;
                spyOn(Mask.prototype, 'init');
                spyOn(Mask.prototype, 'alignToIndex').and.returnValue('onComplete');
                alignStub = Mask.prototype.alignToIndex;
                queue = new AlignmentQueue(new Mask());
                queue.add(3, fakeOptions);
                queue.start();
                expect(alignStub).toHaveBeenCalledWith(3, jasmine.objectContaining(fakeOptions));
            }
        );
    };

    this.AlignmentQueueTest.prototype.testCompleteStopsRunningAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue;
                this.sandbox.stub(Mask.prototype);
                queue = new AlignmentQueue(new Mask());
                queue.add(3, {foo: 'bar'});
                queue.add(4, {bar: 'foo'});
                queue.start();
                queue.complete();
                assertTrue('Running animation halted', Mask.prototype.stopAnimation.calledOnce);
            }
        );
    };

    this.AlignmentQueueTest.prototype.testCompleteSetsSkipAnimToTrueOnRemainingAlignments = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, lastComplete, alignStub;
                this.sandbox.stub(Mask.prototype, 'init');
                alignStub = this.sandbox.stub(Mask.prototype, 'alignToIndex', function (index, options) {
                    lastComplete = options.onComplete;
                });
                this.sandbox.stub(Mask.prototype, 'stopAnimation', function () {
                    lastComplete();
                });

                queue = new AlignmentQueue(new Mask());
                queue.add(3, {skipAnim: false});
                queue.add(4, {skipAnim: false});
                queue.start();
                queue.complete();

                assertEquals('first call has original skipAnim', false, alignStub.firstCall.args[1].skipAnim);
                assertEquals('second call has overridden skipAnim', true, alignStub.secondCall.args[1].skipAnim);
            }
        );
    };

    this.AlignmentQueueTest.prototype.testSkippingResetAfterQueueFinished = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, lastComplete, alignStub;
                this.sandbox.stub(Mask.prototype, 'init');
                lastComplete = null;
                // to fake one non-instant align (to be stopped) followed by some instant aligns
                alignStub = this.sandbox.stub(Mask.prototype, 'alignToIndex', function (index, options) {
                    if (lastComplete === null) {
                        lastComplete = options.onComplete;
                    } else {
                        options.onComplete();
                    }
                });
                this.sandbox.stub(Mask.prototype, 'stopAnimation', function () {
                    lastComplete();
                });

                queue = new AlignmentQueue(new Mask());
                queue.add(3, {skipAnim: false});
                queue.add(4, {skipAnim: false});
                queue.start();
                queue.complete();
                queue.add(5, {skipAnim: false});
                queue.start();
                assertEquals('first call has original skipAnim', false, alignStub.firstCall.args[1].skipAnim);
                assertEquals('second call has overridden skipAnim', true, alignStub.secondCall.args[1].skipAnim);
                assertEquals('third call has original skipAnim', false, alignStub.thirdCall.args[1].skipAnim);
            }
        );
    };

    this.AlignmentQueueTest.prototype.testCompleteOnEmptyQueueDoesNotSetSkip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue, alignStub;
                this.sandbox.stub(Mask.prototype);

                alignStub = Mask.prototype.alignToIndex.yieldsTo('onComplete');

                queue = new AlignmentQueue(new Mask());
                queue.complete();
                queue.add(3, {skipAnim: false});
                queue.start();

                assertEquals('first call has original skipAnim', false, alignStub.firstCall.args[1].skipAnim);

            }
        );
    };

    this.AlignmentQueueTest.prototype.testStartOnInProgressQueueDoesNotCauseDuplicateCall = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/aligners/alignmentqueue'
            ],
            function (application, Mask, AlignmentQueue) {
                var queue;
                this.sandbox.stub(Mask.prototype);

                queue = new AlignmentQueue(new Mask());
                queue.add(3, {skipAnim: false});
                queue.start();
                queue.start();

                assertEquals('alignToIndex only called once', 1, Mask.prototype.alignToIndex.callCount);

            }
        );
    };
}());
