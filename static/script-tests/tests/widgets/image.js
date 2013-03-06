/**
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

(function() {
	this.ImageTest = AsyncTestCase("Image");

	this.ImageTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ImageTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ImageTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/image","antie/widgets/container"],
			function(application, Image, Container) {
				assertEquals('Image should be a function', 'function', typeof Image);
				assert('Image should extend from Container', new Image() instanceof Container);
		});
	};
 	this.ImageTest.prototype.testRender = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/image"],
				function(application, Image) {
					var size = {width: 107, height: 32};
					var widget = new Image("id", "about:blank", size);

					var device = application.getDevice();
					var createImageSpy = this.sandbox.spy(device, 'createImage');
					var el = widget.render(device);

					assert(createImageSpy.called);
					assertEquals(typeof device.createImage(), typeof el);
					assertEquals("id", el.id);
					var img = el.getElementsByTagName("img")[0];
					assertEquals("about:blank", img.src);
					assertEquals(size.width + "px", el.style.width);
					assertEquals(size.height + "px", el.style.height);
					assertClassName("image", el);
				}
		);
	};

 	this.ImageTest.prototype.testSetGetSource = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/image"],
				function(application, Image) {
					var size = {width: 107, height: 32};
					var widget = new Image("id", "about:blank", size);
					assertEquals("about:blank", widget.getSrc());
					widget.setSrc("about:invalid");
					assertEquals("about:invalid", widget.getSrc());
				}
		);
	};
})();