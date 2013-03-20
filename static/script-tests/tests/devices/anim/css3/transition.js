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
    this.TransitionTest = AsyncTestCase("Transition");

    this.TransitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        sinon.assert.pass = function() {
            assert(true);
        };
    };

    this.TransitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    function loadT(queue, fn) {
        queuedRequire(queue,
            [
                'antie/devices/anim/css3/transition',
                'antie/devices/anim/css3/transitiondefinition',
                'antie/devices/anim/css3/transitionendpoints',
                'mocks/mockelement',
                'antie/devices/anim/css3/transitionelement'
            ],
            fn
        );
    }
    
    function addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement, mockAddEventLister) {
        var options;
        
        obj.tDef = new TransitionDefinition();
        obj.tDef.setProperty(
            "top",
            {
                duration: 100,
                delay: 0,
                timingFn: 'linear'
            }
        );
        
        options = {
            to: {
                top: 50
            },
            from: {
                top: 20
            }
        };
        
        obj.tEnds = new TransitionEndPoints(options);

        obj.element = new MockElement();
        
        if(mockAddEventLister) {
            sinon.stub(
                obj.element, 
                "addEventListener",
                function(event, callback) {
                    if(typeof callback === 'function') {
                        setTimeout(callback, 100);
                    }
                }
            );
        }
    }
    
    this.TransitionTest.prototype.testTransitionSetToCompleteAfterEnd = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var self, options, transDef, transEnds;
                expectAsserts(2);
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement, true);
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);
                assertFalse(trans._completed);
            }
        );   
        queue.call('Wait for callback',
            function(callbacks) {
                var checkAtEnd = callbacks.add(function() {
                    assertTrue(trans._completed);
                });
                setTimeout(checkAtEnd, 100 + 100);
            }
        );
    };
    
    this.TransitionTest.prototype.testTransitionRemovedAfterCompletion = function(queue) {
        var trans, existingTransDef, newTransDef, applySpy, existingProperties, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var existingTransDef, tEnds, el;
                expectAsserts(2);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                applySpy = sinon.spy(TransitionElement.prototype, "applyDefinition");
                
                existingTransDef = new TransitionDefinition();
                existingTransDef.setProperty("top");
                existingTransDef.setProperty("left");
                existingTransDef.setProperty("opacity");
                
                newTransDef = new TransitionDefinition();
                newTransDef.setProperty("newOne", {
                    duration: 100
                });
                
                tEnds = new TransitionEndPoints(
                    {
                        to: {
                            newOne: 300
                        },
                        
                        from: {
                            newOne: 20
                        }  
                    }
                );
                
                existingProperties = existingTransDef.getProperties();
                el = new MockElement();
                
                sinon.stub(
                    el, 
                    "addEventListener", 
                    function(event, callback) {
                        function callbackWithArgs() {
                            callback({
                                propertyName: "newOne"
                            });
                        }
                        
                        if(typeof callback === 'function') {
                            setTimeout(callbackWithArgs, 100);
                        }
                    }
                );

                trans = new Transition(newTransDef, tEnds, el);
                
                // can't compare the transdef object directly as sinon tries to recurse through element and dies from stack overflow
                assertEquals("check definition set", ["top", "left", "opacity", "newOne"], applySpy.getCall(0).args[0].getProperties());
            }
        );   
        queue.call('Wait for callback',
            function(callbacks) {
                var checkAtEnd = callbacks.add(function() {
                    // can't compare the transdef object directly as sinon tries to recurse through element and dies from stack overflow
                    assertEquals("check definition reset", existingProperties, applySpy.getCall(1).args[0].getProperties());
                });
                setTimeout(checkAtEnd, 100 + 100);
            }
        );
    };
    
    this.TransitionTest.prototype.testTransitionFromValuesSetOnElement = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy;
                expectAsserts(1);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = sinon.spy(obj.element.style, "setProperty").withArgs("top", "20px");
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue("setProperty called on element", spy.withArgs("top", "20px").calledOnce);
            }
        );   

    };
    
    this.TransitionTest.prototype.testTransitionToValuesSetOnElement = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy;
                expectAsserts(1);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = sinon.spy(obj.element.style, "setProperty").withArgs("top", "50px");
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue("setProperty called on element", spy.withArgs("top", "50px").calledOnce);
            }
        );   

    };
    
    this.TransitionTest.prototype.testTransitionToValuesSetOnElementAfterFromValues = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, fromSpy, toSpy;
                expectAsserts(1);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = sinon.spy(obj.element.style, "setProperty");
                fromSpy = spy.withArgs("top", "20px");
                toSpy = spy.withArgs("top", "50px");
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue("setProperty called in correct order", toSpy.calledAfter(fromSpy));
            }
        );   
    };
    
    this.TransitionTest.prototype.testUpdateForcedBetweenFromAndDefApplication = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, forceSpy, fromSpy, toSpy, tDefApplySpy;
                expectAsserts(1);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                forceSpy = this.sandbox.spy(TransitionElement.prototype, "forceUpdate");
                
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = sinon.spy(TransitionElement.prototype, "setStylePropertyValue");
                fromSpy = spy.withArgs("top", "20px");
                toSpy = spy.withArgs("top", "50px");
                tDefApplySpy = sinon.spy(TransitionElement.prototype, "applyDefinition");
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);                
                sinon.assert.callOrder(fromSpy, forceSpy, tDefApplySpy);
            }
        );   
    };
    
    this.TransitionTest.prototype.testUpdateForcedBetweenDefApplicationAndFrom = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, forceSpy, fromSpy, toSpy, tDefApplySpy;
                expectAsserts(3);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                forceSpy = this.sandbox.spy(TransitionElement.prototype, "forceUpdate");
                
                obj = {};
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = sinon.spy(TransitionElement.prototype, "setStylePropertyValue");
                fromSpy = spy.withArgs("top", "20px");
                toSpy = spy.withArgs("top", "50px");
                tDefApplySpy = sinon.spy(TransitionElement.prototype, "applyDefinition");
                
                trans = new Transition(obj.tDef, obj.tEnds, obj.element);                
                assert(forceSpy.calledAfter(tDefApplySpy));
                assert(forceSpy.calledBefore(toSpy));
                assertFalse(forceSpy.calledAfter(toSpy));
            }
        );   
    };
    
    this.TransitionTest.prototype.testCallingStopWithNoParamFiresCallbackAndSkipsToEnd = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var obj, options, endPoints, lastPropCall;
                expectAsserts(2);
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                lastPropCall = {};
                options = {
                    to: {
                        "someParam": 50
                    },
                    from: {
                        "someParam": 100
                    },
                    onComplete: sinon.spy()
                };
                obj = {};
                endPoints = new TransitionEndPoints(options);
                addTDefsEndPointsAndElToObj(obj, TransitionDefinition, TransitionEndPoints, MockElement);
                sinon.stub(obj.element.style, "setProperty", function(prop, value) {
                    lastPropCall[prop] = value;
                });
                trans = new Transition(obj.tDef, endPoints, obj.element);   
                trans.stop();
                assert(options.onComplete.calledOnce);
                assertEquals('Last call to setProperty on element was to: value', 50, lastPropCall.someParam);
            }
        );   
    };
    
    this.TransitionTest.prototype.testCallingStopWithSkipToEndFalseFiresCallbackAndSkipsToComputedValue = function(queue) {
        var trans, obj;
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, lastPropCall, el;
                expectAsserts(2);
                
                lastPropCall = {};
                options = {
                    to: {
                        "someParam": 50
                    },
                    from: {
                        "someParam": 100
                    },
                    onComplete: sinon.spy()
                };

                endPoints = new TransitionEndPoints(options);
                
                sinon.stub(TransitionElement.prototype, "getComputedStyle", function() {
                    return {
                        "someParam": 75
                    };    
                });
                trans = new TransitionDefinition();
                trans.setProperty("someParam");
                el = new MockElement();
          
                sinon.stub(el.style, "setProperty", function(prop, value) {
                    lastPropCall[prop] = value;
                });
                trans = new Transition(trans, endPoints, el);   
                trans.stop(false);
                assert(options.onComplete.calledOnce);
                assertEquals('Last call to setProperty on element was computed value', 75, lastPropCall.someParam);
            }
        );   
    };
    
    this.TransitionTest.prototype.testStopCalledOnSkippedTransition = function(queue) {
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, lastPropCall, el, stopSpy;
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                options = {
                    to: {
                        "someParam": 50
                    },
                    from: {
                        "someParam": 100
                    },
                    onComplete: sinon.spy(),
                    skipAnim: true
                    
                };
                endPoints = new TransitionEndPoints(options);
                trans = new TransitionDefinition();
                trans.setProperty("someParam");
                el = new MockElement();
                stopSpy = sinon.spy(Transition.prototype, "stop");

                trans = new Transition(trans, endPoints, el);   
                assert(stopSpy.calledWith(true));  
            }
        );
    };
    
    this.TransitionTest.prototype.testStopCalledOnZeroDurationTransition = function(queue) {
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, lastPropCall, el, stopSpy, transDef;
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                options = {
                    to: {
                        "someParam": 50
                    },
                    from: {
                        "someParam": 100
                    },
                    onComplete: sinon.spy()
                };
                endPoints = new TransitionEndPoints(options);
                transDef = new TransitionDefinition();
                transDef.setProperty("someParam");
                transDef.setPropertyDuration("someParam", 0);
                el = new MockElement();
                stopSpy = sinon.spy(Transition.prototype, "stop");

                trans = new Transition(transDef, endPoints, el);   
                assert(stopSpy.calledWith(true));  
            }
        );
    };
    
    this.TransitionTest.prototype.testStopCalledOnChangelessTransition = function(queue) {
        loadT(
            queue, 
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, lastPropCall, el, stopSpy, transDef;
                
                this.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                
                options = {
                    to: {
                        "someParam": 50
                    },
                    from: {
                        "someParam": 50
                    },
                    onComplete: sinon.spy()
                };
                endPoints = new TransitionEndPoints(options);
                transDef = new TransitionDefinition();
                transDef.setProperty("someParam");
                transDef.setPropertyDuration("someParam", 100);
                el = new MockElement();
                stopSpy = sinon.spy(Transition.prototype, "stop");

                trans = new Transition(transDef, endPoints, el);   
                assert(stopSpy.calledWith(true));  
            }
        );
    };
    
}());