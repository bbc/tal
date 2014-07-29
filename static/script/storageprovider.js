/**
 * @fileOverview Requirejs module for storage provider base class
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def(
	'antie/storageprovider',
	['antie/class'],
	function(Class) {
		var StorageProvider = Class.extend({
			init: function() {
				this._valueCache = {};
			},
			getItem: function(key) {
				return this._valueCache[key];
			},
			setItem: function(key, value) {
				this._valueCache[key] = value;
			},
			removeItem: function(key) {
				delete this._valueCache[key];
			},
			clear: function() {
				this._valueCache = {};
			}
		});

		StorageProvider.STORAGE_TYPE_SESSION = 0;
		StorageProvider.STORAGE_TYPE_PERSISTENT = 1;

		return StorageProvider;
	}
);

