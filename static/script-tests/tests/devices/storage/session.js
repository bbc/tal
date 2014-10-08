/**
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

(function() {
	this.SessionStorageProviderTest = AsyncTestCase("Storage_Session");

	var stores;

	this.SessionStorageProviderTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
		stores = [];
	};

	this.SessionStorageProviderTest.prototype.tearDown = function() {
		this.sandbox.restore();
		for(var i=0; i<stores.length; i++) {
			stores[i].clear();
		}
	};

	var getStorage = function(application, storageType, namespace) {
		var storage = application.getDevice().getStorage(storageType, namespace);
		stores.push(storage);
		return storage;
	};

	this.SessionStorageProviderTest.prototype.testNamespaceRecoverable = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");
			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");

			assertSame(storage1, storage2);
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testStringRecoverable = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");
			storage1.setItem("hello", "world");

			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");
			var val = storage2.getItem("hello");

			assertEquals("world", val);
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testObjectRecoverable = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var obj = {
				"hello": ["house","street","town","region","country","continent","world","solar system","galaxy", "universe"]
			};

			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");
			storage1.setItem("hello", obj);

			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test");
			var val = storage2.getItem("hello");

			assertEquals(obj, val);
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testNamespaceIsolated = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test1");
			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test2");

			assertNotSame(storage1, storage2);
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testValueIsolated = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test1");
			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test2");

			storage1.setItem("hello", "world");
			assertUndefined(storage2.getItem("hello"));
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testRemoveItem = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test1");

			storage.setItem("hello", "world");
			assertEquals("world", storage.getItem("hello"));

			storage.removeItem("hello");
			assertUndefined(storage.getItem("hello"));
		}, config);
	};

	this.SessionStorageProviderTest.prototype.testRemoveItemIsolated = function(queue) {
		expectAsserts(4);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/storageprovider'], function(application, StorageProvider) {
			var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test1");
			var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_SESSION, "test2");

			storage1.setItem("hello", "world");
			assertEquals("world", storage1.getItem("hello"));
			storage2.setItem("hello", "world");
			assertEquals("world", storage2.getItem("hello"));

			storage1.removeItem("hello");
			assertUndefined(storage1.getItem("hello"));
			assertEquals("world", storage2.getItem("hello"));
		}, config);
	};

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/storage/session'], this.SessionStorageProviderTest);

})();
