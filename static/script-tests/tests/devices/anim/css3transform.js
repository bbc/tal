require(
    [
        'antie/devices/browserdevice',
        'antie/runtimecontext',
        'antie/devices/anim/css3transform'
    ],
    function (BrowserDevice, RuntimeContext, Css3Transform) {
        'use strict';

        var browserDevice = new BrowserDevice(antie.framework.deviceConfiguration);
        var animationDevice = {};
        Css3Transform.assignMethodsTo(animationDevice);

        var element, maskElement;

        describe('CSS3 Transform Animation Modifier', function () {
            beforeEach(function () {
                spyOn(RuntimeContext, 'getCurrentApplication').and.returnValue({
                    getDevice: function () {
                        return browserDevice;
                    }
                });

                element = document.createElement('div');
            });

            it('indicates animation is not disabled', function () {
                expect(animationDevice.isAnimationDisabled()).toBe(false);
            });

            describe('verify behaviour across animation methods', function () {
                function verifyElementStyles (element, styles) {
                    Object.keys(styles).forEach(function (key) {
                        expect(element.style[key]).toBe(styles[key]);
                    });
                }

                var duration = 500;
                var easing = 'ease';

                var animationMethods = [
                    {
                        name: 'moveElementTo',
                        description: 'moveElementTo (vertical)',
                        to: {
                            top: 666
                        },
                        expectedFinalStyles: {
                            top: '666px'
                        },
                        expectedTransitionStyles: {
                            transform: 'translate3d(0px, 666px, 0px)'
                        }
                    },
                    {
                        name: 'moveElementTo',
                        description: 'moveElementTo (horizontal)',
                        to: {
                            left: 333
                        },
                        expectedFinalStyles: {
                            left: '333px'
                        },
                        expectedTransitionStyles: {
                            transform: 'translate3d(333px, 0px, 0px)'
                        }
                    },
                    {
                        name: 'tweenElementStyle',
                        to: {
                            width: 666,
                            height: 777
                        },
                        expectedFinalStyles: {
                            width: '666px',
                            height: '777px'
                        },
                        expectedTransitionStyles: {
                            width: '666px',
                            height: '777px'
                        }
                    },
                    {
                        name: 'showElement',
                        expectedFinalStyles: {
                            opacity: '1',
                            visibility: 'visible'
                        },
                        expectedTransitionStyles: {
                            opacity: '1'
                        }
                    },
                    {
                        name: 'hideElement',
                        expectedFinalStyles: {
                            opacity: '0',
                            visibility: 'hidden'
                        },
                        expectedTransitionStyles: {
                            opacity: '0'
                        }
                    }
                ];

                animationMethods.forEach(function (method) {
                    describe('for ' + (method.description || method.name), function () {
                        function callMethod(options) {
                            options = options || {};
                            options.el = element;
                            options.to = method.to;
                            options.duration = duration;
                            options.easing = easing;

                            animationDevice[method.name](options);
                        }

                        it('immediately sets target properties when animation is being skipped (via options)', function () {
                            callMethod({
                                skipAnim: true
                            });
                            verifyElementStyles(element, method.expectedFinalStyles);
                        });

                        it('immediately sets target properties when animation is being skipped (via device config)', function () {
                            spyOn(RuntimeContext.getCurrentApplication().getDevice(), 'getConfig').and.returnValue({
                                animationDisabled: true
                            });

                            callMethod();
                            verifyElementStyles(element, method.expectedFinalStyles);
                        });

                        it('calls back immediately when animation is being skipped', function () {
                            var callback = jasmine.createSpy('onComplete');
                            callMethod({
                                skipAnim: true,
                                onComplete: callback
                            });
                            expect(callback).toHaveBeenCalled();
                        });

                        describe('when animating', function () {
                            function simulateTransitionEnd () {
                                var transitionEndEvent = new CustomEvent('transitionend');
                                element.dispatchEvent(transitionEndEvent);
                            }

                            var callback;

                            beforeEach(function () {
                                callback = jasmine.createSpy('onComplete');
                                callMethod({
                                    onComplete: callback
                                });
                            });

                            it('sets style properties to enact the transition', function () {
                                verifyElementStyles(element, method.expectedTransitionStyles);
                            });

                            it('sets transition property containing styles under change', function () {
                                Object.keys(method.expectedTransitionStyles).forEach(function (styleProperty) {
                                    expect(element.style.transition).toContain(styleProperty);
                                });
                            });

                            it('includes easing and duration in transition property', function () {
                                expect(element.style.transition).toContain(easing);
                                expect(element.style.transition).toContain(duration + 'ms');
                            });

                            it('clears transition style property when animation ends', function () {
                                simulateTransitionEnd();
                                expect(element.style.transition).toBe('');
                            });

                            it('sets final style properties when animation ends', function () {
                                simulateTransitionEnd();
                                verifyElementStyles(element, method.expectedFinalStyles);
                            });

                            it('calls back only when transition ends', function () {
                                expect(callback).not.toHaveBeenCalled();
                                simulateTransitionEnd();
                                expect(callback).toHaveBeenCalled();
                            });

                            it('will not call back more than once', function () {
                                simulateTransitionEnd();
                                simulateTransitionEnd();
                                expect(callback.calls.count()).toBe(1);
                            });
                        });
                    });
                });
            });

            describe('scrollElementTo', function () {
                var options, onComplete;
                beforeEach(function () {
                    onComplete = jasmine.createSpy('onComplete');
                    options = {
                        el: element,
                        to: {
                            left: 666
                        },
                        skipAnim: true,
                        onComplete: onComplete
                    };
                })

                it('does nothing on elements that are not _masks', function () {
                    element.id = 'jim_carrey';
                    animationDevice.scrollElementTo(options);
                    expect(onComplete).not.toHaveBeenCalled();
                });

                it('scrolls the child of a _mask element in the opposite direction', function () {
                    element.id = 'the_mask';
                    var innerElement = document.createElement('div');
                    element.appendChild(innerElement);

                    animationDevice.scrollElementTo(options);

                    expect(element.style.left).toBe('');
                    expect(innerElement.style.left).toBe('-666px');
                    expect(onComplete).toHaveBeenCalled();
                });
            });
        });
    }
);
