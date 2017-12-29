/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
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

            it('is Empty', function() {
                expect(storage.isEmpty()).toEqual(true);
                storage.setItem('key', {value: true});
                expect(storage.isEmpty()).toEqual(false);
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
                                            mock().storage.Size++;
                                        },
                                        lookup: function(key) {
                                            return mock().storage[key];
                                        },
                                        clear: function() {
                                            mock().storage = {};
                                            mock().storage.Size = 0;
                                        },
                                        hasKey: function(key) {
                                            return mock().storage.hasOwnProperty(key);
                                        }
                                    },
                                    Size: 0
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
