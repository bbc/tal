window.additionalTestFns = {};

var unloadRequire;
(function () {
    var requireModules = { };
    
    var originalDef = require.def;
    var originalDefine = define;
    var originalLoad = require.load;

    require.def = function() {
        var name = arguments[0];
        requireModules[name] = arguments;
        originalDef.apply(require, arguments);
    };
    
    define = function() {
        var name = arguments[0];
        requireModules[name] = arguments;
        originalDefine.apply(require, arguments);
    };
    require.load = function(moduleName, contextName) {
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
        originalLoad.apply(require, arguments);
    };
    
    unloadRequire = function() {
        var excluded = [
            'antie/application',
            'antie/audiosource',
            'antie/callbackmanager',
            'antie/class',
            'antie/datasource',
            'antie/devices/anim/css3/easinglookup',
            'antie/devices/anim/css3/existingtransitiondefinition',
            'antie/devices/anim/css3/optionstransitiondefinition',
            'antie/devices/anim/css3/skipanimtransitiondefinition',
            'antie/devices/anim/css3/stringhelpers',
            'antie/devices/anim/css3/transition',
            'antie/devices/anim/css3/transitiondefinition',
            'antie/devices/anim/css3/transitionelement',
            'antie/devices/anim/shared/transitionendpoints',
            'antie/devices/broadcastsource/basetvsource',
            'antie/devices/browserdevice',
            'antie/devices/device',
            'antie/devices/googletv',
            'antie/devices/mediaplayer/mediaplayer',
            'antie/devices/mediaplayer/seekfinishedemitevent',
            'antie/devices/parentalguidance/basepghandler',
            'antie/devices/parentalguidance/pgchallengeresponse',
            'antie/devices/ps3base',
            'antie/devices/sanitiser',
            'antie/devices/sanitisers/whitelisted',
            'antie/devices/storage/session',
            'antie/devices/wiiu',
            'antie/events/afteralignevent',
            'antie/events/beforealignevent',
            'antie/events/beforeselecteditemchangeevent',
            'antie/events/blurevent',
            'antie/events/componentevent',
            'antie/events/databoundevent',
            'antie/events/event',
            'antie/events/focusdelayevent',
            'antie/events/focusevent',
            'antie/events/keyevent',
            'antie/events/mediaerrorevent',
            'antie/events/mediaevent',
            'antie/events/mediasourceerrorevent',
            'antie/events/networkstatuschangeevent',
            'antie/events/pagechangeevent',
            'antie/events/selecteditemchangeevent',
            'antie/events/selectevent',
            'antie/events/sliderchangeevent',
            'antie/events/textchangeevent',
            'antie/events/textpagechangeevent',
            'antie/events/tunerpresentingevent',
            'antie/events/tunerstoppedevent',
            'antie/events/tunerunavailableevent',
            'antie/formatter',
            'antie/historian',
            'antie/iterator',
            'antie/lib/date.format',
            'antie/lib/date.parse',
            'antie/lib/intervalformat',
            'antie/lib/math.seedrandom',
            'antie/lib/require',
            'antie/lib/sha1',
            'antie/lib/shifty',
            'antie/mediasource',
            'antie/packages/core',
            'antie/runtimecontext',
            'antie/storageprovider',
            'antie/targets/core',
            'antie/urlbuilder',
            'antie/videosource',
            'antie/widgets/button',
            'antie/widgets/carousel/aligners/aligner',
            'antie/widgets/carousel/aligners/alignmentqueue',
            'antie/widgets/carousel/binder',
            'antie/widgets/carousel/binders/batchbinder',
            'antie/widgets/carousel/carouselcore',
            'antie/widgets/carousel/keyhandlers/activatefirsthandler',
            'antie/widgets/carousel/keyhandlers/alignfirsthandler',
            'antie/widgets/carousel/keyhandlers/keyhandler',
            'antie/widgets/carousel/mask',
            'antie/widgets/carousel/navigators/bookendednavigator',
            'antie/widgets/carousel/navigators/navigator',
            'antie/widgets/carousel/navigators/wrappingnavigator',
            'antie/widgets/carousel/orientations/horizontal',
            'antie/widgets/carousel/orientations/vertical',
            'antie/widgets/carousel/spinner',
            'antie/widgets/carousel/strips/cullingstrip',
            'antie/widgets/carousel/strips/hidingstrip',
            'antie/widgets/carousel/strips/utility/attachedstate',
            'antie/widgets/carousel/strips/utility/hiddenstate',
            'antie/widgets/carousel/strips/utility/initstate',
            'antie/widgets/carousel/strips/utility/renderedstate',
            'antie/widgets/carousel/strips/utility/state',
            'antie/widgets/carousel/strips/utility/states',
            'antie/widgets/carousel/strips/utility/visibilitystates',
            'antie/widgets/carousel/strips/utility/visiblestate',
            'antie/widgets/carousel/strips/utility/widgetcontext',
            'antie/widgets/carousel/strips/widgetstrip',
            'antie/widgets/carousel/strips/wrappingstrip',
            'antie/widgets/carousel',
            'antie/widgets/component',
            'antie/widgets/componentcontainer',
            'antie/widgets/container',
            'antie/widgets/grid',
            'antie/widgets/horizontalcarousel',
            'antie/widgets/horizontallist',
            'antie/widgets/horizontalprogress',
            'antie/widgets/horizontalslider',
            'antie/widgets/image',
            'antie/widgets/keyboard',
            'antie/widgets/label',
            'antie/widgets/list',
            'antie/widgets/listitem',
            'antie/widgets/scrubbar',
            'antie/widgets/state_view_container',
            'antie/widgets/textpager',
            'antie/widgets/verticallist',
            'antie/widgets/widget'
        ];

        function isExcluded(name) {
            return excluded.indexOf(name) !== -1;
        }

        for (var name in requireModules) {
            if (requireModules.hasOwnProperty(name) && !isExcluded(name)) {

                //Allow for anonymous functions
                if (typeof name === 'string') {
                    delete require.s.contexts._.specified[name];
                    delete require.s.contexts._.defined[name];
                    delete require.s.contexts._.loaded[name];
                }
            }
        }
    };
})();


var TestCase = function (description, testSuiteClass) {
    var testFns = {};
    var setup;
    var tearDown;
    var otherFns = {};
    window.additionalTestFns[description] = otherFns;

    for (var propertyName in testSuiteClass) {
        if(testSuiteClass.hasOwnProperty(propertyName)) {
            var fn = testSuiteClass[propertyName];

            if (propertyName.indexOf('test') === 0) {
                testFns[propertyName] = fn;
            } else if (propertyName === 'setUp') {
                setup = fn;
            } else if (propertyName === 'tearDown') {
                tearDown = fn;
            } else {
                otherFns[propertyName] = fn;
            }
        }
    }

    var specDefinitions = function () {
        if (setup) {
            beforeEach(setup);
        }

        for (var testName in testFns) {
            if(testFns.hasOwnProperty(testName)) {
                it (testName, testFns[testName]);
            }
        }

        var unloadRequireAndTearDown = function () {
            if (tearDown) {
                tearDown();
            }

            unloadRequire();
        };

        afterEach(unloadRequireAndTearDown);
    };

    describe(description, specDefinitions);
};

window.testSuites = {};
var thisContext = {};
AsyncTestCase = function (testSuiteName) {
    var testSuite =  {};
    testSuite.prototype = {};

    window.testSuites[testSuiteName] = testSuite;
    return testSuite;
};
registerTestsWithJasmine = function () {
    for (var testSuiteName in window.testSuites) {
        if(window.testSuites.hasOwnProperty(testSuiteName)) {
            var testSuiteClass = window.testSuites[testSuiteName];

            var testFns = {};
            var setup;
            var tearDown;

            for (var propertyName in testSuiteClass.prototype) {
                if(testSuiteClass.prototype.hasOwnProperty(propertyName)) {
                    var fn = testSuiteClass.prototype[propertyName];

                    if (propertyName.indexOf('test') === 0) {
                        testFns[propertyName] = fn;
                    } else if (propertyName === 'setUp') {
                        setup = fn;
                    } else if (propertyName === 'tearDown') {
                        tearDown = fn;
                    }
                }
            }

            var specDefinition = function () {
                if (setup) {
                    beforeEach(setup.bind(thisContext));
                }

                for (var testName in testFns) {
                    if(testFns.hasOwnProperty(testName)) {
                        it (testName, createRunAsyncTestFunction(testFns[testName]));
                    }
                }

                if (tearDown) {
                    afterEach(tearDown.bind(thisContext));
                }

                afterEach(function () {
                    if(window.fakeApplication) {
                        window.fakeApplication.destroy();
                        window.fakeApplication = null;
                    }
                    var div = document.getElementById('rootWidget');
                    if (div) {
                        div.parentNode.removeChild(div);
                    }
                    unloadRequire();
                });
            };

            describe(testSuiteName, specDefinition.bind(thisContext));
        }

    }
};

function createRunAsyncTestFunction(testFn) {
    return function (done) {
        runAsyncTest(testFn, done);
    };
}

function runAsyncTest(testFn, done) {
    var testHasRun = false;

    queuedApplicationInit = function(queue, applicationModuleName, otherDeps, testToRun, configOverride) {
        var rootWidget = document.createElement('div');
        rootWidget.id = 'rootWidget';
        document.body.appendChild(rootWidget);

        var wrappedTestToRun = function () {
            var loadedModules = arguments;

            var ApplicationClass = loadedModules[0];

            var onReady = function () {
                try {
                    testToRun.apply(thisContext, loadedModules);
                    rootWidget.innerHTML = '';
                } finally {
                    testHasRun = true;
                }
            };

            window.fakeApplication = new ApplicationClass(rootWidget, null, null, onReady, configOverride);
            loadedModules[0] = window.fakeApplication;
        };

        require([applicationModuleName].concat(otherDeps), wrappedTestToRun);
    };

    queuedRequire = function(queue, deps, testToRun) {
        var wrappedTestToRun = function () {
            try {
                testToRun.apply(thisContext, arguments);
            } finally {
                testHasRun = true;
            }
        };

        require(deps, wrappedTestToRun);
    };

    testFn.apply(thisContext);
    setInterval(function () {
        if (testHasRun) {
            done();
        }
    }, 10);
}

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
    }
    expect(thing2).toEqual(thing1);
};

assertNotEquals = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    }
    expect(thing2).not.toEqual(thing1);
};

assertSame = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    }
    expect(thing2).toBe(thing1);
};

assertNotSame = function (msg, thing1, thing2) {
    if (arguments.length < 3) {
        thing2 = thing1;
        thing1 = msg;
    }
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
    }
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
    expect(typeof thing).toBe('function');
};

assertException = function (msg, fn, error) {
    if (arguments.length < 2) {
        fn = msg;
    } else if (arguments.length === 2 &&  typeof(msg) === 'function') {
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

    var classes = element.className.split(' ');

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

    expect(typeof thing).toBe('boolean');
};

jstestdriver = {
    console: {
        log: function( msg ){
            console.log( msg );
        },
        warn: function(msg) {
            console.warn(msg);
        },
        error: function(msg) {
            console.error(msg);
        },
        debug: function(msg) {
            console.debug(msg);
        }
    }
};
