require.def('fixtures/components/emptycomponent', ['antie/widgets/component'], function(Component) {
	return Component.extend({
		init: function() {
			this._super("emptyComponent");
		}
	});
});