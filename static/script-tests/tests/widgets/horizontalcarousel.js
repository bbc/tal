(function() {
	this.HorizontalCarouselTest = AsyncTestCase("HorizontalCarousel");

	this.HorizontalCarouselTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HorizontalCarouselTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.HorizontalCarouselTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/horizontalcarousel","antie/widgets/horizontallist"],
			function(application, HorizontalCarousel, HorizontalList) {
				assertEquals('HorizontalCarousel should be a function', 'function', typeof HorizontalCarousel);
				assert('HorizontalCarousel should extend from HorizontalList', new HorizontalCarousel() instanceof HorizontalList);
		});
	};
 	this.HorizontalCarouselTest.prototype.testRenderContainer = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.appendChildWidget(new Button());
					var device = application.getDevice();
					var deviceCreateContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);
					assert(deviceCreateContainerSpy.called);
				}
		);
	};

	this.HorizontalCarouselTest.prototype.testRenderList = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list"],
				function(application, HorizontalCarousel, List) {
					var widget = new HorizontalCarousel("id2");
					widget.setRenderMode(List.RENDER_MODE_LIST);
					var device = application.getDevice();
					var deviceCreateListSpy = this.sandbox.spy(device, 'createList');
					var el = widget.render(device);
					assert(deviceCreateListSpy.called);
				}
		);
	};

	this.HorizontalCarouselTest.prototype.testRenderInnerElements = function(queue) {
	   expectAsserts(8);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   ["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
			   function(application, HorizontalCarousel, List, Button) {
				   var widget = new HorizontalCarousel("id");
				   application.getRootWidget().appendChildWidget(widget);
				   widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				   widget.appendChildWidget(new Button("buttonID"));

				   var device = application.getDevice();
				   assertEquals(1, application.getRootWidget().outputElement.childNodes.length);
				   var el = application.getRootWidget().outputElement.childNodes[0];
				   assertEquals("id_mask", el.id);
				   assertClassName("horizontallistmask", el);

				   assertEquals(1, el.childNodes.length);

				   var listEl = el.childNodes[0];
				   assertEquals("id", listEl.id);
				   assertClassName("horizontalcarousel", listEl);

				   assertEquals(1, listEl.childNodes.length);
				   var buttonEl = listEl.childNodes[0];
				   assertEquals("buttonID", buttonEl.id);
			   }
	   );
   };

 	this.HorizontalCarouselTest.prototype.testRenderTwice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					var device = application.getDevice();
					var deviceCreateContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);
					var el2 = widget.render(device);
					assertSame(el, el2);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeDOM = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("testCarousel");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_DOM, 900);

					var b = new Button("testCarouselButton");
					widget.appendChildWidget(b);

					application.getRootWidget().appendChildWidget(widget);

					widget.setActiveChildWidget(b, true);
					widget.refreshViewport();

					assertEquals(1, widget.outputElement.childNodes.length);
					assertClassName("button", b.outputElement);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeClasses = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("testCarousel");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_CLASSES);

					var b = new Button("testCarouselButton");
					widget.appendChildWidget(b);

					application.getRootWidget().appendChildWidget(widget);

					widget.setActiveChildWidget(b, true);
					widget.refreshViewport();

					assertEquals(1, widget.outputElement.childNodes.length);
					assertClassName("button", b.outputElement);
					assertClassName("inviewport", b.outputElement);
				}
		);
	};
 	this.HorizontalCarouselTest.prototype.testRenderViewportModeNone = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontalcarousel", "antie/widgets/list", "antie/widgets/button"],
				function(application, HorizontalCarousel, List, Button) {
					var widget = new HorizontalCarousel("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
					widget.setViewportMode(HorizontalCarousel.VIEWPORT_MODE_NONE);
					widget.appendChildWidget(new Button());
					var device = application.getDevice();
					var el = widget.render(device);
					assertMatch(/_mask$/, el.id);
				}
		);
	};
})();
/*

			init: function(id, itemFormatter, dataSource, overrideAnimation) {

			render: function(device) {

			refreshViewport: function() {

			setActiveChildWidget: function(widget, reposition) {

			setActiveChildIndex: function(index, reposition) {

			setDataSource: function(data) {

			rebindDataSource: function() {

			_onKeyDown: function(evt) {

			_onDataBound: function(evt) {

			setWrapMode: function(wrapMode) {

			setViewportMode: function(viewportMode, size) {

			setHasMultiWidthItems: function(multiWidthItems) {

			setActivateThenScroll: function(activateThenScroll) {

			setKeepHidden: function(keepHidden) {

			getSelectedChildWidgetIndex: function() {

			selectPreviousChildWidget: function() {

			selectNextChildWidget: function() {

			_moveChildWidgetSelection: function(direction) {

			_isAnimationOverridden : function(animate) {


		HorizontalCarousel.SELECTION_DIRECTION_RIGHT = 'right';
		HorizontalCarousel.SELECTION_DIRECTION_LEFT = 'left';

		HorizontalCarousel.WRAP_MODE_NONE = 0;
		HorizontalCarousel.WRAP_MODE_NAVIGATION_ONLY = 1;
		HorizontalCarousel.WRAP_MODE_VISUAL = 2;

		HorizontalCarousel.VIEWPORT_MODE_NONE = 0;
		HorizontalCarousel.VIEWPORT_MODE_CLASSES = 1;
		HorizontalCarousel.VIEWPORT_MODE_DOM = 2;

*/