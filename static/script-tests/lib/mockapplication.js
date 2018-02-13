/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

require.def("lib/mockapplication",
	[
		"antie/application",
		"antie/widgets/container"
	],
	function(FrameworkApplication, Container) {

		return FrameworkApplication.extend({
			init: function init (rootElement, styleBaseUrl, imageBaseUrl, onReadyHandler, configOverride, beforeInit, afterInit) {
				if(beforeInit) {
					beforeInit.apply(this);
				}

				init.base.call(this, rootElement, styleBaseUrl, imageBaseUrl, onReadyHandler, configOverride);

				if(afterInit) {
					afterInit.apply(this);
				}
			},
			run: function() {
				var rootContainer = new Container();
				this.setRootWidget(rootContainer);

				this.ready();
			}
		});
	});
