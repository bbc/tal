	/**
	 * @fileOverview Requirejs module containing base antie.devices.logging.consumelog class.
	 * @author Chris Darlaston <christopher.darlaston@bbc.co.uk>
	 * @version 1.0.0
	 */
require.def(
	'antie/devices/logging/consumelog',
	[
		'antie/devices/browserdevice'
	],
	function(Device) 
	{
		var enabledLevels = null;

		function ignore() {};

		var loggingMethods = {
			log: ignore,
			debug: ignore,
			info: ignore,
			warn: ignore,
			error: ignore
		};
		
		Device.prototype.getLogger = function(namespace) {
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
