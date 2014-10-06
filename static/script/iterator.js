/**
 * @fileOverview Requirejs module containing antie.Application class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def('antie/iterator',
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
			init: function(array) {
				this._array = array || [];
				this.reset();
			},
			/**
			 * Sets the iterator pointer to the first item
			 */
			reset: function() {
				this._currentIndex = 0;
			},
			/**
			 * Checks if there are more items the iterator can return.
			 * @returns Boolean true if the following call to next() will return an object.
			 * @see #next
			 */
			hasNext: function() {
				return (this._currentIndex < this._array.length);
			},
			/**
			 * Returns the next item and increments the iterator.
			 * @returns The next item from the iterator, or undefined if there are no more items.
			 * @see #next
			 */
			next: function() {
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
			peek: function() {
				return this._array[this._currentIndex];
			},
			/**
			 * Returns the the pointer value.
			 * @returns The pointer value
			 */
			getPointer: function() {
				return this._currentIndex;
			},
			isEmpty: function() {
				return this._array.length == 0;
			},
			/**
			 * Returns the length of the array.
			 * @returns The length of the array
			 */
			getLength: function () {
				return this._array.length;
			}
		});
	}
);
