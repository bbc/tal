	/**
	 * @fileOverview Requirejs module containing base antie.devices.logging.alert class.
	 * @author Chris Warren <chris.warren@bbc.co.uk>
	 * @version 1.0.0
	 */
require.def(
	'antie/devices/logging/alert',
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
					alert("[LOG] " +  Array.prototype.join.call(arguments, '\n'));
				}
			},
			debug: function() {
				if(enabledLevels.debug) {
					alert("[DEBUG] " +  Array.prototype.join.call(arguments, '\n'));
				}
			},						
			info: function() {
				if(enabledLevels.info) {
					alert("[INFO] " +  Array.prototype.join.call(arguments, '\n'));
				}
			},			
			warn: function() {
				if(enabledLevels.warn) {
					alert("[WARN] " +  Array.prototype.join.call(arguments, '\n'));
				}
			},		
			error: function() {
				if(enabledLevels.error) {
					alert("[ERROR] " +  Array.prototype.join.call(arguments, '\n'));
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
