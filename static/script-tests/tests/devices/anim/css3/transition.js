/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.TransitionTest = AsyncTestCase('Transition');

    this.TransitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.TransitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    function loadT(queue, fn) {
        queuedRequire(
            queue,
            [
                'antie/devices/anim/css3/transition',
                'antie/devices/anim/css3/transitiondefinition',
                'antie/devices/anim/shared/transitionendpoints',
                'mocks/mockelement',
                'antie/devices/anim/css3/transitionelement'
            ],
            fn
        );
    }

    function addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement, mockAddEventLister) {
        var options;

        obj.tDef = new TransitionDefinition();
        obj.tDef.setProperty(
            'top',
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
            self.sandbox.stub(
                obj.element,
                'addEventListener',
                function(event, callback) {
                    function wrappedCallback() {
                        var mockEvt = {};
                        mockEvt.propertyName = 'top';
                        mockEvt.target = obj.element;
                        callback(mockEvt);
                    }

                    if(typeof callback === 'function') {
                        setTimeout(wrappedCallback, 100);
                    }
                }
            );
        }
    }

    this.TransitionTest.prototype.testTransitionSetToCompleteAfterEnd = function(queue) {
        var self = this;
        var trans, obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                expectAsserts(2);
                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement, true);

                var clock = sinon.useFakeTimers();

                trans = new Transition(obj.tDef, obj.tEnds, obj.element);
                assertFalse(trans._completed);

                clock.tick(200);

                assertTrue(trans._completed);

                clock.restore();
            }
        );
    };

    this.TransitionTest.prototype.testTransitionRemovedAfterCompletion = function(queue) {
        var self = this;
        var  newTransDef, applySpy, existingProperties;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var existingTransDef, tEnds, el;
                expectAsserts(2);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                applySpy = self.sandbox.spy(TransitionElement.prototype, 'applyDefinition');

                existingTransDef = new TransitionDefinition();
                existingTransDef.setProperty('top');
                existingTransDef.setProperty('left');
                existingTransDef.setProperty('opacity');

                newTransDef = new TransitionDefinition();
                newTransDef.setProperty('newOne', {
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

                self.sandbox.stub(
                    el,
                    'addEventListener',
                    function(event, callback) {
                        function callbackWithArgs() {
                            callback({
                                propertyName: 'newOne',
                                target: el
                            });
                        }

                        if(typeof callback === 'function') {
                            setTimeout(callbackWithArgs, 100);
                        }
                    }
                );

                var clock = sinon.useFakeTimers();

                new Transition(newTransDef, tEnds, el);

                // can't compare the transdef object directly as sinon tries to recurse through element and dies from stack overflow
                assertEquals('check definition set', ['top', 'left', 'opacity', 'newOne'], applySpy.getCall(0).args[0].getProperties());

                clock.tick(200);

                // can't compare the transdef object directly as sinon tries to recurse through element and dies from stack overflow
                assertEquals('check definition reset', existingProperties, applySpy.getCall(1).args[0].getProperties());

                clock.restore();
            }
        );
    };

    this.TransitionTest.prototype.testTransitionFromValuesSetOnElement = function(queue) {
        var self = this;
        var obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy;
                expectAsserts(1);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = self.sandbox.spy(obj.element.style, 'setProperty').withArgs('top', '20px');

                new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue('setProperty called on element', spy.withArgs('top', '20px').calledOnce);
            }
        );

    };

    this.TransitionTest.prototype.testTransitionToValuesSetOnElement = function(queue) {
        var self = this;
        var obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy;
                expectAsserts(1);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = self.sandbox.spy(obj.element.style, 'setProperty').withArgs('top', '50px');

                new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue('setProperty called on element', spy.withArgs('top', '50px').calledOnce);
            }
        );

    };

    this.TransitionTest.prototype.testTransitionToValuesSetOnElementAfterFromValues = function(queue) {
        var self = this;
        var obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, fromSpy, toSpy;
                expectAsserts(1);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = self.sandbox.spy(obj.element.style, 'setProperty');
                fromSpy = spy.withArgs('top', '20px');
                toSpy = spy.withArgs('top', '50px');

                new Transition(obj.tDef, obj.tEnds, obj.element);
                assertTrue('setProperty called in correct order', toSpy.calledAfter(fromSpy));
            }
        );
    };

    this.TransitionTest.prototype.testUpdateForcedBetweenFromAndDefApplication = function(queue) {
        var self = this;
        var obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, forceSpy, fromSpy, tDefApplySpy;
                expectAsserts(1);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                forceSpy = self.sandbox.spy(TransitionElement.prototype, 'forceUpdate');

                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = self.sandbox.spy(TransitionElement.prototype, 'setStylePropertyValue');
                fromSpy = spy.withArgs('top', '20px');
                tDefApplySpy = self.sandbox.spy(TransitionElement.prototype, 'applyDefinition');

                new Transition(obj.tDef, obj.tEnds, obj.element);
                self.sandbox.stub(sinon.assert, 'pass', function() {
                    assert(true);
                });
                sinon.assert.callOrder(fromSpy, forceSpy, tDefApplySpy);
            }
        );
    };

    this.TransitionTest.prototype.testUpdateForcedBetweenDefApplicationAndFrom = function(queue) {
        var self = this;
        var obj;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var spy, forceSpy, toSpy, tDefApplySpy;
                expectAsserts(3);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                forceSpy = self.sandbox.spy(TransitionElement.prototype, 'forceUpdate');

                obj = {};
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                spy = self.sandbox.spy(TransitionElement.prototype, 'setStylePropertyValue');
                toSpy = spy.withArgs('top', '50px');
                tDefApplySpy = self.sandbox.spy(TransitionElement.prototype, 'applyDefinition');

                new Transition(obj.tDef, obj.tEnds, obj.element);
                assert(forceSpy.calledAfter(tDefApplySpy));
                assert(forceSpy.calledBefore(toSpy));
                assertFalse(forceSpy.calledAfter(toSpy));
            }
        );
    };

    this.TransitionTest.prototype.testCallingStopWithNoParamFiresCallbackAndSkipsToEnd = function(queue) {
        var self = this;
        var trans;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var obj, options, endPoints, lastPropCall;
                expectAsserts(2);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                lastPropCall = {};
                options = {
                    to: {
                        'someParam': 50
                    },
                    from: {
                        'someParam': 100
                    },
                    onComplete: self.sandbox.spy()
                };
                obj = {};
                endPoints = new TransitionEndPoints(options);
                addTDefsEndPointsAndElToObj(self, obj, TransitionDefinition, TransitionEndPoints, MockElement);
                self.sandbox.stub(obj.element.style, 'setProperty', function(prop, value) {
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
        var self = this;
        var trans;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, lastPropCall, el;
                expectAsserts(2);

                lastPropCall = {};
                options = {
                    to: {
                        'someParam': 50
                    },
                    from: {
                        'someParam': 100
                    },
                    onComplete: self.sandbox.spy()
                };

                endPoints = new TransitionEndPoints(options);

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function() {
                    return {
                        'someParam': 75
                    };
                });
                trans = new TransitionDefinition();
                trans.setProperty('someParam');
                el = new MockElement();

                self.sandbox.stub(el.style, 'setProperty', function(prop, value) {
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
        var self = this;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var trans, options, endPoints, el, stopSpy;

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                options = {
                    to: {
                        'someParam': 50
                    },
                    from: {
                        'someParam': 100
                    },
                    onComplete: self.sandbox.spy(),
                    skipAnim: true

                };
                endPoints = new TransitionEndPoints(options);
                trans = new TransitionDefinition();
                trans.setProperty('someParam');
                el = new MockElement();
                stopSpy = self.sandbox.spy(Transition.prototype, 'stop');

                trans = new Transition(trans, endPoints, el);
                assert(stopSpy.calledWith(true));
            }
        );
    };

    this.TransitionTest.prototype.testStopCalledOnZeroDurationTransition = function(queue) {
        var self = this;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, el, stopSpy, transDef;

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                options = {
                    to: {
                        'someParam': 50
                    },
                    from: {
                        'someParam': 100
                    },
                    onComplete: self.sandbox.spy()
                };
                endPoints = new TransitionEndPoints(options);
                transDef = new TransitionDefinition();
                transDef.setProperty('someParam');
                transDef.setPropertyDuration('someParam', 0);
                el = new MockElement();
                stopSpy = self.sandbox.spy(Transition.prototype, 'stop');

                new Transition(transDef, endPoints, el);
                assert(stopSpy.calledWith(true));
            }
        );
    };

    this.TransitionTest.prototype.testStopCalledOnChangelessTransition = function(queue) {
        var self = this;
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, el, stopSpy, transDef;

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});

                options = {
                    to: {
                        'someParam': 50
                    },
                    from: {
                        'someParam': 50
                    },
                    onComplete: self.sandbox.spy()
                };
                endPoints = new TransitionEndPoints(options);
                transDef = new TransitionDefinition();
                transDef.setProperty('someParam');
                transDef.setPropertyDuration('someParam', 100);
                el = new MockElement();
                stopSpy = self.sandbox.spy(Transition.prototype, 'stop');

                new Transition(transDef, endPoints, el);
                assert(stopSpy.calledWith(true));
            }
        );
    };

    this.TransitionTest.prototype.testEndFnChecksEventTarget = function(queue) {
        var self = this;
        var targetSpy;
        expectAsserts(1);
        loadT(
            queue,
            function(Transition, TransitionDefinition, TransitionEndPoints, MockElement, TransitionElement) {
                var options, endPoints, el, transDef;

                self.sandbox.stub(TransitionElement.prototype, 'getComputedStyle', function(){});
                targetSpy = self.sandbox.spy(TransitionElement.prototype, 'isEventTarget');

                options = {
                    to: {
                        'left': 50
                    },
                    from: {
                        'left': 20
                    },
                    onComplete: self.sandbox.spy()
                };

                endPoints = new TransitionEndPoints(options);
                transDef = new TransitionDefinition();
                transDef.setProperty('left');
                transDef.setPropertyDuration('left', 10);
                el = new MockElement();

                self.sandbox.stub(
                    el,
                    'addEventListener',
                    function(event, callback) {
                        function wrappedCallback() {
                            var mockEvt = {};
                            mockEvt.target = el;
                            callback(mockEvt);
                        }

                        if(typeof callback === 'function') {
                            setTimeout(wrappedCallback, 10);
                        }
                    }
                );

                var clock = sinon.useFakeTimers();

                new Transition(transDef, endPoints, el);

                clock.tick(60);

                assertTrue(targetSpy.called);

                clock.restore();

            }
        );
    };
}());
