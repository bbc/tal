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
            init: function init () {
                // implement in child
            },

            append: function append (/*context, parent, widget*/) {
                // implement in child
            },

            prepend: function prepend (/*context, parent, widget*/) {
                // implement in child
            },

            detach: function detach (/*context, widget*/) {
                // implement in child
            },

            hasLength: function hasLength () {
                // implement in child
            },

            inView: function inView () {
                // implement in child
            }
        });
        return State;
    }
);
