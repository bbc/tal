module('bstests/widgets/horizontalcarousel');

asyncTest('HorizontalCarousel', function() {
	require(
		[
		 	'antie/widgets/horizontalcarousel',
		 	'antie/widgets/button',
		 	'antie/widgets/container',
		 	'bstests/mockApplication',
		 	'antie/events/keyevent'
		],
		function(HorizontalCarousel, Button, Container, MockApplication, KeyEvent) {
			expect(1);

			var container = new Container();

			new MockApplication(container, function() {
				var list = new HorizontalCarousel("testCarousel", null, null, true);
				container.appendChildWidget(list);
				list.appendChildWidget(new Button());
				list.appendChildWidget(new Button());
				var device = list.getCurrentApplication().getDevice();

				device.scrollElementToCenter = function (el, left, top, skipAnim, onComplete) {
					ok(skipAnim, "Skip Animation is true");

				};

				list.bubbleEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

				this.cleanup();
				start();

			});
		}
	);
});
