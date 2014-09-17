/**
 * @fileOverview Requirejs module containing the antie.events.MediaErrorEvent class.
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

require.def('antie/events/mediaerrorevent',
	['antie/events/mediaevent'],
	function(MediaEvent) {
		'use strict';

		/**
		 * Class of events raised when media errors occur
		 * @name antie.events.MediaErrorEvent
		 * @class
		 * @extends antie.events.MediaEvent
		 * @param {antie.widgets.Media} target The media widget that fired the event.
		 * @param {String} code Error code.
		 */

		var MediaErrorEvent = MediaEvent.extend(/** @lends antie.events.MediaErrorEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, code) {
				this.code = code;
				this._super("error", target);
			}
		});

		return MediaErrorEvent;
	}
);
