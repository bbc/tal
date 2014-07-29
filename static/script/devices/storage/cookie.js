/**
 * @fileOverview Requirejs modifier for default XHR-based network operations
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def(
	'antie/devices/storage/cookie',
	[
		'antie/devices/browserdevice',
		'antie/storageprovider'
	],
	function(Device, StorageProvider) {
		// This is mostly lifted from http://www.quirksmode.org/js/cookies.html
		// Do we have license issues to worry about?

		var namespaces = {};

		var default_days = 366;
		var pathParts = document.location.pathname.split("/");
		pathParts.pop();
		var path = pathParts.join("/") + "/";

		function createCookie(namespace, value, days) {
			value = encodeURIComponent(value);
			days = days || default_days;
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
			document.cookie = namespace + "=" + value + expires + "; path=" + path;
		}

		function readCookie(namespace) {
			var nameEQ = namespace + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nameEQ) === 0) {
					return decodeURIComponent(c.substring(nameEQ.length, c.length));
				}
			}
			return null;
		}

		function eraseCookie(namespace) {
			createCookie(namespace, "", -1);
		}

		var CookieStorage = StorageProvider.extend({
			init: function(namespace) {
				this._super();

				this._namespace = namespace;

				var cookie = readCookie(namespace);

				if(cookie) {
					this._valueCache = Device.prototype.decodeJson(cookie);
					if(this._valueCache) {
						this._save();
					} else {
						this._valueCache = {};
					}
				}
			},
			setItem: function(key, value) {
				this._super(key, value);
				this._save();
			},
			removeItem: function(key) {
				this._super(key);
				this._save();
			},
			clear: function() {
				this._super();
				this._save();

				// delete it from the stored namespaces
				// so it will be reloaded the next time
				// we get it
				delete namespaces[this._namespace];
			},
			_isEmpty: function() {
				var prop;
				for(prop in this._valueCache) {
					return false;
				}
				return true;
			},
			_save: function() {
				if(this._isEmpty()) {
					eraseCookie(this._namespace);
				} else {
					var json = Device.prototype.encodeJson(this._valueCache);
					createCookie(this._namespace, json);
				}
			}
		});

		Device.prototype.getPersistentStorage = function(namespace) {
			if(!namespaces[namespace]) {
				namespaces[namespace] = new CookieStorage(namespace);
			}
			return namespaces[namespace];
		};
	}
);

