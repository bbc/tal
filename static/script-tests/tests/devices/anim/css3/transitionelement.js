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
    function loadTE(queue, fn) {
        queuedRequire(queue,
            [
                'antie/devices/anim/css3/transitionelement',
                'mocks/mockelement',
                'antie/devices/anim/css3/transitiondefinition'
            ],
            fn
        );
    }
    
    function getMockPropMap(){
        return {
            "transition-property": "transition-property",
            "transition-timing-function": "transition-timing-function",
            "transition-duration": "transition-duration",
            "transition-delay": "transition-delay",
            "transitionEndEvents": ['transitionend1', "transitionend2"]
        };
    }
    
    function getMockTransitionDefinition(TransitionDefinition) {
        var transDef;
        transDef = new TransitionDefinition();
        transDef.getProperties = function() {
            return ["fizz", "buzz", "beep"];
        };
        transDef.getPropertyDelay = function(prop) {
            switch (prop) {
                case 'fizz':
                return 50;
                case 'buzz':
                return 100;
                case 'beep':
                return 0;    
            }
        };
        transDef.getPropertyDuration = function(prop) {
            switch (prop) {
                case 'fizz':
                return 0;
                case 'buzz':
                return 20;
                case 'beep':
                return 100;    
            }
        };
        transDef.getPropertyTimingFn = function(prop) {
            switch (prop) {
                case 'fizz':
                return "linear";
                case 'buzz':
                return "beizer(-0.2, 1, 0, 0.5)";
                case 'beep':
                return "easeInOut";    
            }
        };
        return transDef;
    }
    
    function makeNewTransElAndApplyMocks(self, TransitionElement, MockElement) {
        var transEl, mockEl;
        mockEl = new MockElement();
        transEl = new TransitionElement(mockEl);
        transEl.mockEl = mockEl;
        transEl._propMap = getMockPropMap();
	self.sandbox.spy(transEl.mockEl, "addEventListener");
	self.sandbox.spy(transEl.mockEl, "removeEventListener");
        return transEl;
    }
    
    this.TransitionElementTest = AsyncTestCase("TransitionElement");
    
    this.TransitionElementTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.TransitionElementTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    this.TransitionElementTest.prototype.testElementsPropertiesReturnedAsArray = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, expected;
                expected = ["top", "left", "opacity"];
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                assertEquals(expected, transEl.getProperties());
            }
        );
    };
    
    this.TransitionElementTest.prototype.testElementsDurationsReturnedAsMsArray = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, expected;
                expected = [400, 2000, 600];
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                assertEquals(expected, transEl.getDurations());
            }
        );
    };
    
    this.TransitionElementTest.prototype.testElementsTimingFunctionsReturnedAsArray = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, expected;
                expected = ['linear', 'easeInOut', 'beizer(0, .6, 0.3, -4)'];
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                assertEquals(expected, transEl.getTimingFns());
            }
        );
    };
    
    this.TransitionElementTest.prototype.testElementsDelaysReturnedAsArray = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, expected;
                expected = [0, 100, 5];
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                assertEquals(expected, transEl.getDelays());
            }
        );
    };
    
    this.TransitionElementTest.prototype.testTransisitonDefinitionApplied = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement, TransitionDefinition) {
                var transEl, transDef;
                transDef = getMockTransitionDefinition(TransitionDefinition);
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                self.sandbox.spy(transEl.mockEl.style, "setProperty");  
                transEl.applyDefinition(transDef);
                assert(transEl.mockEl.style.setProperty.calledWith("transition-property", "fizz,buzz,beep"));
                assert(transEl.mockEl.style.setProperty.calledWith("transition-delay", "50ms,100ms,0ms"));
                assert(transEl.mockEl.style.setProperty.calledWith("transition-duration", "0ms,20ms,100ms"));
                assert(transEl.mockEl.style.setProperty.calledWith("transition-timing-function", "linear,beizer(-0.2, 1, 0, 0.5),easeInOut"));
            }
        );
    };
    
    this.TransitionElementTest.prototype.testSetCallbackAddsFnsAsEventListeners = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl;
                function callback() {}
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                transEl.setCallback(callback);
                assert(transEl.mockEl.addEventListener.calledTwice);
                assert(transEl.mockEl.addEventListener.calledWith("transitionend1", callback));
                assert(transEl.mockEl.addEventListener.calledWith("transitionend2", callback));
            }
        );
    };
    
    this.TransitionElementTest.prototype.testRemoveCallbackRemovesEventListeners = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl;
                function callback() {}
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                transEl.removeCallback(callback);
                assert(transEl.mockEl.removeEventListener.calledTwice);
                assert(transEl.mockEl.removeEventListener.calledWith("transitionend1", callback));
                assert(transEl.mockEl.removeEventListener.calledWith("transitionend2", callback));
            }
        );
    };

    this.TransitionElementTest.prototype.testForceUpdateCallsGetComputedStyle = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl;
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                self.sandbox.stub(window, "getComputedStyle");
                transEl.forceUpdate("top");
                assert(window.getComputedStyle.calledOnce);
            }
        );
    };
    
    this.TransitionElementTest.prototype.testGetStylePropertyValueReturnsValue = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, value;
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                self.sandbox.stub(transEl.mockEl.style, "getPropertyValue").returns('somethingOrOther');
                value = transEl.getStylePropertyValue('testProperty');
                assert(transEl.mockEl.style.getPropertyValue.calledWith('testProperty'));
                assertEquals('somethingOrOther', value);
            }
        );
    };
    
    this.TransitionElementTest.prototype.testGetStylePropertyOfUndefined = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, value;
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                self.sandbox.stub(transEl.mockEl.style, "getPropertyValue").returns(undefined);
                value = transEl.getStylePropertyValue('nonExistantProperty');
                assert(transEl.mockEl.style.getPropertyValue.calledWith('nonExistantProperty'));
                assertEquals(undefined, value);
            }
        );
    };
    
    this.TransitionElementTest.prototype.testSetStyleProperty = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, setObj;
                setObj = {};
                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                self.sandbox.stub(transEl.mockEl.style, "setProperty", function(prop, value) {
                    setObj[prop] = value;
                });
                
                transEl.setStylePropertyValue('someProperty', 'someValue');
                assert(transEl.mockEl.style.setProperty.calledOnce);
                assertEquals('someValue', setObj.someProperty);
            }
        );
    };

    this.TransitionElementTest.prototype.testIsEventOnElementTrueWhenElementTargetMatches = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, testEvent;

                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                testEvent = {target: transEl.mockEl};
                
                assertTrue("isEventTarget returns true when the events target is the TransitionElements underlying DOM element", transEl.isEventTarget(testEvent));

            }
        );
    };

    this.TransitionElementTest.prototype.testIsEventOnElementFalseWhenElementTargetDoesNotMatch = function(queue) {
	var self = this;
        loadTE(queue,
            function(TransitionElement, MockElement) {
                var transEl, testEvent;

                transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                testEvent = {target: new MockElement()};
                
                assertFalse("isEventTarget returns false when the events target is not the TransitionElements underlying DOM element", transEl.isEventTarget(testEvent));

            }
        );
    };
}());
