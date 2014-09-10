/**
 * @fileOverview Requirejs module containing base antie.devices.logging.onscreen class.
 *
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

//logs to the screen
require.def(
	'antie/devices/logging/onscreen',
	[
		'module', 'antie/devices/device'
	],
	function( Module, Device) 
	{
		'use strict';

		var div = null;
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
			div.innerHTML = logItems.join("<hr />");
		}
		var loggingMethods = {
			/**
			 * Sets the iterator pointer to the first item
			 */
			log: function() {
					prependItem.call(this, "[LOG] " + Array.prototype.join.call(arguments, '<br/>'));
			},
			debug: function() {
					prependItem.call(this, "[DEBUG] " +  Array.prototype.join.call(arguments, '<br/>'));
			},						
			info: function() {
					prependItem.call(this, "[INFO] " +  Array.prototype.join.call(arguments, '<br/>'));
			},			
			warn: function() {
					prependItem.call(this, "[WARN] " +  Array.prototype.join.call(arguments, '<br/>'));
			},		
			error: function() {
					prependItem.call(this, "[ERROR] " +  Array.prototype.join.call(arguments, '<br/>'));
			}
		};
		
		Device.addLoggingStrategy( Module.id, loggingMethods );
	}
);
