/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.initstate class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/utility/initstate',
    [
        'antie/widgets/carousel/strips/utility/state'
    ],
    function (State) {
        'use strict';
        var InitState;
        InitState = State.extend({
            init: function init () {
            },

            append: function append (context, parent, widget) {
                this._render(widget);
                this._attach(context, parent, widget, 'appendChildElement');
            },

            prepend: function prepend (context, parent, widget) {
                this._render(widget);
                this._attach(context, parent, widget, 'prependChildElement');
            },

            detach: function detach (/*context, widget*/) {
            },

            hasLength: function hasLength () {
                return false;
            },

            inView: function inView () {
                return false;
            },

            _getDevice: function _getDevice (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _render: function _render (widget) {
                var device = this._getDevice(widget);
                widget.render(device);
            },

            _attach: function _attach (context, parent, widget, attachMethodName) {
                var device = this._getDevice(widget);
                device[attachMethodName](parent.outputElement, widget.outputElement);
                context.setState('ATTACHED');
            }
        });

        return InitState;
    }
);
