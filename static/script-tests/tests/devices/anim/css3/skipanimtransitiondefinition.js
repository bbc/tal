/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {


    this.SkipAnimTransitionDefinitionTest = AsyncTestCase('SkipAnimTransitionDefinition');

    function loadSATD(queue, fn) {
        queuedRequire(
            queue,
            [
                'antie/devices/anim/css3/skipanimtransitiondefinition',
                'antie/devices/anim/css3/transitiondefinition'
            ],
            fn
        );
    }

    this.SkipAnimTransitionDefinitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.SkipAnimTransitionDefinitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromEmptyTDIsEmpty = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertEquals('definition has correct properties', [], skipTrans.getProperties());
            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testSkipAnimTransitionDefinitionGetsPropertiesFromTD = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty('top');
                trans.setProperty('left');
                trans.setProperty('opacity');
                trans.setProperty('whatever');

                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertEquals('definition has correct properties', ['top', 'left', 'opacity', 'whatever'], skipTrans.getProperties());
            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionReturnsZeroDuration = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty('top');

                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertEquals('definition has correct duration', 0, skipTrans.getPropertyDuration('top'));
            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionReturnsAllDurationsZero = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty('top');

                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertTrue('all durations should be zero', skipTrans.areAllDurationsZero());
            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionUnaffectedBySettingDuration = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty('top');
                trans.setPropertyDuration('top', 400);

                assertEquals(trans.getPropertyDuration('top'), 400);
                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertEquals('definition has correct duration', 0, skipTrans.getPropertyDuration('top'));
                assertTrue('all durations should be zero', skipTrans.areAllDurationsZero());

                skipTrans.setPropertyDuration('top', 400);

                assertEquals('definition has correct duration', 0, skipTrans.getPropertyDuration('top'));
                assertTrue('all durations should be zero', skipTrans.areAllDurationsZero());
            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testOtherPropertiesCopied = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty(
                    'top',
                    {
                        duration: 400,
                        delay: 30,
                        timingFn: 'linear'
                    });

                skipTrans = new SkipAnimTransitionDefinition(trans);

                assertEquals('definition has correct duration', 0, skipTrans.getPropertyDuration('top'));
                assertEquals('definition has correct delay', 30, skipTrans.getPropertyDelay('top'));
                assertEquals('definition has correct timing fn', 'linear', skipTrans.getPropertyTimingFn('top'));

            }
        );
    };

    this.SkipAnimTransitionDefinitionTest.prototype.testPropertiesCopiedByValue = function(queue) {
        loadSATD(
            queue,
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty(
                    'top',
                    {
                        duration: 400,
                        delay: 30,
                        timingFn: 'linear'
                    });

                skipTrans = new SkipAnimTransitionDefinition(trans);

                skipTrans.setPropertyDuration(600);
                skipTrans.setPropertyDelay(200);
                skipTrans.setPropertyTimingFn('ease-in-out');

                assertEquals('definition has correct duration', 400, trans.getPropertyDuration('top'));
                assertEquals('definition has correct delay', 30, trans.getPropertyDelay('top'));
                assertEquals('definition has correct timing fn', 'linear', trans.getPropertyTimingFn('top'));
            }
        );
    };

}());
