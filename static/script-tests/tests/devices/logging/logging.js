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
	this.LoggingTest = AsyncTestCase("Logging");
	
	this.LoggingTest.prototype.testDefaultLog = function(queue) {
		
		//load all logging modules and set logging level to all - but don't select a logging strat - test that we get the default module and call the LOG method
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
			  	"level": "all"
			  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy = sinon.spy( console, "log");
		
		application.getDevice().getLogger().log( "Log Message" );
		assertTrue( logSpy.calledOnce );
		console.log.restore();
		
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
			
		var logSpy = sinon.spy( console, "debug");
		
		application.getDevice().getLogger().debug( "Log Message" );
		assertTrue( logSpy.calledOnce );
		console.debug.restore();
		
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
			
		var logSpy = sinon.spy( console, "info");
		
		application.getDevice().getLogger().info( "Log Message" );
		assertTrue( logSpy.calledOnce );
		console.info.restore();
		
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
			
		var logSpy = sinon.spy( console, "warn");
		
		application.getDevice().getLogger().warn( "Log Message" );
		assertTrue( logSpy.calledOnce );
		console.warn.restore();
		
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
			
		var logSpy = sinon.spy( console, "error");
		
		application.getDevice().getLogger().error( "Log Message" );
		assertTrue( logSpy.calledOnce );
		console.error.restore();
		
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingLevel = function(queue) {
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "warn"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(2);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy 	 = sinon.spy( console, "log"  );
		var errorSpy = sinon.spy( console, "error" );
		
		application.getDevice().getLogger().log( "Log Message" );
		application.getDevice().getLogger().error( "Error Message" );
		
		assertFalse( logSpy.calledOnce );
		console.log.restore();
		assertTrue( errorSpy.calledOnce );
		console.error.restore();
		
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingLevelNone = function(queue) {
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "none"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		var logSpy 	 = sinon.spy( console, "log"  );
				
		application.getDevice().getLogger().log( "Log Message" );
		
		
		assertFalse( logSpy.calledOnce );
		console.log.restore();
		
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetAlert = function(queue) {
		
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "all", "strategy" : "alert"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		loggingMethods = application.getDevice().getLogger();
		alertLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/alert' ];
		
		assertTrue( loggingMethods.log == alertLoggingMethods.log );
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetConsume = function(queue) {
		
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "all", "strategy" : "consumelog"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		loggingMethods = application.getDevice().getLogger();
		consumeLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/consumelog' ];
		
		assertTrue( loggingMethods.log == consumeLoggingMethods.log );
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetJsTestDriver = function(queue) {
		
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "all", "strategy" : "jstestdriver"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		loggingMethods = application.getDevice().getLogger();
		jsTestDriverLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/jstestdriver' ];
		
		assertTrue( loggingMethods.log == jsTestDriverLoggingMethods.log );
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetOnScreen = function(queue) {
		
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "all", "strategy" : "onscreen"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		loggingMethods = application.getDevice().getLogger();
		alertLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/onscreen' ];
		
		assertTrue( loggingMethods.log == alertLoggingMethods.log );
		}, config );
	};
	
	this.LoggingTest.prototype.testLoggingSetJsTestDriver = function(queue) {
		
		//load all logging modules and set logging level to warn - but don't select a logging strat - test that we get the default module and call the ERROR module but no LOG
		var config = {
				"modules":{"base":"antie/devices/browserdevice",
				"modifiers":["antie/devices/logging/default", "antie/devices/logging/alert", "antie/devices/logging/jstestdriver", "antie/devices/logging/onscreen", "antie/devices/logging/xhr", "antie/devices/logging/consumelog"]},"logging": {
				  	"level": "all", "strategy" : "xhr"
				  },"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		
		expectAsserts(1);
		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			
		loggingMethods = application.getDevice().getLogger();
		xhrLoggingMethods = application.getDevice().loggingStrategies[ 'antie/devices/logging/xhr' ];
		
		assertTrue( loggingMethods.log == xhrLoggingMethods.log );
		}, config );
	};
	
	
	
	
	
	
	
})();