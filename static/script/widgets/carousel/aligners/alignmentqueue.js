/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.aligners.alignmentqueue class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/aligners/alignmentqueue',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';

        function createAlignFunction(self, index, options) {
            return function () {
                options = options || {};
                var oldComplete = options.onComplete;
                var newOptions = {
                    el: options.el,
                    to: options.to,
                    from: options.from,
                    duration: options.duration,
                    easing: options.easing,
                    skipAnim: options.skipAnim,
                    fps: options.fps,
                    onComplete: function onComplete () {
                        if (oldComplete) {
                            oldComplete();
                        }
                        self._next();
                    }
                };

                if (self._skip) {
                    newOptions.skipAnim = true;
                }

                self._mask.alignToIndex(index, newOptions);
            };
        }

        /**
         * A class to handle queue multiple alignments for execution in sequence
         * @class
         * @extends antie.Class
         * @param {Object} mask The carousel's mask object
         */
        return Class.extend({
            init: function init (mask) {
                this._mask = mask;
                this._setSkip(false);
                this._queue = [];
                this._started = false;
            },

            /**
             * Queues an alignment operation
             * @param {Number} index The index of the widget to align on.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            add: function add (index, options) {
                var self = this;

                var alignFunction = createAlignFunction(self, index, options);

                this._queue.push(alignFunction);
            },

            /**
             * Begins executing the alignment operations in the queue. If the
             * queue has already been started, but has not completed, this will
             * do nothing.
             */
            start: function start () {
                if (!this._started) {
                    this._runFirstInQueue();
                }
            },

            /**
             * Completes all queued alignments in order, skipping any animation and
             * firing any associated callbacks in sequence.
             */
            complete: function complete () {
                if (this._started) {
                    this._setSkip(true);
                    this._mask.stopAnimation();
                }
            },

            _runFirstInQueue: function _runFirstInQueue () {
                if (this._queue.length > 0) {
                    this._started = true;
                    this._queue[0]();
                } else {
                    this._setSkip(false);
                    this._started = false;
                }
            },

            _next: function _next () {
                this._queue.shift();
                this._runFirstInQueue();
            },

            _setSkip: function _setSkip (skip) {
                this._skip = skip;
            }
        });
    }
);
