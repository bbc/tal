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

	var mockSource = {
		getMockData: function(callbacks, succeed) {
			if(succeed) {
				callbacks.onSuccess(['A', 'B', 'C']);
			} else {
				callbacks.onError('Intentional Error');
			}
		}
	};

	this.DataSourceTest = AsyncTestCase("DataSource");

	this.DataSourceTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.DataSourceTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.DataSourceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/datasource","antie/class"], function(DataSource, Class) {

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

		queuedRequire(queue, ["antie/datasource"], function(DataSource) {
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

		queuedRequire(queue, ["antie/datasource"], function(DataSource) {
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

		queuedRequire(queue, ["antie/datasource"], function(DataSource) {
			var dataSource = new DataSource(null, mockSource, 'getMockData', [false]);
			dataSource.load(callbacks);
			assert(onErrorSpy.calledWithExactly('Intentional Error'));
		});
	};
})();
