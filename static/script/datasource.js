/**
 * @fileOverview Requirejs module containing base antie.DataSource class.
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

require.def('antie/datasource',
	['antie/class'],
	function(Class) {
		'use strict';

		/**
		 * Utility class to wrap disparate functions into a common interface for binding to lists.
		 * @name antie.DataSource
		 * @class
		 * @extends antie.Class
		 * @param {antie.widgets.Component} component Component which 'owns' this data.
		 * @param {Object} obj Object on which to call 'func' method.
		 * @param {String} func Name of function to call.
		 * @param {Array} args Arguments to pass the function.
		 */
		return Class.extend(/** @lends antie.DataSource.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(component, obj, func, args) {
				this._request = null;
				this._component = component;
				this._obj = obj;
				this._func = func;
				this._args = args;


	
				if(component) {
					var self = this;

					var beforeHideListener = function() {
						component.removeEventListener('beforehide', beforeHideListener);
						self.abort();
					};
					component.addEventListener('beforehide', beforeHideListener);
				}
			},
			/**
		 	 * Performs the request for data.
		 	 * @param {Object} callbacks Object containing onSuccess and onError callback functions.
			 */
			load: function(callbacks) {
				this._request = this._obj[this._func].apply(this._obj, [callbacks].concat(this._args || []));
			},
			/**
		 	 * Aborts a currently loading request.
			 */
			abort: function() {
				if(this._request) {
					this._request.abort();
				}
			}
		});
	}
);
