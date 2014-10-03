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
    function loadTD(queue, fn) {
        queuedRequire(queue,
            ['antie/devices/anim/css3/transitiondefinition'],
            fn
        );
    }
    
    this.TransitionDefinitionTest = AsyncTestCase("TransitionDefinition");

    this.TransitionDefinitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.TransitionDefinitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    this.TransitionDefinitionTest.prototype.testHasProperty = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                assertEquals('Test newly initialised definition returns false for hasProperty', false, tDef.hasProperty('newProperty'));
                tDef.setProperty('newProperty');
                assertEquals('Test definition returns true for hasProperty after property added', true, tDef.hasProperty('newProperty'));
            });
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyWithNoAttributes = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('newProperty');
                assertEquals(
                    'Test definition returns true for hasProperty after property added', 
                    true, 
                    tDef.hasProperty('newProperty')
                );
                assertEquals(
                    'Test definition returns default duration after property added with no attributes',
                    TransitionDefinition.defaults.duration,
                    tDef.getPropertyDuration('newProperty')
                );
                assertEquals(
                    'Test definition returns default delay after property added with no attributes',
                    TransitionDefinition.defaults.delay,
                    tDef.getPropertyDelay('newProperty')
                );
                assertEquals(
                    'Test definition returns default timing function after property added with no attributes',
                    TransitionDefinition.defaults.timingFn,
                    tDef.getPropertyTimingFn('newProperty')
                );
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyWithDuration = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('newProperty', { duration: 500 });
                assertEquals(
                    'Test definition returns true for hasProperty after property added', 
                    true, 
                    tDef.hasProperty('newProperty')
                );
                assertEquals(
                    'Test definition returns set duration after property added with duration attribute',
                    500,
                    tDef.getPropertyDuration('newProperty')
                );
                assertEquals(
                    'Test definition returns default delay after property added with duration attribute',
                    TransitionDefinition.defaults.delay,
                    tDef.getPropertyDelay('newProperty')
                );
                assertEquals(
                    'Test definition returns default timing function after property added with duration attribute',
                    TransitionDefinition.defaults.timingFn,
                    tDef.getPropertyTimingFn('newProperty')
                );
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyWithDelay = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('newProperty', { delay: 20 });
                assertEquals(
                    'Test definition returns true for hasProperty after property added', 
                    true, 
                    tDef.hasProperty('newProperty')
                );
                assertEquals(
                    'Test definition returns default duration after property added with delay attribute',
                    TransitionDefinition.defaults.duration,
                    tDef.getPropertyDuration('newProperty')
                );
                assertEquals(
                    'Test definition returns set delay after property added with delay attribute',
                    20,
                    tDef.getPropertyDelay('newProperty')
                );
                assertEquals(
                    'Test definition returns default timing function after property added with delay attribute',
                    TransitionDefinition.defaults.timingFn,
                    tDef.getPropertyTimingFn('newProperty')
                );
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyWithTimingFn = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('newProperty', { timingFn: 'linear' });
                assertEquals(
                    'Test definition returns true for hasProperty after property added', 
                    true, 
                    tDef.hasProperty('newProperty')
                );
                assertEquals(
                    'Test definition returns default duration after property added with timingFn attribute',
                    TransitionDefinition.defaults.duration,
                    tDef.getPropertyDuration('newProperty')
                );
                assertEquals(
                    'Test definition returns set delay after property added with timingFn attribute',
                    TransitionDefinition.defaults.delay,
                    tDef.getPropertyDelay('newProperty')
                );
                assertEquals(
                    'Test definition returns default timing function after property added with timingFn attribute',
                    'linear',
                    tDef.getPropertyTimingFn('newProperty')
                );
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyWithAllAttributes = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, setDuration, setDelay, setTimingFn;
                setDuration = 450;
                setDelay = 35;
                setTimingFn = 'linear';
                
                tDef = new TransitionDefinition();
                tDef.setProperty('newProperty', 
                    {
                        duration: setDuration,
                        delay: setDelay, 
                        timingFn: setTimingFn 
                    });
                assertEquals(
                    'Test definition returns true for hasProperty after property added', 
                    true, 
                    tDef.hasProperty('newProperty')
                );
                assertEquals(
                    'Test definition returns set duration after property added with all attributes',
                    setDuration,
                    tDef.getPropertyDuration('newProperty')
                );
                assertEquals(
                    'Test definition returns set delay after property added with all attributes',
                    setDelay,
                    tDef.getPropertyDelay('newProperty')
                );
                assertEquals(
                    'Test definition returns set timing function after property added with all attributes',
                    setTimingFn,
                    tDef.getPropertyTimingFn('newProperty')
                );
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testGetPropertiesReturnsEmptyArrayOnNewObject = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                assertEquals([], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testGetPropertiesReturnsAddedProperyInArray = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('someProp');
                assertEquals(['someProp'], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testGetPropertiesReturnsArrayOfAddedProperties = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('prop1');
                tDef.setProperty('prop2');
                tDef.setProperty('prop3');
                tDef.setProperty('prop4');
                assertEquals(['prop1', 'prop2', 'prop3', 'prop4'], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testRemovePropertyFromEnd = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('prop1');
                tDef.setProperty('prop2');
                tDef.setProperty('prop3');
                tDef.setProperty('prop4');
                assertEquals(['prop1', 'prop2', 'prop3', 'prop4'], tDef.getProperties());
                tDef.removeProperty('prop4');
                assertEquals(['prop1', 'prop2', 'prop3'], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testRemovePropertyFromMiddle = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('prop1');
                tDef.setProperty('prop2');
                tDef.setProperty('prop3');
                tDef.setProperty('prop4');
                assertEquals(['prop1', 'prop2', 'prop3', 'prop4'], tDef.getProperties());
                tDef.removeProperty('prop3');
                assertEquals(['prop1', 'prop2', 'prop4'], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testRemovePropertyFromStart = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef;
                tDef = new TransitionDefinition();
                tDef.setProperty('prop1');
                tDef.setProperty('prop2');
                tDef.setProperty('prop3');
                tDef.setProperty('prop4');
                assertEquals(['prop1', 'prop2', 'prop3', 'prop4'], tDef.getProperties());
                tDef.removeProperty('prop1');
                assertEquals(['prop2',  'prop3', 'prop4'], tDef.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyDuration = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, startVal, endVal, prop;
                startVal = 500;
                endVal = 300;
                prop = 'prop1';
                tDef = new TransitionDefinition();
                tDef.setProperty(prop, 
                    {
                       duration: startVal 
                    }
                );

                assertEquals(startVal, tDef.getPropertyDuration(prop));
                tDef.setPropertyDuration(prop, endVal);
                assertEquals(endVal, tDef.getPropertyDuration(prop));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyDelay = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, startVal, endVal, prop;
                prop = 'prop1';
                startVal = 40;
                endVal = 0;
                tDef = new TransitionDefinition();
                tDef.setProperty(prop, 
                    {
                       delay: startVal 
                    });

                assertEquals(startVal, tDef.getPropertyDelay(prop));
                tDef.setPropertyDelay(prop, endVal);
                assertEquals(endVal, tDef.getPropertyDelay(prop));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyTimingFn = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, startVal, endVal, prop;
                prop = 'prop1';
                startVal = 'easeInOut';
                endVal = 'linear';
                tDef = new TransitionDefinition();
                tDef.setProperty(prop, 
                    {
                       timingFn: startVal 
                    });

                assertEquals(startVal, tDef.getPropertyTimingFn(prop));
                tDef.setPropertyTimingFn(prop, endVal);
                assertEquals(endVal, tDef.getPropertyTimingFn(prop));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyDurationOnNonExistantPropertyCreatesProperty = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, endVal, prop;
                endVal = 300;
                prop = 'prop1';
                tDef = new TransitionDefinition();
                assertFalse(tDef.hasProperty(prop));
                assertEquals(undefined, tDef.getPropertyDuration(prop));
                tDef.setPropertyDuration(prop, endVal);
                assertTrue(tDef.hasProperty(prop));
                assertEquals(endVal, tDef.getPropertyDuration(prop));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyDelayOnNonExistantPropertyCreatesProperty = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, endVal, prop;
                endVal = 75;
                prop = 'prop1';
                tDef = new TransitionDefinition();
                assertFalse(tDef.hasProperty(prop));
                assertEquals(undefined, tDef.getPropertyDelay(prop));
                tDef.setPropertyDelay(prop, endVal);
                assertTrue(tDef.hasProperty(prop));
                assertEquals(endVal, tDef.getPropertyDelay(prop));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testSetPropertyTimingFnOnNonExistantPropertyCreatesProperty = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef, endVal, prop;
                endVal = 'linear';
                prop = 'prop1';
                tDef = new TransitionDefinition();
                assertFalse(tDef.hasProperty(prop));
                assertEquals(undefined, tDef.getPropertyTimingFn(prop));
                tDef.setPropertyTimingFn(prop, endVal);
                assertTrue(tDef.hasProperty(prop));
                assertEquals(endVal, tDef.getPropertyTimingFn(prop));
            }
        );
    };

    this.TransitionDefinitionTest.prototype.testAddingDefinitionToAnotherAddsProperties = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef1, tDef2;

                tDef1 = new TransitionDefinition();
                tDef1.setProperty('prop1');
                tDef1.setProperty('prop2');
                
                tDef2 = new TransitionDefinition();
                tDef2.setProperty('prop3');
                tDef2.setProperty('prop4');
                
                assertEquals(['prop1', 'prop2'], tDef1.getProperties());
                assertEquals(['prop3', 'prop4'], tDef2.getProperties());
                
                tDef1.addIn(tDef2);
                
                assertEquals(['prop1', 'prop2', 'prop3', 'prop4'], tDef1.getProperties());
                assertEquals(['prop3', 'prop4'], tDef2.getProperties());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAddingDefinitionToAnotherCopiesAttributes = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef1, tDef2, delay1, dur1, fn1, delay2, dur2, fn2, delay3, dur3, fn3;
               
                delay1 = 10;
                dur1 = 100;
                fn1 = 'linear';
                
                delay2 = 20;
                dur2 = 200;
                fn2 = 'easeInOut';
                
                delay3 = 30;
                dur3 = 300;
                fn3 = 'easeIn';
                
                tDef1 = new TransitionDefinition();
                tDef1.setProperty(
                    'prop1',
                    {
                        delay: delay1,
                        duration: dur1,
                        timingFn: fn1
                    }
                );
                
                tDef2 = new TransitionDefinition();
                tDef2.setProperty(
                    'prop2',
                    {
                        delay: delay2,
                        duration: dur2,
                        timingFn: fn2
                    }
                );

                assertEquals(dur1, tDef1.getPropertyDuration('prop1'));
                assertEquals(delay1, tDef1.getPropertyDelay('prop1'));
                assertEquals(fn1, tDef1.getPropertyTimingFn('prop1'));
                
                assertEquals(undefined, tDef1.getPropertyDuration('prop2'));
                assertEquals(undefined, tDef1.getPropertyDelay('prop2'));
                assertEquals(undefined, tDef1.getPropertyTimingFn('prop2'));
                
                assertEquals(dur2, tDef2.getPropertyDuration('prop2'));
                assertEquals(delay2, tDef2.getPropertyDelay('prop2'));
                assertEquals(fn2, tDef2.getPropertyTimingFn('prop2'));
                
                tDef1.addIn(tDef2);
                
                assertEquals(dur2, tDef1.getPropertyDuration('prop2'));
                assertEquals(delay2, tDef1.getPropertyDelay('prop2'));
                assertEquals(fn2, tDef1.getPropertyTimingFn('prop2'));
                
                tDef1.setPropertyDelay('prop2', delay3);
                tDef1.setPropertyDuration('prop2', dur3);
                tDef1.setPropertyTimingFn('prop2', fn3);
                
                assertEquals(dur2, tDef2.getPropertyDuration('prop2'));
                assertEquals(delay2, tDef2.getPropertyDelay('prop2'));
                assertEquals(fn2, tDef2.getPropertyTimingFn('prop2'));
                
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAddingDefinitionOverwritesDuplicateParameters = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var tDef1, tDef2, delay1, dur1, fn1, delay2, dur2, fn2, delay3, dur3, fn3;
               
                delay1 = 1111;
                dur1 = 1111;
                fn1 = 'easeIn';
                
                delay2 = 2222;
                dur2 = 2222;
                fn2 = 'easeOut';
                
                delay3 = 3333;
                dur3 = 3333;
                fn3 = 'linear';
                
                tDef1 = new TransitionDefinition();
                tDef1.setProperty(
                    'prop1',
                    {
                        delay: delay1,
                        duration: dur1,
                        timingFn: fn1
                    }
                );
                
                tDef1.setProperty(
                    'prop2',
                    {
                        delay: delay2,
                        duration: dur2,
                        timingFn: fn2
                    }
                );
                
                tDef2 = new TransitionDefinition();
                tDef2.setProperty(
                    'prop1',
                    {
                        delay: delay2,
                        duration: dur2,
                        timingFn: fn2
                    }
                );

                assertEquals(dur1, tDef1.getPropertyDuration('prop1'));
                assertEquals(delay1, tDef1.getPropertyDelay('prop1'));
                assertEquals(fn1, tDef1.getPropertyTimingFn('prop1'));
                
                tDef1.addIn(tDef2);
                
                assertEquals(dur2, tDef1.getPropertyDuration('prop1'));
                assertEquals(delay2, tDef1.getPropertyDelay('prop1'));
                assertEquals(fn2, tDef1.getPropertyTimingFn('prop1'));
                
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testTakeOutTransitionDefinitionRemovesParameters = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1, trans2;
                trans1 = new TransitionDefinition();
                trans1.setProperty('prop1');
                trans1.setProperty('prop2');
                
                trans2 = new TransitionDefinition();
                trans2.setProperty('prop2');
                
                assertEquals(['prop1', 'prop2'], trans1.getProperties());
                assertEquals(['prop2'], trans2.getProperties());
                
                trans1.takeOut(trans2);
                
                assertEquals(['prop1'], trans1.getProperties());
                assertEquals(['prop2'], trans2.getProperties());
                assertFalse(trans1.hasProperty('prop2'));
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAllDurationsZeroReturnsTrueWhenEmpty = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1;
                trans1 = new TransitionDefinition();
                assertTrue(trans1.areAllDurationsZero());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAllDurationsZeroReturnsFalseWhenOneNotZero = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1;
                trans1 = new TransitionDefinition();
                trans1.setProperty('prop1', {duration: 0});
                trans1.setProperty('prop2', {duration: 20});
                assertFalse(trans1.areAllDurationsZero());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAllDurationsZeroReturnsFalseWhenAllNotZero = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1;
                trans1 = new TransitionDefinition();
                trans1.setProperty('prop1', {duration: 50});
                trans1.setProperty('prop2', {duration: 20});
                assertFalse(trans1.areAllDurationsZero());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAllDurationsZeroReturnsTrueWhenOnePropertyAndPropertyIsZero = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1;
                trans1 = new TransitionDefinition();
                trans1.setProperty('prop1', {duration: 0});
                assertTrue(trans1.areAllDurationsZero());
            }
        );
    };
    
    this.TransitionDefinitionTest.prototype.testAllDurationsZeroReturnsTrueWhenMultiplePropertiesAllHaveZeroDuration = function(queue) {
        loadTD(queue,
            function(TransitionDefinition){
                var trans1;
                trans1 = new TransitionDefinition();
                trans1.setProperty('prop1', {duration: 0});
                trans1.setProperty('prop2', {duration: 0});
                trans1.setProperty('prop3', {duration: 0});
                trans1.setProperty('prop4', {duration: 0});
                assertTrue(trans1.areAllDurationsZero());
            }
        );
    };
    
}());