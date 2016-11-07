require(
    [
        'antie/devices/browserdevice',
        'antie/runtimecontext',
        'antie/devices/anim/css3transform' // adds methods to Device.prototype
    ],
    function (BrowserDevice, RuntimeContext) {
        'use strict';

        var device = new BrowserDevice(antie.framework.deviceConfiguration);
        var element, maskElement;

        describe('CSS3 Transform Animation Modifier', function () {
            beforeEach(function () {
                spyOn(RuntimeContext, 'getCurrentApplication').andReturn({
                    getDevice: function () {
                        return device;
                    }
                });

                element = document.createElement('div');
                maskElement = document.createElement('div');
                maskElement.id = 'the_mask';
                maskElement.appendChild(element);
            });

            it('indicates animation is not disabled', function () {
                expect(device.isAnimationDisabled()).toBe(false);
            });

            describe('common behaviour across animation methods', function () {
                var animationMethods = [
                    {
                        name: 'moveElementTo',
                        to: {
                            top: 666
                        }
                    },
                    {
                        name: 'tweenElementStyle',
                        to: {
                            width: 666
                        }
                    },
                    {
                        name: 'showElement',
                        animatesAfterTick: true
                    }
                ];

                animationMethods.forEach(function (method) {
                    describe('for ' + method.name, function () {
                        function callMethod(options) {
                            options = options || {};
                            options.el = element;
                            options.to = method.to;

                            device[method.name](options);

                            if (method.animatesAfterTick) {
                                jasmine.Clock.tick(1);
                            }
                        }

                        beforeEach(function () {
                            jasmine.Clock.useMock();
                        });

                        it('does not add animate class to element when animation is being skipped (via options)', function () {
                            callMethod({
                                skipAnim: true
                            });
                            expect(element.classList.contains('animate')).toBe(false);
                        });

                        it('does not add animate class to element when animation is being skipped (via device config)', function () {
                            spyOn(RuntimeContext.getCurrentApplication().getDevice(), 'getConfig').andReturn({
                                animationDisabled: true
                            });

                            callMethod();
                            expect(element.classList.contains('animate')).toBe(false);
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

                            it('adds animate class to element', function () {
                                expect(element.classList.contains('animate')).toBe(true);
                            });

                            it('removes animate class when transition ends', function () {
                                simulateTransitionEnd();
                                expect(element.classList.contains('animate')).toBe(false);
                            });

                            it('calls back only when transition ends', function () {
                                expect(callback).not.toHaveBeenCalled();
                                simulateTransitionEnd();
                                expect(callback).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    }
);