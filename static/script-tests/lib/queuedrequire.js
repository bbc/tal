/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview Allows requirejs modules to be loaded and tested.
 */

function call__qr(){
	if( require.ready === undefined ) {
		//require.ready not found - delaying queud require
		setTimeout( call__qr, 2000 );
	}
	else{
		__qr();
	}
}

(function(){
	call__qr();
})();

function __qr(){
	var requireModules = {};

	require.ready(function() {
		var originalRequireDef = require.def;
		var originalRequireDefine = require.define;
		var originalRequireLoad = require.load;

		require.def = function() {
			var name = arguments[0];
			requireModules[name] = arguments;
			originalRequireDef.apply(require, arguments);
		};
		require.define = function() {
			var name = arguments[0];
			requireModules[name] = arguments;
			originalRequireDefine.apply(require, arguments);
		};
		require.load = function(moduleName) {
			var module = requireModules[moduleName];
			if(module) {
				require.s.contexts._.specified[moduleName] = true;
				require.s.contexts._.loaded[moduleName] = false;
				setTimeout(function() {
					require.def.apply(require, module);
					require.completeLoad(moduleName, require.s.contexts._);
				}, 0);
				return;
			}
			originalRequireLoad.apply(require, arguments);
		};
	});

	/**
	 * Queues a require module import for asynchronous tests.
	 * @param {Object} queue The queue to add the import to.
	 * @param {Array} deps Array of requirejs modules to load.
	 * @param {function} callback Function to pass loaded requirejs modules to.
	 */
	this.queuedRequire = function(queue, deps, callback) {
		var testCase = queue.q_.testCase_;

		var originalTearDown = testCase.tearDown;

		testCase.tearDown = function() {
			if(originalTearDown) {
				originalTearDown.call(testCase);
			}
			for(var name in requireModules) {
                if(requireModules.hasOwnProperty(name)) {
                    //Allow for anonymous functions
                    if (typeof name === 'string') {
                        delete require.s.contexts._.specified[name];
                        delete require.s.contexts._.defined[name];
                        delete require.s.contexts._.loaded[name];
                    }
                }

			}
		};

		queue.call('Requiring ' + deps.join(","), function(callbacks) {
			var wrappedCallback = callbacks.add(function() {
				callback.apply(testCase, arguments);
			});
			// If an exception is thrown during the execution of a requirejs callback
			// further require calls will fail (e.g. a failing assertion) preventing further
			// execution of the test suite. To avoid this defer the execution using
			// window.setTimeout. If we just catch exceptions here, failing assertions are ignored.
			require(deps, function() {
				var args = arguments;
				window.setTimeout(function() {
					wrappedCallback.apply(testCase, args);
				}, 0);
			});
		});
	};
	
	/**
	 * Queues and loads the specified application.
	 * @param {Object} queue The queue to add the import to.
	 * @param {String} applicationModuleName Module name of the application to run.
	 * @param {Array} otherDeps Array of requirejs modules to load.
	 * @param {function(Application,...)} callback Function to pass loaded Application instance and other requirejs modules to.
	 * @param {Object} [configOverride] Optional device/application onfiguration.
	 */
	this.queuedApplicationInit = function(queue, applicationModuleName, otherDeps, callback, configOverride) {

        var application;
		var testCase = queue.q_.testCase_;
		var originalTearDown = testCase.tearDown;
		var div = document.createElement("div");
		document.body.appendChild(div);

		testCase.tearDown = function() {
			if(originalTearDown) {
				originalTearDown.call(testCase);
			}
			if(application) {
				application.destroy();
				application = null;
			}
			div.parentNode.removeChild(div);
		};
		queuedRequire(queue, [applicationModuleName].concat(otherDeps), function() {
			var requireCallbackArguments = Array.prototype.slice.call(arguments);
			var ApplicationClass = requireCallbackArguments.shift();
			queue.call("Wait for application to be ready", function(callbacks) {
				var onReady = callbacks.add(function() {
                        callback.apply(testCase, [application].concat(requireCallbackArguments));
				});
				application = new ApplicationClass(div, null, null, onReady, configOverride);
			});
		});
	};

}
