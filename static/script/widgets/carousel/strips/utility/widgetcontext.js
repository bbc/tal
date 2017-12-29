/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.widgetcontext class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/widgets/carousel/strips/utility/widgetcontext',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var WidgetContext;
        WidgetContext = Class.extend({
            init: function init (widget, parent, STATES) {
                this._widget = widget;
                this._parent = parent;
                this.STATES = STATES;
                this._state = new this.STATES.INIT(this);
            },

            /**
             * Appends output element to parent if not already child
             */
            append: function append () {
                this._state.append(this, this._parent, this._widget);
            },

            /**
             * Prepends output element to parent if not already child
             */
            prepend: function prepend () {
                this._state.prepend(this, this._parent, this._widget);
            },

            /**
             * Element no longer needs to be visible (e.g. remove from DOM)
             */
            detach: function detach () {
                this._state.detach(this, this._widget);
            },

            /**
             * @returns {Boolean} true if widget currently takes up space in its parent, false otherwise
             * e.g. would return true if rendered, in the document and without display: none set
             * would return false if not rendered, not in the DOM or with display: none set
             */
            hasLength: function hasLength () {
                return this._state.hasLength();
            },

            inView: function inView () {
                return this._state.inView();
            },

            setState: function setState (stateName) {
                this._state = new this.STATES[stateName](this);
            }
        });

        return WidgetContext;
    }
);
