/**
 * @fileOverview Requirejs module containing the antie.events.MediaSourceErrorEvent class.
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

require.def('antie/events/mediasourceerrorevent',
	['antie/events/mediaerrorevent'],
	function(MediaErrorEvent) {
		'use strict';

		/**
		 * Class of events raised when media error occur on a source
		 * @name antie.events.MediaSourceErrorEvent
		 * @class
		 * @extends antie.events.MediaErrorEvent
		 * @param {antie.widgets.Media} target The media widget that fired the event.
		 * @param {Integer} code Error code.
		 * @param {String} url URL of source which raised error.
		 * @param {Boolean} last True if the source was the last source available.
		 */
		var MediaSourceErrorEvent = MediaErrorEvent.extend(/** @lends antie.events.MediaSourceErrorEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, code, url, last) {
				this.url = url;
				this.last = last;

				this._super(target, code);
			}
		});

		return MediaSourceErrorEvent;
	}
);
