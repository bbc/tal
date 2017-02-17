/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    var DEFAULT_TWEEN_TIME = 840;

    // It looks like we should only need to tick for 840, the default duration of the animation. However the
    // callback that sorts out the class name doesn't run until tick 866.666666666667 (repeatably). This seems
    // to be because the Shifty timeoutHandler waits for the animation to complete and it's only on the next
    // tick (as determined by the easing function) that the Shifty stop method is called, and it is that which
    // invokes the callback set up in _tween, which in turn updates the class name.
    var DEFAULT_ON_COMPLETE_TIME = 867;

    this.TweenAnimationTest = AsyncTestCase('Animation_Tween');

    this.TweenAnimationTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.TweenAnimationTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.TweenAnimationTest.prototype.testTween = function(queue) {
        expectAsserts(2);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/anim/styletopleft']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer();

            var clock = sinon.useFakeTimers();

            device._tween({
                el: div,
                style: div.style,
                from: {
                    top:'0px'
                },
                to: {
                    top:'100px'
                },
                className: null
            });

            assertEquals(0, Math.round(parseFloat(div.style.top.replace(/px$/,''))));

            clock.tick(DEFAULT_TWEEN_TIME);

            assertEquals(100, Math.round(parseFloat(div.style.top.replace(/px$/,''))));

            clock.restore();

        }, config);
    };

    this.TweenAnimationTest.prototype.testTweenClasses = function(queue) {
        expectAsserts(2);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/anim/styletopleft']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer();

            var clock = sinon.useFakeTimers();

            device._tween({
                el: div,
                style: div.style,
                from: {
                    top:'0px'
                },
                to: {
                    top:'100px'
                },
                className: 'testing'
            });

            assertClassName('testing', div);

            clock.tick(DEFAULT_ON_COMPLETE_TIME);

            assertClassName('nottesting', div);

            clock.restore();

        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/anim/styletopleft'], this.TweenAnimationTest);
})();
