/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.CookieStorageProviderTest = AsyncTestCase('Storage_Cookie');

    var stores;

    this.CookieStorageProviderTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        stores = [];
    };

    this.CookieStorageProviderTest.prototype.tearDown = function() {
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

    this.CookieStorageProviderTest.prototype.testNamespaceRecoverable = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');
            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');

            assertSame(storage1, storage2);
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testStringRecoverable = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');
            storage1.setItem('hello', 'world');

            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');
            var val = storage2.getItem('hello');

            assertEquals('world', val);
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testObjectRecoverable = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var obj = {
                'hello': ['house','street','town','region','country','continent','world','solar system','galaxy', 'universe']
            };

            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');
            storage1.setItem('hello', obj);

            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test');
            var val = storage2.getItem('hello');

            assertEquals(obj, val);
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testNamespaceIsolated = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');
            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test2');

            assertNotSame(storage1, storage2);
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testValueIsolated = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');
            storage1.setItem('hello', 'world');

            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test2');

            assertUndefined(storage2.getItem('hello'));
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testRemoveItem = function(queue) {
        expectAsserts(2);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');

            storage.setItem('hello', 'world');
            assertEquals('world', storage.getItem('hello'));

            storage.removeItem('hello');
            assertUndefined(storage.getItem('hello'));
        }, config);
    };

    this.CookieStorageProviderTest.prototype.testRemoveItemIsolated = function(queue) {
        expectAsserts(4);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage1 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');
            var storage2 = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test2');

            storage1.setItem('hello', 'world');
            assertEquals('world', storage1.getItem('hello'));
            storage2.setItem('hello', 'world');
            assertEquals('world', storage2.getItem('hello'));

            storage1.removeItem('hello');
            assertUndefined(storage1.getItem('hello'));
            assertEquals('world', storage2.getItem('hello'));
        }, config);
    };


    this.CookieStorageProviderTest.prototype.testCookiesAreRead = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/nativejson','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var obj = {
                'hello': ['house','street','town','region','country','continent','world','solar system','galaxy', 'universe']
            };
            document.cookie = 'test1=' + encodeURIComponent(application.getDevice().encodeJson(obj));

            var storage = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');

            var val = storage.getItem('hello');
            assertEquals(obj.hello, val);

        }, config);
    };

    this.CookieStorageProviderTest.prototype.testCookiesAreSet = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var obj = {
                'hello': ['house','street','town','region','country','continent','world','solar system','galaxy', 'universe']
            };
            var str = 'test1=' + encodeURIComponent(application.getDevice().encodeJson(obj));

            var storage = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');
            storage.setItem('hello', obj.hello);

            assertMatch(new RegExp(str), document.cookie);

        }, config);
    };

    this.CookieStorageProviderTest.prototype.isEmpty = function(queue) {
        expectAsserts(2);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/data/json2','antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            var storage = getStorage(application, StorageProvider.STORAGE_TYPE_PERSISTENT, 'test1');

            assertEquals(true, storage.isEmpty());

            storage.setItem('hello');
            assertEquals(false, storage.isEmpty());
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/storage/cookie'], this.CookieStorageProviderTest);
})();
