/**
 * @fileOverview Requirejs module containing base antie.DataSource class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/datasource',
	['antie/class'],
	function(Class) {
		/**
		 * Utility class to wrap disperate functions into a common interface for binding to lists.
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
					component.addEventListener('beforehide', function() {
						component.removeEventListener('beforehide', arguments.callee);
						self.abort();
					});
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
