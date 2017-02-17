/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.state class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/utility/state',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var State;
        State = Class.extend({
            init: function () {
                // implement in child
            },

            append: function (/*context, parent, widget*/) {
                // implement in child
            },

            prepend: function (/*context, parent, widget*/) {
                // implement in child
            },

            detach: function (/*context, widget*/) {
                // implement in child
            },

            hasLength: function () {
                // implement in child
            },

            inView: function () {
                // implement in child
            }
        });
        return State;
    }
);
