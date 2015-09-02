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
    this.TransitionEndPointsTest = AsyncTestCase("TransitionEndPoints");

    this.TransitionEndPointsTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.TransitionEndPointsTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    function loadTEP(queue, fn) {
        queuedRequire(queue,
            [
                'antie/devices/anim/shared/transitionendpoints'
            ],
            fn
        );
    }
    
    this.TransitionEndPointsTest.prototype.testNewEndPointsIsEmpty = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                transEnds = new TransitionEndPoints();
                assertEquals([], transEnds.getProperties());
            }
        );   
    };
    
        this.TransitionEndPointsTest.prototype.testConstructorWithOptionsCallsSetFromOptions = function(queue) {
	var self = this;
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options, setOptionsSpy;
                options = {};
                setOptionsSpy = self.sandbox.spy(TransitionEndPoints.prototype, "setFromOptions");
                transEnds = new TransitionEndPoints(options);
                assert(setOptionsSpy.calledOnce);
                assert(setOptionsSpy.calledWith(options));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testSetFromOptionsSetsParameters = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    "whatever",
                        "anotherParam": "yep",
                        "lastParam":    "ok"
                    }    
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(["someParam", "anotherParam", "lastParam"], transEnds.getProperties());
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testGetPropertyDestinationGetsSetTo = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    30
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(30, transEnds.getPropertyDestination("someParam"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testGetPropertyDestinationGetsUndefinedOnAbsentParam = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    30
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(undefined, transEnds.getPropertyDestination("bee"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testGetPropertyOriginGetsUndefinedOnAbsentParam = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    30
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(undefined, transEnds.getPropertyOrigin("someParam"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testGetPropertyOriginGetsSetFromValue = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    30
                    },
                    from: {
                        "someParam":    10
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(10, transEnds.getPropertyOrigin("someParam"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testSetFromOptionsSetsOnComplete = function(queue) {
        var transEnds, dummy;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    "whatever"
                    },
                    onComplete: function() {
                        dummy = "evaluate something";
                    }
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(options.onComplete, transEnds.getOnCompleteCallback());
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testUnitsSetFromOptions = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    0,
                        "anotherParam": "existing"
                    },
                    units: {
                        "someParam":    "px",
                        "anotherParam": "POSTFIX"
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals("60px", transEnds.addUnitsToPropertyValue("someParam", 60));
                assertEquals("existingPOSTFIX", transEnds.addUnitsToPropertyValue("anotherParam", "existing"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testSuppliedUnitsOverrideOptions = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "someParam":    0,
                        "anotherParam": "existing"
                    },
                    units: {
                        "someParam":    "px",
                        "anotherParam": "POSTFIX"
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals("60different", transEnds.addUnitsToPropertyValue("someParam", 60, "different"));
                assertEquals("existingnew", transEnds.addUnitsToPropertyValue("anotherParam", "existing", "new"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testUnitsFallBackToDefaults = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "top":    20
                    }
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals("20" + TransitionEndPoints.defaultUnits.top, transEnds.addUnitsToPropertyValue("top", 20));
            }
        );
    };
    
    this.TransitionEndPointsTest.prototype.testNoDefaultMeansNoPostfix = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    0
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertEquals(0, transEnds.addUnitsToPropertyValue("opacity", 0));
                assertEquals("existingnew", transEnds.addUnitsToPropertyValue("anotherParam", "existing", "new"));
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testToAndFromAllEqualTrueWhenEqual = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    0,
                        "another":    "something"
                    },
                    from: {
                        "opacity":    0,
                        "another":    "something"
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assert(transEnds.toAndFromAllEqual());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testToAndFromAllEqualFailsWhenNotEqual = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    0,
                        "another":    "something"
                    },
                    from: {
                        "opacity":    0,
                        "another":    "something else"
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertFalse(transEnds.toAndFromAllEqual());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testToAndFromAllEqualFailsWhenNotAllParamsHaveFrom = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    0,
                        "another":    "something"
                    },
                    from: {
                        "opacity":    0
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertFalse(transEnds.toAndFromAllEqual());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testShouldSkipIsTrueWhenNoChange = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    0
                    },
                    from: {
                        "opacity":    0
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assert(transEnds.shouldSkip());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testShouldSkipIsTrueWhenSkipAnimSet = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    30
                    },
                    from: {
                        "opacity":    0
                    },
                    skipAnim: true
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assert(transEnds.shouldSkip());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testShouldSkipIsFalseWhenChangeAndNoSkipAnim = function(queue) {
        var transEnds;
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var options;
                options = {
                    to: {
                        "opacity":    30
                    },
                    from: {
                        "opacity":    0
                    }
                  
                };
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                assertFalse(transEnds.shouldSkip());  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testOriginsCompletedUsingElement = function(queue) { 
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var transEnds, options, el;
                el = {
                    style: {
                        getPropertyValue: function(prop) {
                            return el.style[prop];
                        },
                        top: "300px",
                        left: "50px"
                    }
                };
                
                options = {
                    to: {
                        "top":    30,
                        "left":   800
                    }
                };
                
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                transEnds.completeOriginsUsingElement(el);
                assertEquals("Top origin set from element", "300px", transEnds.getPropertyOrigin("top"));
                assertEquals("Left origin set from element", "50px", transEnds.getPropertyOrigin("left"));  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testOriginsNotSetFromElementWhenNoDestination = function(queue) { 
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var transEnds, options, el;
                el = {
                    style: {
                        getPropertyValue: function(prop) {
                            return el.style[prop];
                        },
                        top: "300px",
                        left: "50px"
                    }
                };
                
                options = {
                    to: {
                        "top":    30
                    }
                };
                
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                transEnds.completeOriginsUsingElement(el);
                assertEquals("Left origin set not from element", undefined, transEnds.getPropertyOrigin("left"));  
            }
        );   
    };
    
    this.TransitionEndPointsTest.prototype.testOriginNotOverridenByElement = function(queue) { 
        loadTEP(
            queue, 
            function(TransitionEndPoints) {
                var transEnds, options, el;
                el = {
                    style: {
                        getPropertyValue: function(prop) {
                            return el.style[prop];
                        },
                        top: "80px"
                    }
                };
                
                options = {
                    to: {
                        "top": 30
                    },
                    from: {
                        "top": 50
                    }
                };
                
                transEnds = new TransitionEndPoints();
                transEnds.setFromOptions(options);
                transEnds.completeOriginsUsingElement(el);
                assertEquals("Top origin overridden by element property", "50px", transEnds.getPropertyOrigin("top"));  
            }
        );   
    };    
    
           
}());
