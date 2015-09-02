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

    var getNavigator = function (Navigator, sandbox) {
        var navigator = new Navigator();
        sandbox.stub(navigator);
        return navigator;
    };

    var getNavigatorStartWithCurrentIndexActive = function (Navigator, sandbox) {
        var navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(0);
        navigator.nextIndex.returns(1);
        navigator.indexAfter.returns(1);
        navigator.previousIndex.returns(1);
        navigator.indexBefore.returns(1);
        navigator.indexCount.returns(2);
        return navigator;
    };

    var getNavigatorAtEndWithCurrentIndexActive = function (Navigator, sandbox) {
        var navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(1);
        navigator.nextIndex.returns(0);
        navigator.indexAfter.returns(0);
        navigator.previousIndex.returns(0);
        navigator.indexBefore.returns(0);
        navigator.indexCount.returns(2);
        return navigator;
    };

    var getNavigatorAtEndWithCurrentIndexInactive = function (Navigator, sandbox) {
        var navigator, first;
        first = true;
        navigator = getNavigator(Navigator, sandbox);

        navigator.currentIndex.returns(0);
        navigator.nextIndex.returns(0);
        navigator.indexAfter.returns(0);
        navigator.indexCount.returns(2);
        return navigator;
    };

    var getThreeItemNavigatorAtEndWithCurrentIndexInactiveAndLastItemDisabled = function (Navigator, sandbox) {
        var navigator, first;
        first = true;
        navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(0);
        navigator.nextIndex.returns(0);
        navigator.indexAfter.returns(0);
        navigator.indexCount.returns(3);
        return navigator;
    };

    var getThreeItemNavigatorAtEndWithCurrentIndexActiveAndLastItemDisabled = function (Navigator, sandbox) {
        var navigator;
        navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(1);
        navigator.nextIndex.returns(0);
        navigator.indexAfter.returns(0);
        navigator.indexCount.returns(3);
        return navigator;
    };

    var getFourItemNavigatorAtStartWithCurrentIndexActiveAndFirstAndLastItemsDisabled = function (Navigator, sandbox) {
        var navigator;
        navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(1);
        navigator.previousIndex.returns(2);
        navigator.indexBefore.returns(2);
        navigator.indexCount.returns(4);
        return navigator;
    };

    var getThreeItemNavigatorAtStartWithCurrentIndexInactiveAndFirstItemDisabled = function (Navigator, sandbox) {
        var navigator, first;
        first = true;
        navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(2);
        navigator.previousIndex.returns(2);
        navigator.indexBefore.returns(2);
        navigator.indexCount.returns(3);
        return navigator;
    };

    var getNavigatorAtStartWithCurrentIndexInactive = function (Navigator, sandbox) {
        var navigator, first;
        first = true;
        navigator = getNavigator(Navigator, sandbox);
        navigator.currentIndex.returns(1);
        navigator.nextIndex.returns(1);
        navigator.indexAfter.returns(1);
        navigator.previousIndex.returns(1);
        navigator.indexBefore.returns(1);
        navigator.indexCount.returns(2);
        return navigator;
    };

    this.AlignerTest.prototype.testAlignToCallsBeforeAlignToOnMask = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Navigator, Mask) {
                var aligner, mask, alignmentIndex;
                this.sandbox.stub(Mask.prototype);

                mask = new Mask();

                aligner = new Aligner(mask);
                alignmentIndex = 3;
                aligner.alignToIndex(alignmentIndex);

                assertTrue("beforeAlignTo called on mask", mask.beforeAlignTo.called);
                sinon.assert.calledWith(mask.beforeAlignTo, sinon.match.any, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testBeforeAlignToCalledOnMaskWhenMovedForwardBetweenZeroAndOne = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Navigator, Mask) {
                var aligner, mask, navigator, initialIndex, alignmentIndex;
                this.sandbox.stub(Mask.prototype);

                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
                initialIndex = 0;
                alignmentIndex = 1;
                mask = new Mask();
                
                aligner = new Aligner(mask);
                aligner.alignToIndex(initialIndex);
                aligner.alignNext(navigator);

                assertTrue("beforeAlignTo called on mask", mask.beforeAlignTo.called);
                sinon.assert.calledWith(mask.beforeAlignTo, initialIndex, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testBeforeAlignFiredOnMaskWhenMovedBackwardBetweenOneAndZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/navigators/navigator",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner,  Navigator, Mask) {
                var aligner, mask, navigator, alignmentIndex, initialIndex;
                this.sandbox.stub(Mask.prototype);

                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                initialIndex = 1;
                alignmentIndex = 0;
                mask = new Mask();
                
                aligner = new Aligner(mask);
                aligner.alignToIndex(1);
                mask.beforeAlignTo.reset();

                aligner.alignPrevious(navigator);

                assertTrue("beforeAlignTo called on mask", mask.beforeAlignTo.called);
                sinon.assert.calledWith(mask.beforeAlignTo, initialIndex, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignToCalledOnMaskAfterAlignToIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask"
            ],
            function (application, Aligner, Mask) {
                var aligner, mask, alignmentIndex;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.yieldsTo('onComplete');

                mask = new Mask();
                alignmentIndex = 3;
                aligner = new Aligner(mask);
                aligner.alignToIndex(alignmentIndex);

                assertTrue("afterAlignTo called on mask", mask.afterAlignTo.called);
                sinon.assert.calledWith(mask.afterAlignTo, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignToCalledOnMaskWhenMovedForwardBetweenZeroAndOne = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, navigator, alignmentIndex;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.yieldsTo('onComplete');
                alignmentIndex = 1;
                mask = new Mask();

                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);

                aligner = new Aligner(mask);
                aligner.alignNext(navigator);

                assertTrue("afterAlignTo called on mask", mask.afterAlignTo.called);
                sinon.assert.calledWith(mask.afterAlignTo, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignToCalledOnMaskWhenMovedBackwardBetweenOneAndZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator, alignmentIndex) {
                var aligner, mask, navigator;
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.alignToIndex.yieldsTo('onComplete');

                mask = new Mask();
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);

                alignmentIndex = 0;
                aligner = new Aligner(mask);
                aligner.alignToIndex(1);
                mask.afterAlignTo.reset();
                aligner.alignPrevious(navigator);

                assertTrue("afterAlignTo called on mask", mask.afterAlignTo.called);
                sinon.assert.calledWith(mask.afterAlignTo, alignmentIndex);
            }
        );
    };

    this.AlignerTest.prototype.testAfterAlignToNotFiredBeforeAlignToIndexCallsBack = function (queue) {
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
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
                aligner.alignNext(navigator);

                assertFalse("afterAlignTo called on mask", mask.afterAlignTo.called);
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
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
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
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                aligner._wrap = this.sandbox.stub();
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                aligner._lastAlignIndex = 1;
                aligner.alignNext(navigator);

                assertTrue("wrapForward called", aligner._wrap.calledWith(1, 0, navigator, Aligner.directions.FORWARD));
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
                aligner.alignToIndex(0);
                aligner._wrap = this.sandbox.stub();
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
                aligner.alignPrevious(navigator);

                assertTrue("wrapBackward called", aligner._wrap.calledWith(0, 1, navigator, Aligner.directions.BACKWARD));
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
                navigator = getNavigator(Navigator, this.sandbox);
                navigator.currentIndex.returns(1);
                navigator.indexAfter.returns(null);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigator(Navigator, this.sandbox);
                navigator.currentIndex.returns(1);
                navigator.indexBefore.returns(null);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
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
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                aligner._wrapBackward = this.sandbox.stub();
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigatorAtEndWithCurrentIndexInactive(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
                aligner.alignNext(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertEquals("Align to index -1 for last clone", -1, wrapAlignCall.args[0]);
                assertTrue("Align to index -1 skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapForwardPassesOptionsToAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, animatedCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                mask.alignToIndex.yieldsTo('onComplete');
                navigator = getNavigatorAtEndWithCurrentIndexInactive(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
                aligner.alignNext(navigator, {skipAnim: true});
                animatedCall = mask.alignToIndex.secondCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("SkipAnim passed into align", true, animatedCall.args[1].skipAnim);

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
                navigator = getThreeItemNavigatorAtEndWithCurrentIndexInactiveAndLastItemDisabled(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getThreeItemNavigatorAtEndWithCurrentIndexActiveAndLastItemDisabled(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getThreeItemNavigatorAtStartWithCurrentIndexInactiveAndFirstItemDisabled(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getFourItemNavigatorAtStartWithCurrentIndexActiveAndFirstAndLastItemsDisabled(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigatorAtStartWithCurrentIndexInactive(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator);
                wrapAlignCall = mask.alignToIndex.firstCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("Align to index length+1 for last clone", 2, wrapAlignCall.args[0]);
                assertTrue("Align to index length+1 skips anim", wrapAlignCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testWrapBackwardPassesOptionsToAnimation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask, animatedCall, navigator;
                this.sandbox.stub(Mask.prototype);
                mask = new Mask();
                mask.alignToIndex.yieldsTo('onComplete');
                navigator = getNavigatorAtStartWithCurrentIndexInactive(Navigator, this.sandbox);
                aligner = new Aligner(mask);
                aligner.alignPrevious(navigator, {skipAnim: true});
                animatedCall = mask.alignToIndex.secondCall;
                assertTrue("Align to index called", mask.alignToIndex.called);
                assertEquals("SkipAnim passed into align", true, animatedCall.args[1].skipAnim);

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
                navigator = getNavigatorAtEndWithCurrentIndexInactive(Navigator, this.sandbox);
                this.sandbox.stub(mask, 'alignToIndex', function (index, options) {
                    if (options && typeof options.onComplete === 'function') { options.onComplete(); }
                });
                aligner = new Aligner(mask);
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigatorAtStartWithCurrentIndexInactive(Navigator, this.sandbox);
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
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                aligner._lastAlignIndex = 1;
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
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
                aligner._lastAlignIndex = 0;
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
                navigator = getNavigatorAtEndWithCurrentIndexActive(Navigator, this.sandbox);
                aligner._lastAlignIndex = 1;
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
                aligner._lastAlignIndex = 0;
                navigator = getNavigatorStartWithCurrentIndexActive(Navigator, this.sandbox);
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

    this.AlignerTest.prototype.testOptionsPassedToMaskFromAlignNext = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);

                mask = new Mask();
                aligner = new Aligner(mask);

                aligner.alignNext(new Navigator(), {
                    skipAnim: "test"
                });

                assertTrue("Align to index called on mask", mask.alignToIndex.called);
                assertEquals("skipAnim passed through", "test", mask.alignToIndex.firstCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testOptionsPassedToMaskFromAlignPrevious = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);

                mask = new Mask();
                aligner = new Aligner(mask);

                aligner.alignPrevious(new Navigator(), {
                    skipAnim: "test"
                });

                assertTrue("Align to index called on mask", mask.alignToIndex.called);
                assertEquals("skipAnim passed through", "test", mask.alignToIndex.firstCall.args[1].skipAnim);
            }
        );
    };

    this.AlignerTest.prototype.testCompleteCompletesAlignmentQueue = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/aligners/alignmentqueue",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AlignmentQueue, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AlignmentQueue.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);

                aligner.alignPrevious(new Navigator());
                assertFalse("Complete called on alignment queue before called on aligner",
                    AlignmentQueue.prototype.complete.called);

                aligner.complete();

                assertTrue("Complete called on alignment queue",
                    AlignmentQueue.prototype.complete.calledOnce);
            }
        );
    };

    this.AlignerTest.prototype.testAlignedIndexIsNullOnInit = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/aligners/alignmentqueue",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AlignmentQueue, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AlignmentQueue.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);

                assertNull(aligner.indexOfLastAlignRequest());
            }
        );
    };

    this.AlignerTest.prototype.testIndexOfLastAlignRequestIsChangedAfterAlignToIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/aligners/alignmentqueue",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AlignmentQueue, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AlignmentQueue.prototype);
                mask = new Mask();
                aligner = new Aligner(mask);
                aligner.alignToIndex(4);
                assertEquals(4, aligner.indexOfLastAlignRequest());
            }
        );
    };

    this.AlignerTest.prototype.testIndexOfLastAlignRequestIsChangedAfterAlignPrevious = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/aligners/alignmentqueue",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AlignmentQueue, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AlignmentQueue.prototype);
                Navigator.prototype.indexBefore.returns(3);
                mask = new Mask();
                aligner = new Aligner(mask);
                aligner.alignPrevious(new Navigator(), {});
                assertEquals(3, aligner.indexOfLastAlignRequest());
            }
        );
    };

    this.AlignerTest.prototype.testIndexOfLastAlignRequestIsChangedAfterAlignNext = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/aligners/aligner",
                "antie/widgets/carousel/aligners/alignmentqueue",
                "antie/widgets/carousel/mask",
                "antie/widgets/carousel/navigators/navigator"
            ],
            function (application, Aligner, AlignmentQueue, Mask, Navigator) {
                var aligner, mask;
                this.sandbox.stub(Navigator.prototype);
                this.sandbox.stub(Mask.prototype);
                this.sandbox.stub(AlignmentQueue.prototype);
                Navigator.prototype.indexAfter.returns(5);
                mask = new Mask();
                aligner = new Aligner(mask);
                aligner.alignNext(new Navigator(), {});
                assertEquals(5, aligner.indexOfLastAlignRequest());
            }
        );
    };

}());
