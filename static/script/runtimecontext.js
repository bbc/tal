/**
 * @fileOverview Requirejs module containing the antie.RunTimeContext class.
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

require.def('antie/runtimecontext',
	[
		'antie/class'
	],
	/**
	 * Static class for accessing the current running application
	 * @name antie.RuntimeContext
	 * @class
	 * @static
	 * @private
	 */
	function(Class) {
		'use strict';

		var applicationObject;

		var RuntimeContext = Class.extend(/** @lends antie.RuntimeContext.prototype */ {
			/**
			 * Clears the currently executing application.
			 * @private
			 */
			clearCurrentApplication: function() {
				applicationObject = undefined;
			},

			/**
			 * Sets the currently executing application.
			 * @private
			 */
			setCurrentApplication: function(app) {
				if (applicationObject) {
					throw new Error("RuntimeContext.setCurrentApplication called for a second time. You can only have one application instance running at any time.");
				} else {
					applicationObject = app;
				}
			},

			/**
			 * Returns the currently executing application.
			 * @private
			 */
			getCurrentApplication: function() {
				return applicationObject;
			},

			/**
			 * Returns the current device
			 * @private
			 */
			getDevice: function() {
				return this.getCurrentApplication().getDevice();
			}
		});

		return new RuntimeContext();
	}
);