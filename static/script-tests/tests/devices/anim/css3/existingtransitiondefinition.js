/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    var mockTransElement, properties, durations, delays, timingFns;

    this.ExistingTransitionDefinitionTest = AsyncTestCase('ExistingTransitionDefinition');

    function loadETD(queue, fn) {
        queuedRequire(queue,
            ['antie/devices/anim/css3/existingtransitiondefinition'],
            fn
        );
    }

    this.ExistingTransitionDefinitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        properties = ['top', 'left', 'opacity'];
        durations = [300, 400, 500];
        delays = [0, 0, 10];
        timingFns = ['linear', 'easeIn', 'easeOut'];

        mockTransElement = {
            getProperties: function() {
                return properties;
            },
            getDurations: function() {
                return durations;
            },
            getDelays: function() {
                return delays;
            },
            getTimingFns: function() {
                return timingFns;
            }
        };
    };

    this.ExistingTransitionDefinitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.ExistingTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedCorrectlyFromElement = function(queue) {

        loadETD(
            queue,
            function(ExisitingTransitionDefinition) {
                var trans, i, numberOfProperties, property;
                trans = new ExisitingTransitionDefinition(
                    mockTransElement
                );

                numberOfProperties = properties.length;
                expectAsserts((properties.length * 3) + 2);
                // check we're testing something
                assert(numberOfProperties > 0);
                assertEquals('definition has correct properties', properties, trans.getProperties());

                for(i = 0; i !== numberOfProperties; i += 1) {
                    property = properties[i];
                    assertEquals('property has correct duration', durations[i], trans.getPropertyDuration(property));
                    assertEquals('property has correct delay', delays[i], trans.getPropertyDelay(property));
                    assertEquals('property has correct timing function', timingFns[i], trans.getPropertyTimingFn(property));
                }
            }
        );
    };
}());
