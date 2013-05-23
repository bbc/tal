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
    var mockTransElement, properties, durations, delays, timingFns;
    
    this.ExistingTransitionDefinitionTest = AsyncTestCase("ExistingTransitionDefinition");
    
    function loadETD(queue, fn) {
        queuedRequire(queue,
            ['antie/devices/anim/css3/existingtransitiondefinition'],
            fn
        );
    }

    this.ExistingTransitionDefinitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        properties = ["top", "left", "opacity"];
        durations = [300, 400, 500];
        delays = [0, 0, 10];
        timingFns = ["linear", "easeIn", "easeOut"];
        
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
                assertEquals("definition has correct properties", properties, trans.getProperties());
                
                for(i = 0; i !== numberOfProperties; i += 1) {
                    property = properties[i];
                    assertEquals("property has correct duration", durations[i], trans.getPropertyDuration(property));
                    assertEquals("property has correct delay", delays[i], trans.getPropertyDelay(property));
                    assertEquals("property has correct timing function", timingFns[i], trans.getPropertyTimingFn(property));
                }
            }
        );
    };
}());