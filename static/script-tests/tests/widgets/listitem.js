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
	this.ListItemTest = AsyncTestCase("ListItem");

	this.ListItemTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ListItemTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ListItemTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/listitem","antie/widgets/container"],
			function(application, ListItem, Container) {
				assertEquals('ListItem should be a function', 'function', typeof ListItem);
				assert('ListItem should extend from Container', new ListItem() instanceof Container);
		});
	};
 	this.ListItemTest.prototype.testRender = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/listitem"],
				function(application, ListItem) {
					var widget = new ListItem("id");

					var device = application.getDevice();
					var createListItemSpy = this.sandbox.spy(device, 'createListItem');
					var el = widget.render(device);

					assert(createListItemSpy.called);
					assertEquals(typeof device.createListItem(), typeof el);
					assertEquals("id", el.id);
					assertClassName("listitem", el);
				}
		);
	};
})();