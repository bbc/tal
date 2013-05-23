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
    
    this.OptionsTransitionDefinitionTest = AsyncTestCase("OptionsTransitionDefinition");
    
    function loadOTD(queue, fn) {
        queuedRequire(queue,
            [
                'antie/devices/anim/css3/optionstransitiondefinition',
                'antie/devices/anim/css3/transitiondefinition'
            ],
            fn
        );
    }

    this.OptionsTransitionDefinitionTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.OptionsTransitionDefinitionTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromEmptyOptionsIsEmpty = function(queue) {
        
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition) {
                var trans, options;
                
                options = {};
                
                trans = new OptionsTransitionDefinition(
                    options
                );
               
                assertEquals("definition has correct properties", [], trans.getProperties());
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromOptionsGetsCorrectProperties = function(queue) {
        
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition) {
                var trans, options;
                
                options = {
                    to: {
                        top:    "whatever",
                        left:   "whatever",
                        opacity:    "whatever"
                    }
                };
                
                trans = new OptionsTransitionDefinition(
                    options
                );
               
                assertEquals("definition has correct properties", ["top", "left", "opacity"], trans.getProperties());
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromOptionsGetsCorrectDuration = function(queue) {
        
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition) {
                var trans, options, duration;
                duration = 100;
                options = {
                    to: {
                        top:    "whatever",
                        left:   "whatever",
                        opacity:    "whatever"
                    },
                    duration: duration
                };
                
                trans = new OptionsTransitionDefinition(
                    options
                );
               
                assertEquals("definition has correct duration", duration, trans.getPropertyDuration("top"));
                assertEquals("definition has correct duration", duration, trans.getPropertyDuration("left"));
                assertEquals("definition has correct duration", duration, trans.getPropertyDuration("opacity"));
                   
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromOptionsGetsCorrectTimingFn = function(queue) {    
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition) {
                var trans, options, easing;
                easing = 'linear';
                options = {
                    to: {
                        top:    "whatever",
                        left:   "whatever",
                        opacity:    "whatever"
                    },
                    easing: easing
                };
                
                trans = new OptionsTransitionDefinition(
                    options
                );
               
                assertEquals("definition has correct easing", easing, trans.getPropertyTimingFn("top"));
                assertEquals("definition has correct easing", easing, trans.getPropertyTimingFn("left"));
                assertEquals("definition has correct easing", easing, trans.getPropertyTimingFn("opacity"));
                   
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testTransitionDefinitionCreatedFromOptionsGetsDefaults = function(queue) {    
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition, TransitionDefinition) {
                var trans, options;
                options = {
                    to: {
                        top:    "whatever"
                    }
                };
                
                trans = new OptionsTransitionDefinition(
                    options
                );
               
                assertEquals("definition has default timing fn", TransitionDefinition.defaults.timingFn, trans.getPropertyTimingFn("top"));
                assertEquals("definition has default duration" ,TransitionDefinition.defaults.duration, trans.getPropertyDuration("top"));
                assertEquals("definition has default delay", TransitionDefinition.defaults.delay, trans.getPropertyDelay("top"));         
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testConfigOverridesDefaults = function(queue) {    
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition, TransitionDefinition) {
                var trans, options, config;
                
                config = {
                    duration: 600,
                    easing: 'easeInOut'
                };
                
                options = {
                    to: {
                        top:    "whatever"
                    }
                };
                
                trans = new OptionsTransitionDefinition(
                    options,
                    config
                );
               
                assertEquals("definition has configured timing fn", "ease-in-out", trans.getPropertyTimingFn("top"));
                assertEquals("definition has configured duration", config.duration, trans.getPropertyDuration("top"));
                assertEquals("definition has default easing", TransitionDefinition.defaults.delay, trans.getPropertyDelay("top"));         
            }
        );
    };
    
    this.OptionsTransitionDefinitionTest.prototype.testOptionsOverridesConfig = function(queue) {    
        loadOTD(
            queue, 
            function(OptionsTransitionDefinition, TransitionDefinition) {
                var trans, options, config;
                
                config = {
                    duration: 600,
                    easing: 'easeInOut'
                };
                
                options = {
                    to: {
                        top:    "whatever"
                    },
                    duration: 800,
                    easing: 'linear'
                };
                
                trans = new OptionsTransitionDefinition(
                    options,
                    config
                );
               
                assertEquals("definition has configured timing fn", "linear", trans.getPropertyTimingFn("top"));
                assertEquals("definition has configured duration", options.duration, trans.getPropertyDuration("top"));
                assertEquals("definition has default easing", TransitionDefinition.defaults.delay, trans.getPropertyDelay("top"));         
            }
        );
    };
}());