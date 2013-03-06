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
	this.ButtonTest = AsyncTestCase("Button");

	this.ButtonTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ButtonTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ButtonTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/button","antie/widgets/widget"],
			function(application, Button, Widget) {
				assertEquals('Button should be a function', 'function', typeof Button);
				assert('Button should extend from Widget', new Button() instanceof Widget);
		});
	};
 	this.ButtonTest.prototype.testRender = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var widget = new Button("id");
					var device = application.getDevice();
					var createButtonSpy = this.sandbox.spy(device, 'createButton');
					var el = widget.render(device);
					assert(createButtonSpy.called);
					assertEquals(typeof device.createButton(), typeof el);
					assertEquals("id", el.id);
					assertClassName("button", el);
				}
		);
	};

	this.ButtonTest.prototype.testIsFocusableWhenEnabled = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var widget = new Button();
					assert(widget.isFocusable());
				}
		);
	};

	this.ButtonTest.prototype.testIsNotFocusableWhenDisabled = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var widget = new Button();
					widget.setDisabled(true);
					assertFalse(widget.isFocusable());
				}
		);
	};

	this.ButtonTest.prototype.testFocus = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var widget = new Button();
					application.getRootWidget().appendChildWidget(widget);
					widget.focus();
					assert(widget.hasClass('focus'));
				}
		);
	};
	this.ButtonTest.prototype.testFocusMovesFocus = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var widget = new Button();
					application.getRootWidget().appendChildWidget(widget);
					var widget2 = new Button();
					application.getRootWidget().appendChildWidget(widget2);

					widget.focus();
					assert(widget.hasClass('focus'));
					assertFalse(widget2.hasClass('focus'));
					widget2.focus();
					assertFalse(widget.hasClass('focus'));
					assert(widget2.hasClass('focus'));
				}
		);
	};
	this.ButtonTest.prototype.testFocusChangesActiveAndFocusStates = function(queue) {
		expectAsserts(50);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/widgets/container"],
				function(application, Button, Container) {
					var container1 = new Container();
					var button1 = new Button();
					var button2 = new Button();
					container1.appendChildWidget(button1);
					container1.appendChildWidget(button2);

					var container2 = new Container();
					var button3 = new Button();
					container2.appendChildWidget(button3);

					application.getRootWidget().appendChildWidget(container1);
					application.getRootWidget().appendChildWidget(container2);

					/*
					 *     Application Root
					 *     |
					 *     '- Container  (Active Focus)
					 *     |  |
					 *     |  '- Button1 (Active Focus)
					 *     |  '- Button2
					 *     |
					 *     '- Container2
					 *        |
					 *        '- Button3 (Active)
					 */

					assert("1", container1.hasClass('active'));
					assert("2", container1.hasClass('focus'));
					assert("3", button1.hasClass('active'));
					assert("4", button1.hasClass('focus'));
					assertFalse("5", button2.hasClass('active'));
					assertFalse("6", button2.hasClass('focus'));
					assertFalse("7", container2.hasClass('active'));
					assertFalse("8", container2.hasClass('focus'));
					assert("9", button3.hasClass('active'));
					assertFalse("10", button3.hasClass('focus'));

					button1.focus();

					/*
					 *     Application Root
					 *     |
					 *     '- Container  (Active Focus)
					 *     |  |
					 *     |  '- Button1 (Active Focus)
					 *     |  '- Button2
					 *     |
					 *     '- Container2
					 *        |
					 *        '- Button3 (Active)
					 */

					assert("11", container1.hasClass('active'));
					assert("12", container1.hasClass('focus'));
					assert("13", button1.hasClass('active'));
					assert("14", button1.hasClass('focus'));
					assertFalse("15", button2.hasClass('active'));
					assertFalse("16", button2.hasClass('focus'));
					assertFalse("17", container2.hasClass('active'));
					assertFalse("18", container2.hasClass('focus'));
					assert("19", button3.hasClass('active'));
					assertFalse("20", button3.hasClass('focus'));

					button2.focus();

					/*
					 *     Application Root
					 *     |
					 *     '- Container  (Active Focus)
					 *     |  |
					 *     |  '- Button1
					 *     |  '- Button2 (Active Focus)
					 *     |
					 *     '- Container2
					 *        |
					 *        '- Button3 (Active)
					 */

					assert("21", container1.hasClass('active'));
					assert("22", container1.hasClass('focus'));
					assertFalse("23", button1.hasClass('active'));
					assertFalse("24", button1.hasClass('focus'));
					assert("25", button2.hasClass('active'));
					assert("26", button2.hasClass('focus'));
					assertFalse("27", container2.hasClass('active'));
					assertFalse("28", container2.hasClass('focus'));
					assert("29", button3.hasClass('active'));
					assertFalse("30", button3.hasClass('focus'));

					button3.focus();

					/*
					 *     Application Root
					 *     |
					 *     '- Container  (Active)
					 *     |  |
					 *     |  '- Button1
					 *     |  '- Button2 (Active)
					 *     |
					 *     '- Container2
					 *        |
					 *        '- Button3 (Active Focus)
					 */

					assertFalse("31", container1.hasClass('active'));
					assertFalse("32", container1.hasClass('focus'));
					assertFalse("33", button1.hasClass('active'));
					assertFalse("34", button1.hasClass('focus'));
					assert("35", button2.hasClass('active'));
					assertFalse("36", button2.hasClass('focus'));
					assert("37", container2.hasClass('active'));
					assert("38", container2.hasClass('focus'));
					assert("39", button3.hasClass('active'));
					assert("40", button3.hasClass('focus'));

					button1.focus();

					/*
					 *     Application Root
					 *     |
					 *     '- Container  (Active Focus)
					 *     |  |
					 *     |  '- Button1 (Active Focus)
					 *     |  '- Button2
					 *     |
					 *     '- Container2
					 *        |
					 *        '- Button3 (Active)
					 */

					assert("41", container1.hasClass('active'));
					assert("42", container1.hasClass('focus'));
					assert("43", button1.hasClass('active'));
					assert("44", button1.hasClass('focus'));
					assertFalse("45", button2.hasClass('active'));
					assertFalse("46", button2.hasClass('focus'));
					assertFalse("47", container2.hasClass('active'));
					assertFalse("48", container2.hasClass('focus'));
					assert("49", button3.hasClass('active'));
					assertFalse("50", button3.hasClass('focus'));
				}
		);
	};

	this.ButtonTest.prototype.testSelect = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var button = new Button();
					var bubbleEventSpy = this.sandbox.spy(button, 'bubbleEvent');
					button.select();
					assert(bubbleEventSpy.called);
				}
		);
	};

	this.ButtonTest.prototype.testEnterKeyCausesSelect = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/events/keyevent"],
				function(application, Button, KeyEvent) {
					var button = new Button();
					var selectSpy = this.sandbox.spy(button, 'select');
					button.fireEvent(new KeyEvent("keydown", KeyEvent.VK_ENTER));
					assert(selectSpy.called);
				}
		);
	};

	this.ButtonTest.prototype.testFocusClasses = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var button = new Button();
					application.getRootWidget().appendChildWidget(button);

					var button2 = new Button();
					application.getRootWidget().appendChildWidget(button2);

					assert(button.hasClass('buttonFocussed'));
					assertFalse(button.hasClass('buttonBlurred'));
					assertFalse(button2.hasClass('buttonFocussed'));
					assert(button2.hasClass('buttonBlurred'));

					button2.focus();

					assertFalse(button.hasClass('buttonFocussed'));
					assert(button.hasClass('buttonBlurred'));
					assert(button2.hasClass('buttonFocussed'));
					assertFalse(button2.hasClass('buttonBlurred'));
				}
		);
	};

	this.ButtonTest.prototype.testRemoveFocus = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var button = new Button();
					application.getRootWidget().appendChildWidget(button);

					var button2 = new Button();
					application.getRootWidget().appendChildWidget(button2);

					button2.focus();

					assertFalse(button.hasClass('buttonFocussed'));
					assert(button.hasClass('buttonBlurred'));
					assert(button2.hasClass('buttonFocussed'));
					assertFalse(button2.hasClass('buttonBlurred'));

					button2.removeFocus();

					assertFalse(button.hasClass('buttonFocussed'));
					assert(button.hasClass('buttonBlurred'));
					assertFalse(button2.hasClass('buttonFocussed'));
					assert(button2.hasClass('buttonBlurred'));
				}
		);
	};

	this.ButtonTest.prototype.testFocusReturnsTrueWhenButtonIsEnabled = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var button = new Button();
					application.getRootWidget().appendChildWidget(button);

					assert(button.focus());
				}
		);
	};

	this.ButtonTest.prototype.testFocusReturnsTrueWhenButtonIsDisabled = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button"],
				function(application, Button) {
					var button = new Button();
					application.getRootWidget().appendChildWidget(button);
					button.setDisabled(true);
					assertFalse(button.focus());
				}
		);
	};
})();
