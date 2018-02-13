/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.attachedstate class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/utility/attachedstate',
    [
        'antie/widgets/carousel/strips/utility/state'
    ],
    function (State) {
        'use strict';
        var AttachedState;
        AttachedState = State.extend({
            init: function init () {

            },

            append: function append (/*context, parent, widget*/) {

            },

            prepend: function prepend (/*context, parent, widget*/) {

            },

            detach: function detach (context, widget) {
                var device = this._getDevice(widget);
                device.removeElement(widget.outputElement);
                context.setState('RENDERED');
            },

            hasLength: function hasLength () {
                return true;
            },

            inView: function inView () {
                return true;
            },

            _getDevice: function _getDevice (widget) {
                return widget.getCurrentApplication().getDevice(widget);
            }
        });
        return AttachedState;
    }
);
