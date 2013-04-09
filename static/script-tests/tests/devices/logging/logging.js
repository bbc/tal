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
    // jshint newcap: false
    /* global console */
	this.LoggingTest = AsyncTestCase("Logging");
	
   this.LoggingTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.LoggingTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

	this.LoggingTest.prototype.testDefaultLog = function(queue) {
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the LOG method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = this.sandbox.spy(console, "log");
		
		application.getDevice().getLogger().log( "Log Message" );
		assertTrue( logSpy.calledOnce );
		
		}, config );
	};
	
	this.LoggingTest.prototype.testDefaultDebug = function(queue) {
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the DEBUG method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = this.sandbox.spy( console, "debug");
		
		application.getDevice().getLogger().debug( "Log Message" );
		assertTrue( logSpy.calledOnce );
		
		}, config );
	};
	
	this.LoggingTest.prototype.testDefaultInfo = function(queue) {
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the INFO method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = this.sandbox.spy( console, "info");
		
		application.getDevice().getLogger().info( "Log Message" );
		assertTrue( logSpy.calledOnce );
		
		}, config );
	};
	
	this.LoggingTest.prototype.testDefaultWarn = function(queue) {
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the WARN method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = this.sandbox.spy( console, "warn");
		
		application.getDevice().getLogger().warn( "Log Message" );
		assertTrue( logSpy.calledOnce );
		
		}, config );
	};
	
	this.LoggingTest.prototype.testDefaultError = function(queue) {
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the ERROR method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = this.sandbox.spy( console, "error");
		
		application.getDevice().getLogger().error( "Log Message" );
		assertTrue( logSpy.calledOnce );
		
		}, config );
	};
	
   this.LoggingTest.prototype.testLoggingLevelError = function(queue) {
        // set log level to Error with default (console) logger. Ensure error messages ONLY are logged.
        var config = {
                "modules":{"base":"antie/devices/browserdevice",
                "modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
                    "level": "error", "strategy": "default"
                  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        
        expectAsserts(5);
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            
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
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "warn", "strategy": "default"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(5);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
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
        var config = {
                "modules":{"base":"antie/devices/browserdevice",
                "modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
                    "level": "info", "strategy": "default"
                  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        
        expectAsserts(5);
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            
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
        var config = {
                "modules":{"base":"antie/devices/browserdevice",
                "modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
                    "level": "debug", "strategy": "default"
                  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        
        expectAsserts(5);
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            
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
        var config = {
                "modules":{"base":"antie/devices/browserdevice",
                "modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
                    "level": "all", "strategy": "default"
                  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

        
        expectAsserts(5);
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            
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
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				    "level": "none", "strategy": "default"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(5);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {

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
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "all", "strategy" : "alert"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var loggingMethods = application.getDevice().getLogger();
		var alertLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/alert' ];
		
		assertEquals(alertLoggingMethods.log, loggingMethods.log);
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetConsume = function(queue) {
		
        // ensure the Consume logging strategy can be configured
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "all", "strategy" : "consumelog"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var loggingMethods = application.getDevice().getLogger();
		var consumeLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/consumelog' ];
		
		assertEquals(consumeLoggingMethods.log, loggingMethods.log);
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetJsTestDriver = function(queue) {
		
        // ensure the JsTestDriver logging strategy can be configured
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "all", "strategy" : "jstestdriver"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var loggingMethods = application.getDevice().getLogger();
		var jsTestDriverLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/jstestdriver' ];
		
		assertEquals(jsTestDriverLoggingMethods.log, loggingMethods.log);
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetOnScreen = function(queue) {
		
		// ensure the onscreen logging strategy can be configured
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "all", "strategy" : "onscreen"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var loggingMethods = application.getDevice().getLogger();
		var onscreenLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/onscreen' ];
		
		assertEquals(onscreenLoggingMethods.log, loggingMethods.log);
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetXhr = function(queue) {
		
		// ensure the XHR logging strategy can be configured
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
					"level": "all", "strategy" : "xhr"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var loggingMethods = application.getDevice().getLogger();
		var xhrLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/xhr' ];
		
		assertEquals(xhrLoggingMethods.log, loggingMethods.log);
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
})();