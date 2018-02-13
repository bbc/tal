/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.hiddenstate class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/utility/hiddenstate',
    [
        'antie/widgets/carousel/strips/utility/state'
    ],
    function (State) {
        'use strict';
        var RenderedState;
        RenderedState = State.extend({
            init: function init () {

            },

            append: function append (context, parent, widget) {
                this._show(context, widget);
            },

            prepend: function prepend (context, parent, widget) {
                this._show(context, widget);
            },

            detach: function detach (/*context, widget*/) {

            },

            hasLength: function hasLength () {
                return true;
            },

            inView: function inView () {
                return false;
            },

            _getDevice: function _getDevice (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _show: function _show (context, widget) {
                widget.getCurrentApplication().getDevice().showElement({el: widget.outputElement, skipAnim: true});
                context.setState('ATTACHED');
            }
        });
        return RenderedState;
    }
);
