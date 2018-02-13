/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview Empty component fixture for testing.
 */
require.def('fixtures/components/multipleshowcomponent', ['antie/widgets/component'], function(Component) {
	return Component.extend({
		init: function init () {
			init.base.call(this, "multipleShowComponent");
		}
	});
});
