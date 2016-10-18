/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.hiddenstate class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
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
            init: function () {

            },

            append: function (context, parent, widget) {
                this._show(context, widget);
            },

            prepend: function (context, parent, widget) {
                this._show(context, widget);
            },

            detach: function (/*context, widget*/) {

            },

            hasLength: function () {
                return true;
            },

            inView: function () {
                return false;
            },

            _getDevice: function (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _show: function (context, widget) {
                widget.getCurrentApplication().getDevice().showElement({el: widget.outputElement, skipAnim: true});
                context.setState('ATTACHED');
            }
        });
        return RenderedState;
    }
);
