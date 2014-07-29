require.def("lib/mockapplication",
	[
		"antie/application",
		"antie/widgets/container"
	],
	function(FrameworkApplication, Container) {

		return FrameworkApplication.extend({
			init: function(rootElement, styleBaseUrl, imageBaseUrl, onReadyHandler, configOverride, beforeInit, afterInit) {
				if(beforeInit) {
					beforeInit.apply(this);
				}

				this._super(rootElement, styleBaseUrl, imageBaseUrl, onReadyHandler, configOverride);

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

