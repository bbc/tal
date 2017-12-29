/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ApplicationEventsTest = AsyncTestCase('Application_Events');

    this.ApplicationEventsTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationEventsTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.ApplicationEventsTest.prototype.testBubbleEvent = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/button', 'antie/events/focusevent'],
            function(application, Button, FocusEvent) {
                var root = application.getRootWidget();
                var button = new Button();
                root.appendChildWidget(button);

                var onFocus = this.sandbox.stub();
                button.addEventListener('focus', onFocus);

                application.bubbleEvent(new FocusEvent(button));

                assert(onFocus.called);
            }
        );
    };

    this.ApplicationEventsTest.prototype.testBroadcastEvent = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/button', 'antie/events/focusevent'],
            function(application, Button, FocusEvent) {
                var root = application.getRootWidget();
                var button = new Button();
                root.appendChildWidget(button);

                var onFocus = this.sandbox.stub();
                button.addEventListener('focus', onFocus);

                application.broadcastEvent(new FocusEvent(button));

                assert(onFocus.called);
            }
        );
    };

    this.ApplicationEventsTest.prototype.testAddEventListener = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/button', 'antie/events/focusevent'],
            function(application, Button, FocusEvent) {
                var root = application.getRootWidget();
                var button = new Button();
                root.appendChildWidget(button);

                var onFocus = this.sandbox.stub();
                application.addEventListener('focus', onFocus);

                application.bubbleEvent(new FocusEvent(button));

                assertEquals(1, onFocus.callCount);
            }
        );
    };

    this.ApplicationEventsTest.prototype.testRemoveEventListener = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/button', 'antie/events/focusevent'],
            function(application, Button, FocusEvent) {
                var root = application.getRootWidget();
                var button = new Button();
                root.appendChildWidget(button);

                var onFocus = this.sandbox.stub();
                application.addEventListener('focus', onFocus);
                application.removeEventListener('focus', onFocus);

                application.bubbleEvent(new FocusEvent(button));

                assertFalse(onFocus.called);
            }
        );
    };

})();
