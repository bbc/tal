/**
 * @fileOverview Test fixture component that fires callbacks supplied via the arguments
 * of container.show() and container.hide(). This allows the events raised in this
 * component by its container to be tested.
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

require.def('fixtures/components/eventtestcomponent', ['antie/widgets/component'], function(Component) {
	return Component.extend({
		init: function() {
			var self = this;
			this._super("onLoadTestComponent");
			this.addEventListener("load", function(ev) { self._onEvent(ev); });
			this.addEventListener("beforerender", function(ev) { self._onEvent(ev); });
			this.addEventListener("beforeshow", function(ev) { self._onEvent(ev); });
			this.addEventListener("aftershow", function(ev) { self._onEvent(ev); });
			this.addEventListener("beforehide", function(ev) { self._onEvent(ev); });
			this.addEventListener("afterhide", function(ev) { self._onEvent(ev); });
		},
		_onEvent : function(ev) {
			// Assuming a callback was passed to container.show() for this type of event, call it
			var callback = ev.args[ev.type];
			
			if (callback && typeof callback === 'function') {
				callback();
			};
		}
	});
});