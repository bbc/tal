/**
 * @fileOverview Requirejs module containing base antie.Formatter class.
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

require.def("antie/formatter",
	[
		"antie/class"
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
			init: function(opts) {
				if (opts) {
					this._opts = opts;
				}
			},
			/**
			 * Formats data from the iterator.
			 * @param {antie.Iterator} iterator An iterator pointing to the data to be formatted.	
			 * @returns A antie.widgets.Widget object representing one or more data items from the iterator.
			 */
			format: function(iterator) {
				throw new Error("Not implemented (Formatter::format). A formatter class does not implement its format method.");
			}
		});
	}
);
