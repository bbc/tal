/**
 * @fileOverview Requirejs module containing a class to build URLs from templates
 *
 * @version 1.0.0
 * @author Chris Warren <chris.warren@bbc.co.uk>
 */

require.def('antie/urlbuilder',
	['antie/class'],
	function(Class) {
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
