/**
 * @fileOverview Requirejs module containing HTML5 module that bubbles internal antie waiting events.
 * For use on certain HTML5 devices that refuse to fire standard HTML5 waiting events.
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

require.def(
	'antie/devices/media/html5waitingfix',
	[
		'antie/devices/media/html5',
		'antie/events/mediaevent'
	],
	function (HTML5Player, MediaEvent) {
		'use strict';

		var originalConstructor = HTML5Player.prototype.init;
		HTML5Player.prototype.init = function(id, mediaType, eventHandlingFunction) {
			originalConstructor.call(this, id, mediaType, eventHandlingFunction);

			var checkWaitingTimer = null;
			var waiting = false;

			var self = this;
			this._mediaElement.addEventListener('pause', function(evt) {
				window.clearTimeout(checkWaitingTimer);
			});
			this._mediaElement.addEventListener('timeupdate', function(evt) {
				if(checkWaitingTimer) {
					window.clearTimeout(checkWaitingTimer);
				}
				checkWaitingTimer = window.setTimeout(function() {
					waiting = true;
					self._eventHandlingCallback(new MediaEvent("waiting"));
				}, 500);
				if(waiting) {
					waiting = false;
					self._eventHandlingCallback(new MediaEvent("playing"));
				}
			});
			this._mediaElement.addEventListener('ended', function(evt) {
				if(checkWaitingTimer) {
					window.clearTimeout(checkWaitingTimer);
				}
			});
		};

		return HTML5Player;
	}

);
