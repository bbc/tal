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

	var UPPERCASE = 0,
		LOWERCASE = 1,
		TITLECASE = 2;

	this.KeyboardTest = AsyncTestCase("Keyboard");

	this.KeyboardTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.KeyboardTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	
	this.KeyboardTest.prototype.testSettingAndGettingOfMultiTap = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
				
				var keyboard = new Keyboard("id", 1, 1, ["a"]);

				keyboard.setMultiTap(true);
				assert(keyboard.getMultiTap());
				
				keyboard.setMultiTap(false);
				assertFalse(keyboard.getMultiTap());
		});
	
	};
	
	var _verifyButton = function (keyboard, button, expectedCol, expectedRow, expectedCharacter) {
		var expectedId = "id_" +expectedCharacter+ "_" +expectedCol+ "_" +expectedRow;
	
		assertEquals(expectedId, button.id);
		assert(button.hasClass("key" + expectedCharacter));
		assertEquals(expectedCharacter, button.getDataItem());
		assertEquals(keyboard.getWidgetAt(expectedCol, expectedRow), button);
	};
	
	this.KeyboardTest.prototype.testKeyboardBuiltWithCorrectNumberOfRowsAndCols = function (queue) {
		expectAsserts(25);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
				var keyboard = new Keyboard("id", 3, 2, ["a", "b", "c",
														 "d", "e", "f"]);

 				assertEquals(6, keyboard.getChildWidgets().length);

				_verifyButton(keyboard, keyboard.getChildWidgets()[0], 0, 0, "a");
				_verifyButton(keyboard, keyboard.getChildWidgets()[1], 1, 0, "b");
				_verifyButton(keyboard, keyboard.getChildWidgets()[2], 2, 0, "c");
				_verifyButton(keyboard, keyboard.getChildWidgets()[3], 0, 1, "d");
				_verifyButton(keyboard, keyboard.getChildWidgets()[4], 1, 1, "e");
				_verifyButton(keyboard, keyboard.getChildWidgets()[5], 2, 1, "f");
		});
	};
	
	var _verifySpecialKeyBuildsCorrectly = function(queue, triggerCharacter, buttonText) {
		expectAsserts(3);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
				var keyboard = new Keyboard("id", 1, 1, [triggerCharacter]);
				var firstButton = keyboard.getChildWidgets()[0];

				assertEquals("id_" +buttonText+ "_0_0", firstButton.id);				
 				assertEquals(buttonText, firstButton.getDataItem());
 				assertEquals(1, keyboard.getChildWidgets().length);
			});		
	};
	
	this.KeyboardTest.prototype.testKeyboardBuiltWithSpaceKey = function (queue) {
		_verifySpecialKeyBuildsCorrectly(queue, " ", "SPACE");
	};

	this.KeyboardTest.prototype.testKeyboardBuiltWithDelKey = function (queue) {
		_verifySpecialKeyBuildsCorrectly(queue, "-", "DEL");
	};
	
	this.KeyboardTest.prototype.testKeyboardBuiltWithEmptyNonFunctioningSpacer = function (queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
				var keyboard = new Keyboard("id", 1, 1, ["_"]);
				var firstButton = keyboard.getChildWidgets()[0];

				assertNull(firstButton);
 				assertEquals(1, keyboard.getChildWidgets().length);
			});		
	};
	
	//text
		// text set correctly
		// set maxlength class if at maxlength and have focus on "-" key
		
	this.KeyboardTest.prototype.testSettingAndGettingOfText = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
				
				var someText = "some text";
				var someOtherText = "some text";
				var keyboard = new Keyboard("id", 1, 1, ["a"]);

				keyboard.setText(someText);
				assertEquals(someText, keyboard.getText());
				
				keyboard.setText(someOtherText);
				assertEquals(someOtherText, keyboard.getText());
		});
	};
		
	this.KeyboardTest.prototype.testSetTextAddsMaxLengthClassWhenNewTextIsMaxlength = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {
			
				this.sandbox.spy(Keyboard.prototype, "setActiveChildKey");
				this.sandbox.spy(Keyboard.prototype, "removeClass");
			
				var keyboard = new Keyboard("id", 5, 1, ["a", "b", "c", "d", "e"]);				
				var maxLengthText = "abcde";				
				keyboard.setMaximumLength(5);

				assertFalse(keyboard.hasClass("maxlength"));

				keyboard.setText(maxLengthText);
				
				assertTrue(keyboard.hasClass("maxlength"));
				assert(Keyboard.prototype.setActiveChildKey.calledOnce);
				assertEquals("-", Keyboard.prototype.setActiveChildKey.args[0][0]);
		});
	};
	
	this.KeyboardTest.prototype.testSetTextRemovesMaxlengthClassWhenSetTextWithLengthLessThanMaxlength = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard"],
			function(application, Keyboard) {

				this.sandbox.spy(Keyboard.prototype, "removeClass");
			
				var keyboard = new Keyboard("id", 5, 1, ["a", "b", "c", "d", "e"]);
				var maxLengthText = "abcde";
				var notMaxLengthText = "abc";
				keyboard.setMaximumLength(5);

				keyboard.setText(maxLengthText);
				
				assertTrue(keyboard.hasClass("maxlength"));
				
				keyboard.setText(notMaxLengthText);
				
				assertFalse(keyboard.hasClass("maxlength"));
		});
	};
	
	this.KeyboardTest.prototype.testCaptilisationForcesUppercaseWhenUppercaseFlagSet = function(queue) {
		expectAsserts(1);
	
		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard", "antie/events/keyevent", "antie/events/selectevent"],
			function(application, Keyboard, KeyEvent, SelectEvent) {
				var keyboard = new Keyboard("id", 3, 1, ["A", "B", "c"]);
				keyboard.setCapitalisation(UPPERCASE);
				keyboard.setText("AB");

				var buttonC = keyboard.getChildWidgets()[2];
				buttonC.bubbleEvent(new SelectEvent(buttonC));
				
				assertEquals("ABC", keyboard.getText());
		});
	};
	
	this.KeyboardTest.prototype.testCaptilisationForcesLowercaseWhenLowercaseFlagSet = function(queue) {
		expectAsserts(1);
	
		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard", "antie/events/keyevent", "antie/events/selectevent"],
			function(application, Keyboard, KeyEvent, SelectEvent) {
				var keyboard = new Keyboard("id", 3, 1, ["a", "b", "C"]);
				keyboard.setCapitalisation(LOWERCASE);
				keyboard.setText("ab");

				var buttonC = keyboard.getChildWidgets()[2];
				buttonC.bubbleEvent(new SelectEvent(buttonC));
				
				assertEquals("abc", keyboard.getText());
		});

	};
	
	this.KeyboardTest.prototype.testCaptilisationForcesTitlecaseWhenTitlecaseFlagSet = function(queue) {
		expectAsserts(1);
	
		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/keyboard", "antie/events/keyevent", "antie/events/selectevent"],
			function(application, Keyboard, KeyEvent, SelectEvent) {
				var keyboard = new Keyboard("id", 3, 1, ["a", "b", "C"]);
				keyboard.setCapitalisation(TITLECASE);
				keyboard.setText("ab");

				var buttonC = keyboard.getChildWidgets()[2];
				buttonC.bubbleEvent(new SelectEvent(buttonC));
				
				assertEquals("Abc", keyboard.getText());
		});
	};
	
})();
