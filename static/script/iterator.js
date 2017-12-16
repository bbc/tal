/**
 * @fileOverview Requirejs module containing base antie.Iterator class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/iterator',
    ['antie/class'],
    function(Class) {
        'use strict';

        /**
         * Base iterator. Keeps a reference to an array of objects and the current position within it.
         * @name antie.Iterator
         * @class
         * @extends antie.Class
         * @param {Array} array The array of data this iterator iterates through.
         */
        return Class.extend(/** @lends antie.Iterator.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (array) {
                this._array = array || [];
                this.reset();
            },
            /**
             * Sets the iterator pointer to the first item
             */
            reset: function reset () {
                this._currentIndex = 0;
            },
            /**
             * Checks if there are more items the iterator can return.
             * @returns Boolean true if the following call to next() will return an object.
             * @see #next
             */
            hasNext: function hasNext () {
                return (this._currentIndex < this._array.length);
            },
            /**
             * Returns the next item and increments the iterator.
             * @returns The next item from the iterator, or undefined if there are no more items.
             * @see #next
             */
            next: function next () {
                if(this.hasNext()) {
                    return this._array[this._currentIndex++];
                } else {
                    return undefined;
                }
            },
            /**
             * Returns the next item but does not increment the iterator
             * @returns The next item from the iterator, or undefined if there are no more items.
             * @see #next
             */
            peek: function peek () {
                return this._array[this._currentIndex];
            },
            /**
             * Returns the the pointer value.
             * @returns The pointer value
             */
            getPointer: function getPointer () {
                return this._currentIndex;
            },
            isEmpty: function isEmpty () {
                return this._array.length === 0;
            },
            /**
             * Returns the length of the array.
             * @returns The length of the array
             */
            getLength: function getLength () {
                return this._array.length;
            }
        });
    }
);
