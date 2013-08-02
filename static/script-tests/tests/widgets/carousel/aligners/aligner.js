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
    this.AlignerTest = AsyncTestCase("Aligner");

    this.AlignerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AlignerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.AlignerTest.prototype.getNavigator = function (Navigator) {
        var navigator = new Navigator();
        this.sandbox.stub(navigator);
        return navigator;
    };

    this.AlignerTest.prototype.getNavigatorStartWithCurrentIndexActive = function (Navigator) {
        var navigator = this.getNavigator(Navigator);
        navigator.currentIndex.returns(0);
        navigator.nextIndex.returns(1);
        navigator.previousIndex.returns(1);
        navigator.indexCount.returns(2);
        return navigator;
    };

    this.AlignerTest.prototype.getNavigatorAtEndWithCurrentIndexActive = function (Navigator) {
        var navigator = this.getNavigator(Navigator);
        navigator.currentIndex.returns(1);
        navigator.nextIndex.returns(0);
        navigator.previousIndex.returns(0);
        navigator.indexCount.returns(2);
        return navigator;
    };

    this.AlignerTest.prototype.getNavigatorAtEndWithCurrentIndexInactive = function (Navigator) {
        var navigator, first;
        first = true;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.restore();
        this.sandbox.stub(navigator, 'currentIndex', function () {
            if (first) {
                first = false;
                return 1;
            } else {
                return 0;
            }
        });
        navigator.nextIndex.returns(0);
        navigator.indexCount.returns(2);
        return navigator;
    };

    this.AlignerTest.prototype.getThreeItemNavigatorAtEndWithCurrentIndexInactiveAndLastItemDisabled = function (Navigator) {
        var navigator, first;
        first = true;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.restore();
        this.sandbox.stub(navigator, 'currentIndex', function () {
            if (first) {
                first = false;
                return 1;
            } else {
                return 0;
            }
        });
        navigator.nextIndex.returns(0);
        navigator.indexCount.returns(3);
        return navigator;
    };

    this.AlignerTest.prototype.getThreeItemNavigatorAtEndWithCurrentIndexActiveAndLastItemDisabled = function (Navigator) {
        var navigator;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.returns(1);
        navigator.nextIndex.returns(0);
        navigator.indexCount.returns(3);
        return navigator;
    };

    this.AlignerTest.prototype.getFourItemNavigatorAtStartWithCurrentIndexActiveAndFirstAndLastItemsDisabled = function (Navigator) {
        var navigator;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.returns(1);
        navigator.previousIndex.returns(2);
        navigator.indexCount.returns(4);
        return navigator;
    };

    this.AlignerTest.prototype.getThreeItemNavigatorAtStartWithCurrentIndexInactiveAndFirstItemDisabled = function (Navigator) {
        var navigator, first;
        first = true;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.restore();
        this.sandbox.stub(navigator, 'currentIndex', function () {
            if (first) {
                first = false;
                return 1;
            } else {
                return 2;
            }
        });
        navigator.previousIndex.returns(2);
        navigator.indexCount.returns(3);
        return navigator;
    };

    this.AlignerTest.prototype.getNavigatorAtStartWithCurrentIndexInactive = function (Navigator) {
        var navigator, first;
        first = true;
        navigator = this.getNavigator(Navigator);
        navigator.currentIndex.restore();
        this.sandbox.stub(navigator, 'currentIndex', function () {
            if (first) {
                first = false;
                return 0;
            } else {
                return 1;
            }
        });
        navigator.nextIndex.returns(1);
        navigator.previousIndex.returns(1);
        navigator.indexCount.returns(2);
        return navigator;
    };

    this.AlignerTest.prototype.testAlignToFiresBeforeAlignEventOnMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/beforealignevent",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, BeforeAlignEvent, Navigator, Mask) {
                var aligner, mask, firedEvent;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(BeforeAlignEvent.prototype);

                mask = new Mask();
                
                aligner = new Aligner(mask);
                aligner.alignToIndex(3);

                assertTrue("event fired on carousel mask", mask.bubbleEvent.called);
                firedEvent = mask.bubbleEvent.firstCall.args[0];
                assertTrue("Fired event is a beforealignevent", firedEvent instanceof BeforeAlignEvent);
                assertTrue("Event created with mask parent target and correct alignedIndex",
                    firedEvent.init.calledWith(mask, 3));
            }
        );
    };

    this.AlignerTest.prototype.testBeforeAlignFiredOnMaskWhenMovedForwardBetweenZeroAndOne = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/beforealignevent",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, BeforeAlignEvent, Navigator, Mask) {
                var aligner, mask, firedEvent, navigator;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(BeforeAlignEvent.prototype);

                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);

                mask = new Mask();
                
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);

                assertTrue("event fired on carousel mask", mask.bubbleEvent.called);
                firedEvent = mask.bubbleEvent.firstCall.args[0];
                assertTrue("Fired event is a beforealignevent", firedEvent instanceof BeforeAlignEvent);
                assertTrue("Event created with mask parent target and correct to & from values",
                    firedEvent.init.calledWith(mask, 1));
            }
        );
    };

    this.AlignerTest.prototype.testBeforeAlignFiredOnMaskWhenMovedBackwardBetweenOneAndZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/beforealignevent",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, BeforeAlignEvent, Navigator, Mask) {
                var aligner, mask, firedEvent, navigator;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(BeforeAlignEvent.prototype);

                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);

                mask = new Mask();
                
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);

                assertTrue("event fired on carousel mask", mask.bubbleEvent.called);
                firedEvent = mask.bubbleEvent.firstCall.args[0];
                assertTrue("Fired event is a beforealignevent", firedEvent instanceof BeforeAlignEvent);
                assertTrue("Event created with mask parent target and correct to & from values",
                    firedEvent.init.calledWith(mask, 0));
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignFiredOnMaskAfterAlignToIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/afteralignevent",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, AfterAlignEvent, Mask) {
                var aligner, mask, firedEvent;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AfterAlignEvent.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });

                aligner = new Aligner(mask);
                aligner.alignToIndex(3);

                assertTrue("2 events fired on carousel mask", mask.bubbleEvent.calledTwice);
                firedEvent = mask.bubbleEvent.secondCall.args[0];
                assertTrue("Second fired event is an afteralignevent", firedEvent instanceof AfterAlignEvent);
                assertTrue("Event created with mask parent target and correct to & from values",
                    firedEvent.init.calledWith(mask, 3));
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignFiredOnMaskWhenMovedForwardBetweenZeroAndOne = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/afteralignevent",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AfterAlignEvent, Mask, Navigator) {
                var aligner, mask, firedEvent, navigator;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AfterAlignEvent.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);

                aligner = new Aligner(mask);
                aligner.alignNext(navigator);

                assertTrue("2 events fired on carousel mask", mask.bubbleEvent.calledTwice);
                firedEvent = mask.bubbleEvent.secondCall.args[0];
                assertTrue("Second fired event is an afteralignevent", firedEvent instanceof AfterAlignEvent);
                assertTrue("Event created with mask parent target and correct to & from values",
                    firedEvent.init.calledWith(mask, 1));
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignFiredOnMaskWhenMovedBackwardBetweenOneAndZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/afteralignevent",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AfterAlignEvent, Mask, Navigator) {
                var aligner, mask, firedEvent, navigator;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AfterAlignEvent.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);

                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);

                assertTrue("2 events fired on carousel mask", mask.bubbleEvent.calledTwice);
                firedEvent = mask.bubbleEvent.secondCall.args[0];
                assertTrue("Second fired event is an afteralignevent", firedEvent instanceof AfterAlignEvent);
                assertTrue("Event created with mask parent target and correct to & from values",
                    firedEvent.init.calledWith(mask, 0));
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignNotFiredBeforeAlignToIndexCallsBack = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/events/afteralignevent",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AfterAlignEvent, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AfterAlignEvent.prototype);
                mask = new Mask();
                
                aligner = new Aligner(mask);
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner.alignNext(navigator);

                assertFalse("2 events fired on carousel mask", mask.bubbleEvent.calledTwice);
            }
        );
    };

    this.AlignerTest.prototype.testMaskAskedToAlignOnAlignToIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Mask) {
                var aligner, mask;
                this.sandbox.stub(Mask.prototype);

                mask = new Mask();
                aligner = new Aligner(mask);

                aligner.alignToIndex(3);

                assertTrue("Align to index called correctly on mask", mask.alignToIndex.calledWith(3));
            }
        );
    };

    this.AlignerTest.prototype.testOptionsPassedThroughToMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Mask) {
                var aligner, mask;
                this.sandbox.stub(Mask.prototype);

                mask = new Mask();
                aligner = new Aligner(mask);

                aligner.alignToIndex(3, {
                    skipAnim: "test"
                });

                assertTrue("Align to index called on mask", mask.alignToIndex.called);
                assertEquals("skipAnim passed through", "test", mask.alignToIndex.firstCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testOptionsOnCompleteFiredAfterAlignToIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Mask) {
                var aligner, mask, completeStub;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                mask.alignToIndex.restore();
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && options.onComplete) {
                        options.onComplete();
                    }
                });

                aligner = new Aligner(mask);
                completeStub = this.sandbox.stub();
                aligner.alignToIndex(3, {
                    onComplete: completeStub
                });

                assertTrue("Align to index called on mask", mask.alignToIndex.called);
                assertTrue("Options callback fired", completeStub.calledOnce);
            }
        );
    };

    this.AlignerTest.prototype.testMaskAskedToAlignToTargetWidgetOnMoveForward = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);

                assertTrue("alignToIndex called on mask", mask.alignToIndex.calledWith(1));
            }
        );
    };

    this.AlignerTest.prototype.testMaskAskedToAlignToTargetWidgetOnMoveBackward = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);

                assertTrue("alignToIndex called on mask", mask.alignToIndex.calledWith(0));
            }
        );
    };

    this.AlignerTest.prototype.testMoveForwardWhenNextIndexSmallerThenCurrentTriggersWrapAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                aligner._wrapForward = this.sandbox.stub();
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);
                aligner.alignNext(navigator);

                assertTrue("wrapForward called", aligner._wrapForward.calledWith(1, 0));
            }
        );
    };

    this.AlignerTest.prototype.testMovebackwardWhenNextIndexLargerThenCurrentTriggersWrapAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                aligner._wrapBackward = this.sandbox.stub();
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner.alignPrevious(navigator);

                assertTrue("wrapBackward called", aligner._wrapBackward.calledWith(0, 1));
            }
        );
    };

    this.AlignerTest.prototype.testMoveForwardToNullDoesNothing = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigator(Navigator);
                navigator.currentIndex.returns(1);
                navigator.nextIndex.returns(null);
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);

                assertFalse("Align called on mask", mask.alignToIndex.called);
            }
        );
    };

    this.AlignerTest.prototype.testMoveBackwardToNullDoesNothing = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigator(Navigator);
                navigator.currentIndex.returns(1);
                navigator.previousIndex.returns(null);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);

                assertFalse("Align called on mask", mask.alignToIndex.called);
            }
        );
    };

    this.AlignerTest.prototype.testMoveForwardWhenNextIndexGreaterThenCurrentDoesNotTriggerWrapAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner._wrapForward = this.sandbox.stub();
                aligner.alignNext(navigator);

                assertFalse("wrapForward called", aligner._wrapForward.called);
            }
        );
    };

    this.AlignerTest.prototype.testMoveBackwardWhenNextIndexLessThenCurrentDoesNotTriggerWrapAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);
                aligner._wrapBackward = this.sandbox.stub();
                aligner.alignPrevious(navigator);

                assertFalse("wrapBackward called", aligner._wrapBackward.called);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromInactiveItemWrapsCarouselBeforeAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigatorAtEndWithCurrentIndexInactive(Navigator);
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index -1 for last clone", -1, wrapAlignCall.args[0]);
                assertTrue("Align to index -1 skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromInactiveIndexPastDisabledItemAlignsToCorrectClone = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getThreeItemNavigatorAtEndWithCurrentIndexInactiveAndLastItemDisabled(Navigator);
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index -2 for correct clone", -2, wrapAlignCall.args[0]);
                assertTrue("Align to index -2 skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromActiveIndexPastDisabledItemAlignsToCorrectClone = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getThreeItemNavigatorAtEndWithCurrentIndexActiveAndLastItemDisabled(Navigator);
                aligner = new Aligner(mask);
                aligner.alignNext(navigator);
                alignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index 3 for correct clone", 3, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardPastDisabledItemAlignsToCorrectClone = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getThreeItemNavigatorAtStartWithCurrentIndexInactiveAndFirstItemDisabled(Navigator);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index length + 1 for correct clone", 4, wrapAlignCall.args[0]);
                assertTrue("Align to clone anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardFromActiveIndexPastDisabledItemAlignsToCorrectClone = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getFourItemNavigatorAtStartWithCurrentIndexActiveAndFirstAndLastItemsDisabled(Navigator);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);
                alignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index -2 for correct clone", -2, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardFromInactiveItemWrapsCarouselBeforeAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                navigator = this.getNavigatorAtStartWithCurrentIndexInactive(Navigator);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index length+1 for last clone", 2, wrapAlignCall.args[0]);
                assertTrue("Align to index length+1 skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromInactiveItemAlignsToNextItemAfterWrap = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                navigator = this.getNavigatorAtEndWithCurrentIndexInactive(Navigator);
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                aligner = new Aligner(mask);

                aligner.alignNext(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                alignCall = mask.alignToIndex.secondCall;
                assertEquals("onComplete callback passed to wrap align", 'function', typeof wrapAlignCall.args[1].onComplete);
                assertTrue("Align to index called twice", mask.alignToIndex.calledTwice);
                assertEquals("Align to destination index (0)", 0, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardFromInactiveItemAlignsToPreviousItemAfterWrap = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                navigator = this.getNavigatorAtStartWithCurrentIndexInactive(Navigator);
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                aligner = new Aligner(mask);

                aligner.alignPrevious(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                alignCall = mask.alignToIndex.secondCall;
                assertEquals("onComplete callback passed to wrap align", 'function', typeof wrapAlignCall.args[1].onComplete);
                assertTrue("Align to index called twice", mask.alignToIndex.calledTwice);
                assertEquals("Align to destination index (1)", 1, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromActiveItemAlignsToNextItemBeforeWrap = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, alignCall, navigator;

                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);
                aligner.alignNext(navigator);
                alignCall = mask.alignToIndex.firstCall;
                assertEquals("Align to destination index (2)", 2, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardFromActiveItemAlignsToPreviousItemBeforeWrap = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, alignCall, navigator;

                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner.alignPrevious(navigator);
                alignCall = mask.alignToIndex.firstCall;
                assertEquals("Align to destination index (-1)", -1, alignCall.args[0]);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardFromActiveItemWrapsCarouselAfterAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                aligner = new Aligner(mask);
                navigator = this.getNavigatorAtEndWithCurrentIndexActive(Navigator);
                aligner.alignNext(navigator);

                alignCall = mask.alignToIndex.firstCall;
                wrapAlignCall = mask.alignToIndex.secondCall;
                assertEquals("onComplete callback passed to align", 'function', typeof alignCall.args[1].onComplete);
                assertTrue("Align to index called twice", mask.alignToIndex.calledTwice);
                assertEquals("Wrap aligns to destination index (0)", 0, wrapAlignCall.args[0]);
                assertTrue("Wrap align skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardFromActiveItemWrapsCarouselAfterAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, wrapAlignCall, alignCall, navigator;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.restore();
                mask = new Mask();
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                aligner = new Aligner(mask);
                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
                aligner.alignPrevious(navigator);

                alignCall = mask.alignToIndex.firstCall;
                wrapAlignCall = mask.alignToIndex.secondCall;
                assertEquals("onComplete callback passed to align", 'function', typeof alignCall.args[1].onComplete);
                assertTrue("Align to index called twice", mask.alignToIndex.calledTwice);
                assertEquals("Wrap aligns to destination index (1)", 1, wrapAlignCall.args[0]);
                assertTrue("Wrap align skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

//    this.AlignerTest.prototype.testAlignToFiresBeforeAlign = function (queue) {
//        queuedApplicationInit(queue,
//            'lib/mockapplication',
//            [
//                "antie/widgets/carousel/aligners/aligner",
//                "antie/widgets/carousel/mask",
//                "antie/widgets/carousel/navigators/navigator",
//                "antie/events/beforealignevent"
//            ],
//            function (application, Aligner, Mask, Navigator, BeforeAlignEvent) {
//                var aligner, mask, navigator, event;
//                this.sandbox.stub(Mask.prototype);
//                mask = new Mask();
//
//                aligner = new Aligner(mask);
//                navigator = this.getNavigatorStartWithCurrentIndexActive(Navigator);
//                aligner.alignTo(3, navigator);
//                assertTrue("Event bubbled on mask", mask.bubbleEvent.called);
//                event = mask.bubbleEvent.firstCall.args[0];
//                assertTrue("Event bubbled on mask of type BeforeAlignEvent", event instanceof BeforeAlignEvent);
//            }
//        );
//    };
}());