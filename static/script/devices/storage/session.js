/**
 * @fileOverview Requirejs module to present temporary storage for the session
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def(
	'antie/devices/storage/session',
	['antie/storageprovider'],
	function(StorageProvider) {
		var namespaces = {};
		var SessionStorage = StorageProvider.extend({});

		SessionStorage.getNamespace = function(namespace) {
			if(!namespaces[namespace]) {
				namespaces[namespace] = new SessionStorage();
			}
			return namespaces[namespace];
		};

		return SessionStorage;
	}
);

