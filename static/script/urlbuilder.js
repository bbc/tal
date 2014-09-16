/**
 * @fileOverview Requirejs module containing a class to build URLs from templates
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

require.def('antie/urlbuilder',
	['antie/class'],
	function(Class) {
		'use strict';

		/**
		 * Class to build media URLs from various models
		 * @name antie.URLBuilder
		 * @class
		 * @extends antie.Class
		 * @param {String} urlTemplate The URL template from which to build URLs
		 */
		var URLBuilder = Class.extend(/** @lends antie.URLBuilder.prototype */ {
			/**
			 * Create a new URLBuilder based on a template
			 * @constructor
			 * @ignore
			 */
			init: function(urlTemplate) {
				this._urlTemplate = urlTemplate;
			},
			/**
		 	* Build a URL for a given set of tags.
		 	* @param {String} href The URL to modify.
		 	* @param {Object} tags An object containing additional tags to replace.
		 	* @returns A URL built from the template and the passed values.
		 	*/
			getURL: function(href, tags) {
				var url = this._urlTemplate.replace(/^%href%/, href);

				url = url.replace(/%[a-z]+%/g, function(match) {
					var v;
					if((v = tags[match]) !== undefined) {
						return v;
					}
					return match;
				});

				return encodeURI(url).replace(/'/g, "%27");
			}
		});

		return URLBuilder;
	}
);
