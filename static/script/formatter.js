/**
 * @fileOverview Requirejs module containing base antie.Formatter class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/formatter',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';

        /**
         * Base formatter. Takes an iterator to a data source and returns a widget tree to represent one or more items of data.
         * @name antie.Formatter
         * @class
         * @abstract
         * @extends antie.Class
         * @requires antie.Iterator
         */
        return Class.extend(/** @lends antie.Formatter.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (opts) {
                if (opts) {
                    this._opts = opts;
                }
            },
            /**
             * Formats data from the iterator.
             * @param {antie.Iterator} iterator An iterator pointing to the data to be formatted.
             * @returns A antie.widgets.Widget object representing one or more data items from the iterator.
             */
            format: function format (/*iterator*/) {
                throw new Error('Not implemented (Formatter::format). A formatter class does not implement its format method.');
            }
        });
    }
);
