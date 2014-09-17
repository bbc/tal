/**
 * @fileOverview Requirejs modifier for animations based on scroll offsets
 *
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

require.def(
    'antie/devices/anim/tween',
    [
     'antie/devices/browserdevice',
     'antie/lib/shifty'
     ],
     function(Device, Tweenable) {
        'use strict';

        // A set of queues of DOM updates to perform. Each animation framerate gets its own queue
        // so they are in sync between themselves.
        var animQueues = {};

        /**
         * Internal function: given a new tween value for an animation, add it to a queue
         * of DOM manipulations to be performed at the next update. If there is no queue yet,
         * create it and start the update cycle after half a frame has elapsed, to give other
         * animation updates a chance to come in.
         */
        function addTweenToQueue(options, tweenValues) {
            // A separate queue exists for each framerate. Get or create the appropriate queue.
            var queueKey = 'fps' + options.fps;
            var frameIntervalMs = 1000 / options.fps;
            var queue = animQueues[queueKey];

            // Create a new queue if one doesn't already exist (implemented as an array).
            if (!queue) {
                queue = [];
                animQueues[queueKey] = queue;
            }

            // Start processing the queue periodically if we're not already.
            // Wait half a frame before starting the first cycle - gives other animation updates at
            // the same frame rate a chance to come in.
            if (!queue.isProcessing) {
                queue.isProcessing = true;
                setTimeout(function() { startIntervalTimer(queue, frameIntervalMs); }, frameIntervalMs / 2);

                // First tween in a cycle should be applied immediately. It contains initial values.
                step(options, tweenValues);
            }
            else {
                // Queue is already being processed. Add the new entry to the queue.
                queue.push({options: options, values: tweenValues});
            }
        }

        /**
         * Internal function: When we receive a callback to say an animation
         * has completed (either it's been cancelled or it's finished), drain
         * any outstanding steps from the queue. This ensures that in the case
         * of clients cancelling the animation, the element stops being updated
         * immediately.
         */
        function drainTweensFromQueue(options) {
            var queue, i, q;
            queue = animQueues['fps' + options.fps];
            if (queue) {
                for (i = 0; i < queue.length; i++) {
                    q = queue[i];
                    if (q.options === options) {
                        step(q.options, q.values);
                        queue.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        /**
         * Internal function. Start a periodic interval timer for a given framerate.
         */
        function startIntervalTimer(queue, period) {
            // Store timer ID with the queue to allow it to be stopped later.
            queue.intervalId = setInterval(function() { processQueue(queue); }, period);
        }

        /**
         * Internal function. To be called periodically on a queue of operations. Apply each update to the
         * DOM, then clear the queue ready to be refilled. Stop the periodic timer if the queue remains empty.
         */
        function processQueue(queue) {
            // Is the queue still empty after it was last cleared? Stop the timer - the animations have
            // probably finished and will not provide any further updates.
            if (queue.length === 0) {
                clearInterval(queue.intervalId);
                queue.isProcessing = false;
                queue.intervalId = null;
            }
            else {
                // We have some DOM updates to do. Do each one in sequence, then clear the queue ready for the next round.
                try {
                    for (var i = 0; i < queue.length; i++) {
                        var q = queue[i];
                        step(q.options, q.values);
                    }
                }
                finally {
                    // Truncating the array length to zero clears it.
                    queue.length = 0;
                }
            }
        }

        /**
         * Internal function. Perform the DOM updates required for the update.
         */
        function step(options, tweenValues) {
            for (var p in options.to) {
                if (tweenValues[p] !== null && tweenValues[p] !== undefined) {
                    if (/scroll/.test(p)) {
                        options.el[p] = tweenValues[p];
                    } else {
                        options.el.style[p] = tweenValues[p];
                    }
                }
            }
        }

        Device.prototype._tween = function (options) {
            var anim = new Tweenable(options);
            var self = this;

            var opts = {
                    el: options.el,
                    initialState: options.from || {},
                    from: options.from || {},
                    to: options.to || {},
                    duration: options.duration || 840,
                    easing: options.easing || 'easeFromTo',
                    fps: options.fps || 25,
                    start: function() {
                        if (options.className) {
                            self.removeClassFromElement(options.el, "not" + options.className);
                            self.addClassToElement(options.el,  options.className);
                        }
                        self.removeClassFromElement(self.getTopLevelElement(), "notanimating");
                        self.addClassToElement(self.getTopLevelElement(), "animating");
                        if (options.onStart) {
                            options.onStart();
                        }
                    },
                    step: function () {
                        addTweenToQueue(opts, this);
                    },
                    callback: function () {
                        if(options.className) {
                            self.removeClassFromElement(options.el, options.className);
                            self.addClassToElement(options.el, "not" + options.className);
                        }
                        self.removeClassFromElement(self.getTopLevelElement(), "animating");
                        self.addClassToElement(self.getTopLevelElement(), "notanimating");
                        // Send this animation to its final state immediately.
                        drainTweensFromQueue(opts);
                        if (this) {
                            step(opts, this);
                        }
                        // Fire client callback if it exists
                        if (typeof options.onComplete === 'function') {
                            options.onComplete();
                        }
                    }
            };

            anim.tween(opts);

            return anim;
        };
    }
);