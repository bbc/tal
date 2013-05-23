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

(function() {
    /* jshint newcap: false */
    
    this.SkipAnimTransitionDefinitionTest = AsyncTestCase("SkipAnimTransitionDefinition");
    
    function loadSATD(queue, fn) {
        queuedRequire(queue,
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
               
                assertEquals("definition has correct properties", [], skipTrans.getProperties());
            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testSkipAnimTransitionDefinitionGetsPropertiesFromTD = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top");
                trans.setProperty("left");
                trans.setProperty("opacity");
                trans.setProperty("whatever");
                
                skipTrans = new SkipAnimTransitionDefinition(trans);
               
                assertEquals("definition has correct properties", ["top", "left", "opacity", "whatever"], skipTrans.getProperties());
            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionReturnsZeroDuration = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top");
                
                skipTrans = new SkipAnimTransitionDefinition(trans);
               
                assertEquals("definition has correct duration", 0, skipTrans.getPropertyDuration("top"));
            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionReturnsAllDurationsZero = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top");
                
                skipTrans = new SkipAnimTransitionDefinition(trans);
                
                assertTrue("all durations should be zero", skipTrans.areAllDurationsZero());
            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testDefaultSkipAnimTransitionDefinitionUnaffectedBySettingDuration = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top");
                trans.setPropertyDuration("top", 400);
                
                assertEquals(trans.getPropertyDuration("top"), 400);
                skipTrans = new SkipAnimTransitionDefinition(trans);
                
                assertEquals("definition has correct duration", 0, skipTrans.getPropertyDuration("top"));
                assertTrue("all durations should be zero", skipTrans.areAllDurationsZero());
                
                skipTrans.setPropertyDuration("top", 400);
                
                assertEquals("definition has correct duration", 0, skipTrans.getPropertyDuration("top"));
                assertTrue("all durations should be zero", skipTrans.areAllDurationsZero());
            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testOtherPropertiesCopied = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top", 
                {
                    duration: 400,
                    delay: 30,
                    timingFn: 'linear'
                });
                
                skipTrans = new SkipAnimTransitionDefinition(trans);
                
                assertEquals("definition has correct duration", 0, skipTrans.getPropertyDuration("top"));
                assertEquals("definition has correct delay", 30, skipTrans.getPropertyDelay("top"));
                assertEquals("definition has correct timing fn", "linear", skipTrans.getPropertyTimingFn("top"));

            }
        );
    };
    
    this.SkipAnimTransitionDefinitionTest.prototype.testPropertiesCopiedByValue = function(queue) { 
        loadSATD(
            queue, 
            function(SkipAnimTransitionDefinition, TransitionDefinition) {
                var trans, skipTrans;

                trans = new TransitionDefinition();
                trans.setProperty("top", 
                {
                    duration: 400,
                    delay: 30,
                    timingFn: 'linear'
                });
                
                skipTrans = new SkipAnimTransitionDefinition(trans);

                skipTrans.setPropertyDuration(600);
                skipTrans.setPropertyDelay(200);
                skipTrans.setPropertyTimingFn("ease-in-out");
                
                assertEquals("definition has correct duration", 400, trans.getPropertyDuration("top"));
                assertEquals("definition has correct delay", 30, trans.getPropertyDelay("top"));
                assertEquals("definition has correct timing fn", "linear", trans.getPropertyTimingFn("top"));                
            }
        );
    };
    
}());