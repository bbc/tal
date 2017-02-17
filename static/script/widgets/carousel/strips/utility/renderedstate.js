/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.renderstate class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/widgets/carousel/strips/utility/renderedstate',
    [
        'antie/widgets/carousel/strips/utility/state'
    ],
    function (State) {
        'use strict';
        var RenderedState;
        RenderedState = State.extend({
            init: function () {

            },

            append: function (context, parent, widget) {
                this._attach(context, parent, widget, 'appendChildElement');
            },

            prepend: function (context, parent, widget) {
                this._attach(context, parent, widget, 'prependChildElement');
            },

            detach: function (/*context, widget*/) {

            },

            hasLength: function () {
                return false;
            },

            inView: function () {
                return false;
            },

            _getDevice: function (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _attach: function (context, parent, widget, attachMethodName) {
                var device = this._getDevice(widget);
                device[attachMethodName](parent.outputElement, widget.outputElement);
                context.setState('ATTACHED');
            }
        });
        return RenderedState;
    }
);
