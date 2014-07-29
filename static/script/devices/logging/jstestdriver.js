	/**
	 * @fileOverview Requirejs module containing base antie.devices.logging.jstestdriver class.
	 * @author Chris Warren <chris.warren@bbc.co.uk>
	 * @version 1.0.0
	 */
require.def(
	'antie/devices/logging/jstestdriver',
	[
		'antie/devices/browserdevice'
	],
	function(Device) 
	{
		var enabledLevels = null;
		var loggingMethods = {
			/**
			 * Sets the iterator pointer to the first item
			 */
			log: function() {
				if(enabledLevels.info) {
					jstestdriver.console.log.apply(jstestdriver.console, arguments);
				}
			},
			debug: function() {
				if(enabledLevels.debug) {
					jstestdriver.console.debug.apply(jstestdriver.console, arguments);
				}
			},						
			info: function() {
				if(enabledLevels.info) {
					jstestdriver.console.info.apply(jstestdriver.console, arguments);
				}
			},			
			warn: function() {
				if(enabledLevels.warn) {
					jstestdriver.console.warn.apply(jstestdriver.console, arguments);
				}
			},		
			error: function() {
				if(enabledLevels.error) {
					jstestdriver.console.error.apply(jstestdriver.console, arguments);
				}
			}
		};
		
		Device.prototype.getLogger = function() {
			if(!enabledLevels) {
				enabledLevels = {};
				var loggingConfig = this.getConfig().logging;
				if(loggingConfig) {
					var level = loggingConfig.level;
					switch(level) {
						case 'all':
						case 'debug':
							enabledLevels.debug = true;
						case 'info':
							enabledLevels.info  = true;
						case 'warn':
							enabledLevels.warn  = true;
						case 'error':
							enabledLevels.error = true;
					}
				}				
			}
			return loggingMethods;
		};
	}
);
