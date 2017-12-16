/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.binders.batchbinder class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/binders/batchbinder',
    [
        'antie/widgets/carousel/binder'
    ],
    function (Binder) {
        'use strict';
        /**
         * Allows binding in batches with calculation disabled until after final bind
         * @name antie.widgets.carousel.binders.BatchBinder
         * @class
         * @extends antie.widgets.carousel.Binder
         */
        return Binder.extend(/** @lends antie.widgets.carousel.BatchBinder.prototype */ {
            /**
             * Creates new widgets which are then appended to
             * the widget supplied. Continues until the end of the data returned
             * by the source is reached.
             * @param widget The parent of the widgets to be created.
             */
            appendAllTo: function appendAllTo (widget) {
                this._bindAll(
                    widget,
                    this._appendItem,
                    this._disableAutoCalc,
                    this._enableAutoCalc
                );
            },

            _disableAutoCalc: function _disableAutoCalc (ev) {
                ev.target.autoCalculate(false);
            },

            _enableAutoCalc: function _enableAutoCalc (ev) {
                ev.target.autoCalculate(true);
                ev.target.recalculate();
            }
        });
    }
);
