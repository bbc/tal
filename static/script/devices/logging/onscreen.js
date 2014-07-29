	/**
	 * @fileOverview Requirejs module containing base antie.devices.logging.alert class.
	 * @author Chris Warren <chris.warren@bbc.co.uk>
	 * @version 1.0.0
	 */
require.def(
	'antie/devices/logging/onscreen',
	[
		'antie/devices/browserdevice'
	],
	function(Device) 
	{
		var div = null;
		var enabledLevels = null;
		var logItems = [];

		function prependItem(text) {
			if(!div) {
				div = document.createElement('div');
				div.id = "__onScreenLogging";
				div.style.zIndex = 9999999;
				div.style.position = "absolute";
				div.style.top = "0";
				div.style.left = "0";
				div.style.padding = "20px";
				// set a non-rgba colour first in case they're not supported
				div.style.backgroundColor = "#d8d8d8";
				div.style.backgroundColor = "rgba(216,216,216,0.8)";
				div.style.color = "#000000";
				div.style.lineHeight = "12px";
				div.style.fontSize = "12px";
				document.body.appendChild(div);
			}
			logItems.push(text);
			if(logItems.length > 10) {
				logItems.shift();
			}
			div.innerHTML = logItems.join("<hr noshade />");
		}
		var loggingMethods = {
			/**
			 * Sets the iterator pointer to the first item
			 */
			log: function() {
				if(enabledLevels.info) {
					prependItem.call(this, "[LOG] " + Array.prototype.join.call(arguments, '<br/>'));
				}
			},
			debug: function() {
				if(enabledLevels.debug) {
					prependItem.call(this, "[DEBUG] " +  Array.prototype.join.call(arguments, '<br/>'));
				}
			},						
			info: function() {
				if(enabledLevels.info) {
					prependItem.call(this, "[INFO] " +  Array.prototype.join.call(arguments, '<br/>'));
				}
			},			
			warn: function() {
				if(enabledLevels.warn) {
					prependItem.call(this, "[WARN] " +  Array.prototype.join.call(arguments, '<br/>'));
				}
			},		
			error: function() {
				if(enabledLevels.error) {
					prependItem.call(this, "[ERROR] " +  Array.prototype.join.call(arguments, '<br/>'));
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
