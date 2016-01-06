/**
 * @preserve Copyright (c) 2015 British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

require(
    [
        'antie/devices/storage/xboxpls',
        'antie/devices/data/nativejson',
        'antie/devices/browserdevice'
    ],
    function(XBoxStorage, NativeJson, Device) {
        'use strict';

        var device,
            storage,
            hasMockAPI;

        describe('Xbox device storage', function() {
            beforeEach(function () {
                mock().storage = {};
                device = new Device({});
                storage = device.getPersistentStorage('namespace');
            });

            afterEach(function() {
                unMock();
            });

            it('reads and writes', function() {
                storage.setItem('key', {value: true});
                expect(storage.getItem('key')).toEqual({value: true});
            });

            it('removes an item', function () {
                storage.setItem('removable', {value: true});
                storage.removeItem('removable');
                expect(storage.getItem('removable')).toBe(undefined);
            });

            it('clears items', function() {
                storage.setItem('clearable', {value: true});
                storage.clear();
                expect(mock().storage).toEqual({});
            });
        });

        function mock() {
            if (!window.Windows) {
                hasMockAPI = true;

                window.Windows = {
                    Storage: {
                        ApplicationData: {
                            current: {
                                localSettings: {
                                    values: {
                                        insert: function(key, value) {
                                            mock().storage[key] = value;
                                        },
                                        lookup: function(key) {
                                            return mock().storage[key];
                                        },
                                        clear: function() {
                                            mock().storage = {};
                                        },
                                        hasKey: function(key) {
                                            return mock().storage.hasOwnProperty(key);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            }
            return window.Windows.Storage.ApplicationData.current.localSettings.values;
        }

        function unMock() {
            if (hasMockAPI) {
                delete window.Windows;
                hasMockAPI = false;
            }
        }
    }
);
