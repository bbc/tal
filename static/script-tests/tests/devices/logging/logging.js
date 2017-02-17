/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
        /* global console */
    this.LoggingTest = AsyncTestCase('Logging');

    this.LoggingTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.LoggingTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.LoggingTest.prototype.testDefaultLog = function(queue) {
        //load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the LOG method
        var loglevel = 'all';
        var config = getConfig(loglevel);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var logSpy = this.sandbox.spy(console, 'log');

            application.getDevice().getLogger().log( 'Log Message' );
            assertTrue( logSpy.calledOnce );

        }, config );
    };

    this.LoggingTest.prototype.testDefaultDebug = function(queue) {
        //load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the DEBUG method
        var loglevel = 'all';
        var config = getConfig(loglevel);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var logSpy = this.sandbox.spy( console, 'debug');

            application.getDevice().getLogger().debug( 'Log Message' );
            assertTrue( logSpy.calledOnce );

        }, config );
    };

    this.LoggingTest.prototype.testDefaultInfo = function(queue) {
        //load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the INFO method
        var loglevel = 'all';
        var config = getConfig(loglevel);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var logSpy = this.sandbox.spy( console, 'info');

            application.getDevice().getLogger().info( 'Log Message' );
            assertTrue( logSpy.calledOnce );

        }, config );
    };

    this.LoggingTest.prototype.testDefaultWarn = function(queue) {
        //load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the WARN method
        var loglevel = 'all';
        var config = getConfig(loglevel);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var logSpy = this.sandbox.spy( console, 'warn');

            application.getDevice().getLogger().warn( 'Log Message' );
            assertTrue( logSpy.calledOnce );

        }, config );
    };

    this.LoggingTest.prototype.testDefaultError = function(queue) {
        //load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the ERROR method
        var loglevel = 'all';
        var config = getConfig(loglevel);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var logSpy = this.sandbox.spy( console, 'error');

            application.getDevice().getLogger().error( 'Log Message' );
            assertTrue( logSpy.calledOnce );

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelError = function(queue) {
        // set log level to Error with default (console) logger. Ensure error messages ONLY are logged.
        var loglevel = 'error';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assertFalse('Called log.debug', stubbedMethods.debug.called);
            assertFalse('Called log.info', stubbedMethods.info.called);
            assertFalse('Called log.log', stubbedMethods.log.called);
            assertFalse('Called log.warn', stubbedMethods.warn.called);
            assert('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelWarn = function(queue) {
        // set log level to Warn with default (console) logger. Ensure error and warn messages ONLY are logged.
        var loglevel = 'warn';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assertFalse('Called log.debug', stubbedMethods.debug.called);
            assertFalse('Called log.info', stubbedMethods.info.called);
            assertFalse('Called log.log', stubbedMethods.log.called);
            assert('Called log.warn', stubbedMethods.warn.called);
            assert('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelInfo = function(queue) {
        // set log level to Info with default (console) logger. Ensure error, warn, log and info messages ONLY are logged.
        var loglevel = 'info';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assertFalse('Called log.debug', stubbedMethods.debug.called);
            assert('Called log.info', stubbedMethods.info.called);
            assert('Called log.log', stubbedMethods.log.called);
            assert('Called log.warn', stubbedMethods.warn.called);
            assert('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelDebug = function(queue) {
        // set log level to Debug with default (console) logger. Ensure all messages are logged.
        var loglevel = 'debug';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assert('Called log.debug', stubbedMethods.debug.called);
            assert('Called log.info', stubbedMethods.info.called);
            assert('Called log.log', stubbedMethods.log.called);
            assert('Called log.warn', stubbedMethods.warn.called);
            assert('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelAll = function(queue) {
        // set log level to All with default (console) logger. Ensure all messages are logged (equivalent to 'debug' level).
        var loglevel = 'all';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assert('Called log.debug', stubbedMethods.debug.called);
            assert('Called log.info', stubbedMethods.info.called);
            assert('Called log.log', stubbedMethods.log.called);
            assert('Called log.warn', stubbedMethods.warn.called);
            assert('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingLevelNone = function(queue) {
        // set log level to None with default (console) logger. Ensure error and warn messages ONLY are logged.
        var loglevel = 'none';
        var logstrategy = 'default';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stubbedMethods = stubLogMethods(this.sandbox, console);
            logMessageAtAllLevels(application.getDevice().getLogger());

            assertFalse('Called log.debug', stubbedMethods.debug.called);
            assertFalse('Called log.info', stubbedMethods.info.called);
            assertFalse('Called log.log', stubbedMethods.log.called);
            assertFalse('Called log.warn', stubbedMethods.warn.called);
            assertFalse('Called log.error', stubbedMethods.error.called);

        }, config );
    };

    this.LoggingTest.prototype.testLoggingSetAlert = function(queue) {

        // ensure the Alert logging strategy can be configured
        var loglevel = 'all';
        var logstrategy = 'alert';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var loggingMethods = application.getDevice().getLogger();
            var alertLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/alert' ];

            assertEquals(alertLoggingMethods.log, loggingMethods.log);
        }, config );
    };

    this.LoggingTest.prototype.testLoggingSetConsume = function(queue) {

        // ensure the Consume logging strategy can be configured
        var loglevel = 'all';
        var logstrategy = 'consumelog';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var loggingMethods = application.getDevice().getLogger();
            var consumeLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/consumelog' ];

            assertEquals(consumeLoggingMethods.log, loggingMethods.log);
        }, config );
    };

    this.LoggingTest.prototype.testLoggingSetJsTestDriver = function(queue) {

        // ensure the JsTestDriver logging strategy can be configured
        var loglevel = 'all';
        var logstrategy = 'jstestdriver';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var loggingMethods = application.getDevice().getLogger();
            var jsTestDriverLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/jstestdriver' ];

            assertEquals(jsTestDriverLoggingMethods.log, loggingMethods.log);
        }, config );
    };

    this.LoggingTest.prototype.testLoggingSetOnScreen = function(queue) {

        // ensure the onscreen logging strategy can be configured
        var loglevel = 'all';
        var logstrategy = 'onscreen';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var loggingMethods = application.getDevice().getLogger();
            var onscreenLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/onscreen' ];

            assertEquals(onscreenLoggingMethods.log, loggingMethods.log);
        }, config );
    };

    this.LoggingTest.prototype.testLoggingSetXhr = function(queue) {

        // ensure the XHR logging strategy can be configured
        var loglevel = 'all';
        var logstrategy = 'xhr';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var loggingMethods = application.getDevice().getLogger();
            var xhrLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/xhr' ];

            assertEquals(xhrLoggingMethods.log, loggingMethods.log);
        }, config );
    };

    this.LoggingTest.prototype.testSavingSaves = function(queue) {
        var loglevel = 'all';
        var logstrategy = 'saving';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            application.getDevice().getLogger().warn( 'Log Message' );

            var logMessages = require('antie/devices/logging/saving').getLogItems();

            assertEquals( 1, logMessages.length );

        }, config );
    };

    this.LoggingTest.prototype.testSavingSavesLogLevel = function (queue) {
        var loglevel = 'all';
        var logstrategy = 'saving';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            application.getDevice().getLogger().warn( 'Log Message' );

            var logMessages = require('antie/devices/logging/saving').getLogItems();
            assertEquals( 'WARN', logMessages[0].level );

        }, config );
    };

    this.LoggingTest.prototype.testSavingSavesLogMessage = function (queue) {
        var loglevel = 'all';
        var logstrategy = 'saving';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            application.getDevice().getLogger().warn( 'Log Message' );

            var logMessages = require('antie/devices/logging/saving').getLogItems();
            assertEquals( [ 'Log Message' ], logMessages[0].message );

        }, config );
    };

    this.LoggingTest.prototype.testSavingStoresMultipleMessages = function (queue) {
        var loglevel = 'all';
        var logstrategy = 'saving';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            application.getDevice().getLogger().warn( 'Log Message' );
            application.getDevice().getLogger().error( 'Log Message' );
            application.getDevice().getLogger().info( 'Log Message' );


            var logMessages = require('antie/devices/logging/saving').getLogItems();
            assertEquals( 3, logMessages.length );

        }, config );
    };

    this.LoggingTest.prototype.testSavingClearsMessagesAfterRetrieved = function (queue) {
        var loglevel = 'all';
        var logstrategy = 'saving';
        var config = getConfig(loglevel, logstrategy);

        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            application.getDevice().getLogger().warn( 'Log Message' );
            application.getDevice().getLogger().error( 'Log Message' );
            application.getDevice().getLogger().info( 'Log Message' );

            var saving = require('antie/devices/logging/saving');
            saving.getLogItems();
            var newMessages = saving.getLogItems();

            assertEquals( 0, newMessages.length );

        }, config );
    };

    function stubLogMethods(sandbox, console) {
        return {
            debug: sandbox.stub(console, 'debug'),
            info: sandbox.stub(console, 'info'),
            log: sandbox.stub(console, 'log'),
            warn: sandbox.stub(console, 'warn'),
            error: sandbox.stub(console, 'error')
        };
    }

    function logMessageAtAllLevels(logger) {
        logger.debug('Debug message');
        logger.info('Info message');
        logger.log('Log message');
        logger.warn('Warn message');
        logger.error('Error message');
    }

    function getConfig(level, strategy) {
        return {
            'modules': {'base': 'antie/devices/browserdevice',
                        'modifiers': ['antie/devices/logging/default', 'antie/devices/logging/alert', 'antie/devices/logging/jstestdriver', 'antie/devices/logging/onscreen', 'antie/devices/logging/xhr', 'antie/devices/logging/consumelog', 'antie/devices/logging/saving']}, 'logging': {
                            'level': level, 'strategy': strategy
                        }, 'input': {'map': {}}, 'layouts': [
                            {'width': 960, 'height': 540, 'module': 'fixtures/layouts/default', 'classes': ['browserdevice540p']}
                        ], 'deviceConfigurationKey': 'devices-html5-1'};
    }
})();
