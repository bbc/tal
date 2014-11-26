window.additionalTestFns = {};

var unloadRequire;
(function () {
	var requireModules = { };

	var originalDef = require.def;
	var originalDefine = require.define;
	var originalLoad = require.load;

	require.def = function() {
		var name = arguments[0];
		requireModules[name] = arguments;
		originalDef.apply(require, arguments);
	};

	require.define = function() {
		var name = arguments[0];
		requireModules[name] = arguments;
		originalDefine.apply(require, arguments);
	};
	require.load = function(moduleName, contextName) {
		var module = requireModules[moduleName];
		if(module) {
			require.s.contexts["_"].specified[moduleName] = true;
			require.s.contexts["_"].loaded[moduleName] = false;
			setTimeout(function() {
				require.def.apply(require, module);
				require.completeLoad(moduleName, require.s.contexts["_"]);
			}, 0);
			return;
		}
		originalLoad.apply(require, arguments);
	};

	unloadRequire = function() {
		for(var name in requireModules) {
			var module = requireModules[name];

			//Allow for anonymous functions
			if (typeof name === 'string') {
				delete require.s.contexts["_"].specified[name];
				delete require.s.contexts["_"].defined[name];
				delete require.s.contexts["_"].loaded[name];
			}
		}
	};
})();


TestCase = function (description, testSuiteClass) {
    var testFns = {};
    var setup;
    var tearDown;
    var otherFns = {};
    window.additionalTestFns[description] = otherFns;

    for (var propertyName in testSuiteClass) {
        var fn = testSuiteClass[propertyName];

        if (propertyName.indexOf("test") === 0) {
            testFns[propertyName] = fn;
        } else if (propertyName === "setUp") {
            setup = fn;
        } else if (propertyName === "tearDown") {
            tearDown = fn;
        } else {
            otherFns[propertyName] = fn;
        }
    }

    var specDefinitions = function () {
        if (setup) {
            beforeEach(setup);
        }

        for (var testName in testFns) {
            it (testName, testFns[testName]);
        }

        var unloadRequireAndTearDown = function () {
            if (tearDown) {
                tearDown();
            }

            unloadRequire();
            validateExpectAsserts.call(this);
        };

        afterEach(unloadRequireAndTearDown);
    };

    describe(description, specDefinitions);
};

testCase = TestCase;

window.testSuites = {};

AsyncTestCase = function (testSuiteName) {
    var testSuite = new Object();
    testSuite.prototype = {};

    window.testSuites[testSuiteName] = testSuite;

    return testSuite;
};

registerTestsWithJasmine = function () {
    for (var testSuiteName in window.testSuites) {
        var testSuiteClass = window.testSuites[testSuiteName];

        var testFns = {};
        var setup;
        var tearDown;

        for (var propertyName in testSuiteClass.prototype) {
            var fn = testSuiteClass.prototype[propertyName];

            if (propertyName.indexOf("test") === 0) {
                testFns[propertyName] = fn;
            } else if (propertyName === "setUp") {
                setup = fn;
            } else if (propertyName === "tearDown") {
                tearDown = fn;
            }
        }

        var specDefinition = function () {
            if (setup) {
                beforeEach(setup);
            }

            for (var testName in testFns) {

                it (testName, createRunAsyncTestFunction(testFns[testName]));
            }

            if (tearDown) {
                afterEach(tearDown);
            }

            afterEach(function () {
                if(window.fakeApplication) {
                    window.fakeApplication.destroy();
                    window.fakeApplication = null;
                }
                var div = document.getElementById("rootWidget");
                if (div) {
                    div.parentNode.removeChild(div);
                }
                unloadRequire();
                validateExpectAsserts.call(this);
            });
        };

        describe(testSuiteName, specDefinition);
    }
};

function validateExpectAsserts() {
    var expectedCount = window._currentExpectedAsserts;
    if (expectedCount !== undefined) {
        var actualCount = this.results().passedCount + this.results().failedCount;
        if (actualCount !== expectedCount) {
            this.fail('Expected ' + expectedCount + ' assertions, got ' + actualCount);
        }
        window._currentExpectedAsserts = undefined;
    }
}

function createRunAsyncTestFunction(testFn) {
    return function () {
        runAsyncTest(testFn);
    };
}

function runAsyncTest(testFn) {
    var testHasRun = false;

    queuedApplicationInit = function(queue, applicationModuleName, otherDeps, testToRun, configOverride) {
        var div = document.createElement("div");
        div.id = "rootWidget";
        document.body.appendChild(div);

        var wrappedTestToRun = function () {
            var loadedModules = arguments;

            var ApplicationClass = loadedModules[0];

            var onReady = function () {
                testToRun.apply(window.jasmineTestThisContext, loadedModules);
                testHasRun = true;
            };

            window.fakeApplication = new ApplicationClass(div, null, null, onReady, configOverride);
            loadedModules[0] = window.fakeApplication;
        };

        require([applicationModuleName].concat(otherDeps), wrappedTestToRun);
    };

    queuedRequire = function(queue, deps, testToRun) {
        var wrappedTestToRun = function () {
            testToRun.apply(window.jasmineTestThisContext, arguments);
            testHasRun = true;
        };

        require(deps, wrappedTestToRun);
    };

    runs(testFn);

    waitsFor(function () {
        return testHasRun;
    });
}


jasmine.Block.prototype.execute = function(onComplete) {
    var otherFns = additionalTestFns[this.spec.suite.description];

    window.jasmineTestThisContext = this.spec;

    for (fnName in otherFns) {
        if (!(fnName in this.spec)) {
            this.spec[fnName] = otherFns[fnName];
        }
    }

    if (!jasmine.CATCH_EXCEPTIONS) {
      this.func.apply(this.spec);
    }
    else {
      try {
        this.func.apply(this.spec);
      } catch (e) {
        this.spec.fail(e);
      }
    }
    onComplete();
};

testCase = TestCase;

expectAsserts = function(count) {
    window._currentExpectedAsserts = count;
};

assert = function (msg, condition) {
    if (arguments.length < 2) {
        condition = msg;
    }
    expect(condition).toBe(true);
};

assertTrue = assert;

assertFalse = function (msg, condition) {
    if (arguments.length < 2) {
        condition = msg;
    }
    expect(condition).toBe(false);
};

assertEquals = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    };
    expect(thing2).toEqual(thing1);
};

assertNotEquals = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    };
    expect(thing2).not.toEqual(thing1);
};

assertSame = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    };
    expect(thing2).toBe(thing1);
};

assertNotSame = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    };
    expect(thing2).not.toBe(thing1);
};

assertNull = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(thing).toBe(null);
};

assertNotNull = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(thing).not.toBe(null);
};

assertInstanceOf = function (msg, clazz, thing) {
    if (arguments.length < 3) {
        thing = clazz;
        clazz = msg;
    };
    expect(thing instanceof clazz).toBe(true);
};

assertUndefined = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(thing).toBeUndefined();
};

assertNotUndefined = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(thing).toBeDefined();
};

assertObject = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(thing instanceof Object).toBe(true);
};

assertFunction = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }
    expect(typeof thing).toBe("function");
};

assertException = function (msg, fn, error) {
    if (arguments.length < 2) {
        fn = msg;
    } else if (arguments.length === 2 &&  typeof(msg) === "function") {
        error = fn;
        fn = msg;
    }

    expect(fn).toThrow();
};

assertNoException = function (msg, fn) {
    if (arguments.length < 2) {
        fn = msg;
    }

    expect(fn).not.toThrow();
};

assertClassName = function (msg, className, element) {
    if (arguments.length < 3) {
        element = className;
        className = msg;
    }

    var classes = element.className.split(" ");

    expect(classes).toContain(className);
};

assertMatch = function (msg, regex, actual) {
	if (arguments.length < 3) {
		actual = regex;
		regex = msg;
	}

	expect(regex.test(actual)).toBe(true);
};

assertNoMatch = function (msg, regex, actual) {
	if (arguments.length < 3) {
		actual = regex;
		regex = msg;
	}

	expect(regex.test(actual)).toBe(false);
};

assertBoolean = function (msg, thing) {
    if (arguments.length < 2) {
        thing = msg;
    }

    expect(typeof thing).toBe("boolean");
};
