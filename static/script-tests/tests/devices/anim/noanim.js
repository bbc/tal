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
    this.NoAnimAnimationTest = AsyncTestCase("Animation (noanim)");

    this.NoAnimAnimationTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.NoAnimAnimationTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.NoAnimAnimationTest.prototype.testScrollElementTo = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/noanim']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id_mask");
            var inner = device.createContainer("id");
            device.appendChildElement(div, inner);

            queue.call("Scroll element into new position", function(callbacks) {

                var onComplete = callbacks.add(function() {
                    assertEquals(-100, Math.round(parseFloat(inner.style.left.replace(/px$/, ''))));
                    assertEquals(-200, Math.round(parseFloat(inner.style.top.replace(/px$/, ''))));
                });
                device.scrollElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    onComplete: onComplete
                });
            });
        }, config);
    };

    this.NoAnimAnimationTest.prototype.testMoveElementTo = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/noanim']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer("id");

            queue.call("Move element into new position", function(callbacks) {

                var onComplete = callbacks.add(function() {
                    assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/, ''))));
                    assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/, ''))));
                });
                device.moveElementTo({
                    el: div,
                    style: div.style,
                    to: {
                        left: 100,
                        top: 200
                    },
                    skipAnim: true,
                    onComplete: onComplete
                });
            });
        }, config);
    };

    this.NoAnimAnimationTest.prototype.testHideElement = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/noanim']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer();

            queue.call("Hide the element", function(callbacks) {
                var onComplete = callbacks.add(function() {
                    assertEquals(0, Math.round(parseFloat(div.style.opacity)));
                    assertEquals("hidden", div.style.visibility);
                });
                device.hideElement({
                    el: div,
                    onComplete: onComplete
                });
            });
        }, config);
    };

    this.NoAnimAnimationTest.prototype.testShowElement = function(queue) {
        expectAsserts(2);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/noanim']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var div = device.createContainer();


            queue.call("Show the element", function(callbacks) {
                var onComplete = callbacks.add(function() {
                    assertEquals(1, Math.round(parseFloat(div.style.opacity)));
                    assertEquals("visible", div.style.visibility);
                });
                device.showElement({
                    el: div,
                    onComplete: onComplete
                });
            });
        }, config);
    };

    this.NoAnimAnimationTest.prototype.testIsAnimationDisabled = function(queue) {
        expectAsserts(1);

        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/noanim']},"input":{"map":{}},"layouts":[
            {"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application){
            var device = application.getDevice();
            assertTrue(device.isAnimationDisabled());
        }, config);
    }
})();