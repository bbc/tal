/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    var UPPERCASE = 0,
        LOWERCASE = 1,
        TITLECASE = 2;

    this.KeyboardTest = AsyncTestCase('Keyboard');

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
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {

                var keyboard = new Keyboard('id', 1, 1, ['a']);

                keyboard.setMultiTap(true);
                assert(keyboard.getMultiTap());

                keyboard.setMultiTap(false);
                assertFalse(keyboard.getMultiTap());
            });

    };

    this.KeyboardTest.prototype.testStandardMultiTap = function (queue) {
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 1, 6, ['a','b','c']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                assertEquals('b', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testWaitMultiTap = function (queue) {
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var clock = sinon.useFakeTimers(),
                    keyboard = new Keyboard('id', 1, 6, ['a','b','c']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                clock.tick(1500);
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                assertEquals('ba', keyboard.getText());
                clock.restore();
            }, config);
    };

    var _verifyButton = function (keyboard, button, expectedCol, expectedRow, expectedCharacter) {
        var expectedId = 'id_' +expectedCharacter+ '_' +expectedCol+ '_' +expectedRow;

        assertEquals(expectedId, button.id);
        assert(button.hasClass('key' + expectedCharacter));
        assertEquals(expectedCharacter, button.getDataItem());
        assertEquals(keyboard.getWidgetAt(expectedCol, expectedRow), button);
    };

    this.KeyboardTest.prototype.testKeyboardBuiltWithCorrectNumberOfRowsAndCols = function (queue) {
        expectAsserts(25);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {
                var keyboard = new Keyboard('id', 3, 2, ['a', 'b', 'c',
                                                         'd', 'e', 'f']);

                assertEquals(6, keyboard.getChildWidgets().length);

                _verifyButton(keyboard, keyboard.getChildWidgets()[0], 0, 0, 'a');
                _verifyButton(keyboard, keyboard.getChildWidgets()[1], 1, 0, 'b');
                _verifyButton(keyboard, keyboard.getChildWidgets()[2], 2, 0, 'c');
                _verifyButton(keyboard, keyboard.getChildWidgets()[3], 0, 1, 'd');
                _verifyButton(keyboard, keyboard.getChildWidgets()[4], 1, 1, 'e');
                _verifyButton(keyboard, keyboard.getChildWidgets()[5], 2, 1, 'f');
            });
    };

    var _verifySpecialKeyBuildsCorrectly = function(queue, triggerCharacter, buttonText) {
        expectAsserts(3);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {
                var keyboard = new Keyboard('id', 1, 1, [triggerCharacter]);
                var firstButton = keyboard.getChildWidgets()[0];

                assertEquals('id_' +buttonText+ '_0_0', firstButton.id);
                assertEquals(buttonText, firstButton.getDataItem());
                assertEquals(1, keyboard.getChildWidgets().length);
            });
    };

    this.KeyboardTest.prototype.testKeyboardBuiltWithSpaceKey = function (queue) {
        _verifySpecialKeyBuildsCorrectly(queue, ' ', 'SPACE');
    };

    this.KeyboardTest.prototype.testKeyboardBuiltWithDelKey = function (queue) {
        _verifySpecialKeyBuildsCorrectly(queue, '-', 'DEL');
    };

    this.KeyboardTest.prototype.testKeyboardBuiltWithEmptyNonFunctioningSpacer = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {
                var keyboard = new Keyboard('id', 1, 1, ['_']);
                var firstButton = keyboard.getChildWidgets()[0];

                assertNull(firstButton);
                assertEquals(1, keyboard.getChildWidgets().length);
            });
    };

    //text
    // text set correctly
    // set maxlength class if at maxlength and have focus on '-' key

    this.KeyboardTest.prototype.testSettingAndGettingOfText = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {

                var someText = 'some text';
                var someOtherText = 'some text';
                var keyboard = new Keyboard('id', 1, 1, ['a']);

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
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {

                this.sandbox.spy(Keyboard.prototype, 'setActiveChildKey');
                this.sandbox.spy(Keyboard.prototype, 'removeClass');

                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                var maxLengthText = 'abcde';
                keyboard.setMaximumLength(5);

                assertFalse(keyboard.hasClass('maxlength'));

                keyboard.setText(maxLengthText);

                assertTrue(keyboard.hasClass('maxlength'));
                assert(Keyboard.prototype.setActiveChildKey.calledOnce);
                assertEquals('-', Keyboard.prototype.setActiveChildKey.args[0][0]);
            });
    };

    this.KeyboardTest.prototype.testSetTextRemovesMaxlengthClassWhenSetTextWithLengthLessThanMaxlength = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard'],
            function(application, Keyboard) {

                this.sandbox.spy(Keyboard.prototype, 'removeClass');

                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                var maxLengthText = 'abcde';
                var notMaxLengthText = 'abc';
                keyboard.setMaximumLength(5);

                keyboard.setText(maxLengthText);

                assertTrue(keyboard.hasClass('maxlength'));

                keyboard.setText(notMaxLengthText);

                assertFalse(keyboard.hasClass('maxlength'));
            });
    };

    this.KeyboardTest.prototype.testCaptilisationForcesUppercaseWhenUppercaseFlagSet = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent', 'antie/events/selectevent'],
            function(application, Keyboard, KeyEvent, SelectEvent) {
                var keyboard = new Keyboard('id', 3, 1, ['A', 'B', 'c']);
                keyboard.setCapitalisation(UPPERCASE);
                keyboard.setText('AB');

                var buttonC = keyboard.getChildWidgets()[2];
                buttonC.bubbleEvent(new SelectEvent(buttonC));

                assertEquals('ABC', keyboard.getText());
            });
    };

    this.KeyboardTest.prototype.testCaptilisationForcesLowercaseWhenLowercaseFlagSet = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent', 'antie/events/selectevent'],
            function(application, Keyboard, KeyEvent, SelectEvent) {
                var keyboard = new Keyboard('id', 3, 1, ['a', 'b', 'C']);
                keyboard.setCapitalisation(LOWERCASE);
                keyboard.setText('ab');

                var buttonC = keyboard.getChildWidgets()[2];
                buttonC.bubbleEvent(new SelectEvent(buttonC));

                assertEquals('abc', keyboard.getText());
            });

    };

    this.KeyboardTest.prototype.testCaptilisationForcesTitlecaseWhenTitlecaseFlagSet = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent', 'antie/events/selectevent'],
            function(application, Keyboard, KeyEvent, SelectEvent) {
                var keyboard = new Keyboard('id', 3, 1, ['a', 'b', 'C']);
                keyboard.setCapitalisation(TITLECASE);
                keyboard.setText('ab');

                var buttonC = keyboard.getChildWidgets()[2];
                buttonC.bubbleEvent(new SelectEvent(buttonC));

                assertEquals('Abc', keyboard.getText());
            });
    };

    this.KeyboardTest.prototype.testTripleTapOfNewFirstCharacterWhenOneBeforeMaxLengthIsAccepted = function(queue) {
        expectAsserts(2);
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                keyboard.setMaximumLength(5);
                keyboard.setText('abcd');

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                assertEquals('abcda', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testTripleTapOfNewSecondaryCharacterWhenOneBeforeMaxLengthIsAccepted = function(queue) {
        expectAsserts(2);
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                keyboard.setMaximumLength(5);
                keyboard.setText('abcd');

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                assertEquals('abcdb', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testTripleTapOfTwoCharactersWhenOneBeforeMaxLengthFirstIsAccepted = function(queue) {
        expectAsserts(2);
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c'],
            '3': ['d', 'e', 'f']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 6, 1, ['a', 'b', 'c', 'd', 'e', 'f']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                keyboard.setMaximumLength(5);
                keyboard.setText('abcd');

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_3));
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                assertEquals('abcdd', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testTripleTapOfNewFirstCharacterWhenAtMaxLengthIsIgnored = function(queue) {
        expectAsserts(2);
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                var maxLengthText = 'abcde';
                keyboard.setMaximumLength(5);
                keyboard.setText(maxLengthText);

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                assertEquals('abcde', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testTripleTapOfNewSecondaryCharacterWhenAtMaxLengthIsIgnored = function(queue) {
        expectAsserts(2);
        // Use JSON.parse/stringify to create a copy of the device config
        var config = JSON.parse(JSON.stringify(antie.framework.deviceConfiguration));
        config.input.multitap = {
            '2': ['a', 'b', 'c']
        };
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/events/keyevent'],
            function(application, Keyboard, KeyEvent) {
                var keyboard = new Keyboard('id', 5, 1, ['a', 'b', 'c', 'd', 'e']);
                keyboard.setMultiTap(true);
                keyboard.setCapitalisation(Keyboard.CAPITALISATION_LOWER);

                var maxLengthText = 'abcde';
                keyboard.setMaximumLength(5);
                keyboard.setText(maxLengthText);

                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_2));

                assertEquals('abcde', keyboard.getText());
            }, config);
    };

    this.KeyboardTest.prototype.testKeyboardModalityHorizontal = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/widgets/grid', 'antie/events/keyevent'],
            function(application, Keyboard, Grid, KeyEvent) {
                var keyboard = new Keyboard('id', 3, 2, ['a', 'b', 'c',
                                                         'd', 'e', 'f'],
                                                         Grid.WRAP_MODE.HORIZONTAL.ON,
                                                         Grid.WRAP_MODE.VERTICAL.OFF);

                //a -> b
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //b -> c
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //c -> a
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //a -> b
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                assertEquals('b', keyboard.getActiveChildWidget().getChildWidgets()[0].getText());
            });
    };

    this.KeyboardTest.prototype.testKeyboardModalityVertical = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/widgets/grid', 'antie/events/keyevent'],
            function(application, Keyboard, Grid, KeyEvent) {
                var keyboard = new Keyboard('id', 3, 3, ['a', 'b', 'c',
                                                         'd', 'e', 'f',
                                                         'g', 'h', 'i'],
                                                         Grid.WRAP_MODE.HORIZONTAL.OFF,
                                                         Grid.WRAP_MODE.VERTICAL.ON);

                //a -> d
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //d -> g
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //g -> a
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //a -> d
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                assertEquals('d', keyboard.getActiveChildWidget().getChildWidgets()[0].getText());
            });
    };

    this.KeyboardTest.prototype.testKeyboardModalityHorizontalVertical = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/keyboard', 'antie/widgets/grid', 'antie/events/keyevent'],
            function(application, Keyboard, Grid, KeyEvent) {
                var keyboard = new Keyboard('id', 3, 3, ['a', 'b', 'c',
                                                         'd', 'e', 'f',
                                                         'g', 'h', 'i'],
                                                         Grid.WRAP_MODE.HORIZONTAL.ON,
                                                         Grid.WRAP_MODE.VERTICAL.ON);

                //a -> d
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //d -> g
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //g -> a
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //a -> d
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_DOWN));

                //d -> e
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //e -> f
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //f -> d
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                //d -> e
                keyboard.fireEvent(new KeyEvent('keydown', KeyEvent.VK_RIGHT));

                assertEquals('e', keyboard.getActiveChildWidget().getChildWidgets()[0].getText());
            });
    };

})();
