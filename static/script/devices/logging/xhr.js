/**
 * @fileOverview Requirejs module containing base antie.devices.logging.xhr class.
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

//Logs to via an XML HTTP Request ( XHR )
require.def(
	'antie/devices/logging/xhr',
	[
	 	'module',
	 	'antie/runtimecontext',
		'antie/devices/device'
	],
	function( Module, RuntimeContext, Device ) 
	{
		'use strict';

		function zeroFill( number, width )
		{
		  width -= number.toString().length;
		  if ( width > 0 )
		  {
		    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		  }
		  return number + ""; // always return a string
		}
		
		function sendXHRLogMessage( tag, message )
		{
			var now = new Date();
			var timeString = "" + zeroFill( now.getHours(), 2 ) + ":" + zeroFill( now.getMinutes(), 2 ) + ":" + zeroFill( now.getSeconds(), 2 );  
			var messageObj = { command : "add", message : "[" + timeString + "][" + tag + "]" +  message };
			xhrPost( "/tvpjsframeworklogging", {}, messageObj );
		}
		
		var loggingMethods = {
			/**
			 * Sets the iterator pointer to the first item
			 */
			log: function() {
					sendXHRLogMessage( "LOG", Array.prototype.join.call(arguments, '\n') )
			},
			debug: function() {
					sendXHRLogMessage( "DEBUG", Array.prototype.join.call(arguments, '\n') )
			},						
			info: function() {
					sendXHRLogMessage( "INFO", Array.prototype.join.call(arguments, '\n') )
			},			
			warn: function() {
					sendXHRLogMessage( "WARN", Array.prototype.join.call(arguments, '\n') )
			},		
			error: function() {
					sendXHRLogMessage( "ERROR", Array.prototype.join.call(arguments, '\n') )
			}
		};
		
		Device.addLoggingStrategy( Module.id, loggingMethods );

		function xhrPost( url, opts, messageObject ) {
			
			var http = new XMLHttpRequest();
					
			var device 		= RuntimeContext.getCurrentApplication().getDevice();
			var jsonMessage = device.encodeJson( messageObject ); 
			
			http.open("POST", url, true);

			//Send the proper header information along with the request
			http.setRequestHeader("Content-type", "application/json; charset=utf-8");
			
			http.onreadystatechange = function() {//Call a function when the state changes.
				if (this.readyState == 4) {
					this.onreadystatechange = null;
					if (this.status == 200) {
						if (opts.onLoad) {
							opts.onOkay(this.responseText);
						}
					} else {
						if (opts.onError) {
							opts.onError(this.responseText, this.status);
						}
					}
				}
			}
			http.send( jsonMessage );
		}
	}
);
