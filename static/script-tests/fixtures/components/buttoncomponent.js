require.def('fixtures/components/buttoncomponent',
		['antie/widgets/component','antie/widgets/button'], function(Component, Button) {
	return Component.extend({
		init: function() {
			this._super("emptyComponent2");
			this.appendChildWidget(new Button());
		}
	});
});