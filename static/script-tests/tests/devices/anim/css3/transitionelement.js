/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    function loadTE(queue, fn) {
        queuedRequire(
            queue,
            [
                'antie/devices/anim/css3/transitionelement',
                'mocks/mockelement',
                'antie/devices/anim/css3/transitiondefinition'
            ],
            fn
        );
    }

    function getMockTransitionDefinition(TransitionDefinition) {
        var transDef;
        transDef = new TransitionDefinition();
        transDef.getProperties = function() {
            return ['fizz', 'buzz', 'beep'];
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
                return 'linear';
            case 'buzz':
                return 'beizer(-0.2, 1, 0, 0.5)';
            case 'beep':
                return 'easeInOut';
            }
        };
        return transDef;
    }

    function getPrefixes() {
        return ['', '-webkit-', '-moz-', '-o-'];
    }

    function getTransitionEndEvents() {
        return ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];
    }

    function makeNewTransElAndApplyMocks(self, TransitionElement, MockElement) {
        var transEl, mockEl;
        mockEl = new MockElement();
        transEl = new TransitionElement(mockEl);
        transEl.mockEl = mockEl;
        self.sandbox.spy(transEl.mockEl, 'addEventListener');
        self.sandbox.spy(transEl.mockEl, 'removeEventListener');
        return transEl;
    }

    this.TransitionElementTest = AsyncTestCase('TransitionElement');

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
                   expected = ['top', 'left', 'opacity'];
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
                   var prefixes = getPrefixes();
                   transDef = getMockTransitionDefinition(TransitionDefinition);
                   transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                   self.sandbox.spy(transEl.mockEl.style, 'setProperty');
                   transEl.applyDefinition(transDef);

                   prefixes.forEach(function (prefix) {
                       assert(transEl.mockEl.style.setProperty.calledWith(prefix + 'transition-property', 'fizz,buzz,beep'));
                       assert(transEl.mockEl.style.setProperty.calledWith(prefix + 'transition-property', 'fizz,buzz,beep'));
                       assert(transEl.mockEl.style.setProperty.calledWith(prefix + 'transition-delay', '50ms,100ms,0ms'));
                       assert(transEl.mockEl.style.setProperty.calledWith(prefix + 'transition-duration', '0ms,20ms,100ms'));
                       assert(transEl.mockEl.style.setProperty.calledWith(prefix + 'transition-timing-function', 'linear,beizer(-0.2, 1, 0, 0.5),easeInOut'));
                   });
               }
              );
    };

    this.TransitionElementTest.prototype.testSetCallbackAddsFnsAsEventListeners = function(queue) {
        var self = this;
        loadTE(queue,
               function(TransitionElement, MockElement) {
                   var transEl;
                   var transitionEndEvents = getTransitionEndEvents();
                   function callback() {}
                   transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                   transEl.setCallback(callback);

                   assertEquals(transitionEndEvents.length, transEl.mockEl.addEventListener.callCount);

                   transitionEndEvents.forEach(function (transitionEvent) {
                       assert(transEl.mockEl.addEventListener.calledWith(transitionEvent, callback));
                   });
               }
              );
    };

    this.TransitionElementTest.prototype.testRemoveCallbackRemovesEventListeners = function(queue) {
        var self = this;
        loadTE(queue,
               function(TransitionElement, MockElement) {
                   var transEl;
                   var transitionEndEvents = getTransitionEndEvents();
                   function callback() {}
                   transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                   transEl.removeCallback(callback);

                   assertEquals(transitionEndEvents.length, transEl.mockEl.removeEventListener.callCount);

                   transitionEndEvents.forEach(function (transitionEvent) {
                       assert(transEl.mockEl.removeEventListener.calledWith(transitionEvent, callback));
                   });
               }
              );
    };

    this.TransitionElementTest.prototype.testForceUpdateCallsGetComputedStyle = function(queue) {
        var self = this;
        loadTE(queue,
               function(TransitionElement, MockElement) {
                   var transEl;
                   transEl = makeNewTransElAndApplyMocks(self, TransitionElement, MockElement);
                   self.sandbox.stub(window, 'getComputedStyle');
                   transEl.forceUpdate('top');
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
                   self.sandbox.stub(transEl.mockEl.style, 'getPropertyValue').returns('somethingOrOther');
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
                   self.sandbox.stub(transEl.mockEl.style, 'getPropertyValue').returns(undefined);
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
                   self.sandbox.stub(transEl.mockEl.style, 'setProperty', function(prop, value) {
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

                   assertTrue('isEventTarget returns true when the events target is the TransitionElements underlying DOM element', transEl.isEventTarget(testEvent));

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

                   assertFalse('isEventTarget returns false when the events target is not the TransitionElements underlying DOM element', transEl.isEventTarget(testEvent));

               }
              );
    };
}());
