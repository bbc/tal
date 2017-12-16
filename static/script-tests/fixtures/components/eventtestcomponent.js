/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview Test fixture component that fires callbacks supplied via the arguments
 * of container.show() and container.hide(). This allows the events raised in this
 * component by its container to be tested.
 */

require.def('fixtures/components/eventtestcomponent', ['antie/widgets/component'], function(Component) {
	return Component.extend({
		init: function init () {
			var self = this;
			init.base.call(this, "onLoadTestComponent");
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
			}
		}
	});
});
