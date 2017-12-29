/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    var mockSource = {
        getMockData: function(callbacks, succeed) {
            if(succeed) {
                callbacks.onSuccess(['A', 'B', 'C']);
            } else {
                callbacks.onError('Intentional Error');
            }
        }
    };

    this.DataSourceTest = AsyncTestCase('DataSource');

    this.DataSourceTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.DataSourceTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.DataSourceTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/datasource','antie/class'], function(DataSource, Class) {

            assertEquals('DataSource should be a function', 'function', typeof DataSource);
            assert('DataSource should extend from Class', new DataSource() instanceof Class);

        });
    };

    this.DataSourceTest.prototype.testCallsWrappedMethod = function(queue) {
        expectAsserts(1);

        var getMockDataSpy = this.sandbox.spy(mockSource, 'getMockData');

        var callbacks = {
            onSuccess: function() {
            },
            onError: function() {
            }
        };

        queuedRequire(queue, ['antie/datasource'], function(DataSource) {
            var dataSource = new DataSource(null, mockSource, 'getMockData', [true]);
            dataSource.load(callbacks);
            assert(getMockDataSpy.calledWithExactly(callbacks, true));
        });
    };

    this.DataSourceTest.prototype.testCallsOnSuccess = function(queue) {
        expectAsserts(1);

        var callbacks = {
            onSuccess: function() {
            },
            onError: function() {
            }
        };

        var onSuccessSpy = this.sandbox.spy(callbacks, 'onSuccess');

        queuedRequire(queue, ['antie/datasource'], function(DataSource) {
            var dataSource = new DataSource(null, mockSource, 'getMockData', [true]);
            dataSource.load(callbacks);
            assert(onSuccessSpy.calledWithExactly(['A', 'B', 'C']));
        });
    };

    this.DataSourceTest.prototype.testCallsOnError = function(queue) {
        expectAsserts(1);

        var callbacks = {
            onSuccess: function() {
            },
            onError: function() {
            }
        };

        var onErrorSpy = this.sandbox.spy(callbacks, 'onError');

        queuedRequire(queue, ['antie/datasource'], function(DataSource) {
            var dataSource = new DataSource(null, mockSource, 'getMockData', [false]);
            dataSource.load(callbacks);
            assert(onErrorSpy.calledWithExactly('Intentional Error'));
        });
    };
})();
