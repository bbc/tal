/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.StorageProviderTest = AsyncTestCase('Storage (Base Provider)');

    this.StorageProviderTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.StorageProviderTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    this.StorageProviderTest.prototype.testGetSessionStorage = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':[]},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            assertInstanceOf(StorageProvider, application.getDevice().getStorage(StorageProvider.STORAGE_TYPE_SESSION, 'test'));
        }, config);
    };

    this.StorageProviderTest.prototype.testGetPersistentStorage = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/storage/cookie']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/storageprovider'], function(application, StorageProvider) {
            assertInstanceOf(StorageProvider, application.getDevice().getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, 'test'));
        }, config);
    };
})();
