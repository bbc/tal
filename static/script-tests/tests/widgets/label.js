/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.LabelTest = AsyncTestCase('Label');

    this.LabelTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.LabelTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    this.LabelTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/label','antie/widgets/widget'],
            function(application, Label, Widget) {
                assertEquals('Label should be a function', 'function', typeof Label);
                assert('Label should extend from Widget', new Label() instanceof Widget);
            });
    };
    this.LabelTest.prototype.testRender = function(queue) {
        expectAsserts(5);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/label'],
            function(application, Label) {
                var widget = new Label('hello', 'world');

                var device = application.getDevice();
                var createLabelSpy = this.sandbox.spy(device, 'createLabel');
                var el = widget.render(device);
                assert(createLabelSpy.called);
                assertSame(typeof device.createLabel(), typeof el);
                assertEquals('hello', el.id);
                assertEquals('world', el.innerHTML);
                assertClassName('label', el);
            }
        );
    };
    this.LabelTest.prototype.testSetGetText = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/label'],
            function(application, Label) {
                var widget1 = new Label('hello');
                assertEquals('hello', widget1.getText());

                var widget2 = new Label('id', 'world');
                assertEquals('world', widget2.getText());

                widget2.setText('goodbye');
                assertEquals('goodbye', widget2.getText());
            }
        );
    };
})();
