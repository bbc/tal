/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ComponentTest = AsyncTestCase('Component');

    this.ComponentTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ComponentTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    this.ComponentTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component','antie/widgets/container'],
            function(application, Component, Container) {
                assertEquals('Component should be a function', 'function', typeof Component);
                assert('Component should extend from Container', new Component() instanceof Container);
            });
    };
    this.ComponentTest.prototype.testRender = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component'],
            function(application, Component) {
                var widget = new Component('id');

                var device = application.getDevice();
                var createContainerSpy = this.sandbox.spy(device, 'createContainer');
                var el = widget.render(device);

                assert(createContainerSpy.called);
                assertEquals(typeof device.createListItem(), typeof el);
                assertEquals('id', el.id);
                assertClassName('container', el);
            }
        );
    };
    this.ComponentTest.prototype.testSetGetIsModal = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component'],
            function(application, Component) {
                var widget = new Component('id');
                assertFalse(widget.getIsModal());
                widget.setIsModal(true);
                assert(widget.getIsModal());
                widget.setIsModal(false);
                assertFalse(widget.getIsModal());
            }
        );
    };
    this.ComponentTest.prototype.testIsComponentReturnsTrue = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component'],
            function(application, Component) {
                var widget = new Component('id');
                assertTrue(widget.isComponent());
            }
        );
    };
    this.ComponentTest.prototype.testGetConfig = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component'],
            function(application, Component) {
                var widget = new Component('id');
                assertSame(antie.framework.deviceConfiguration, widget.getConfig());
            }
        );
    };
    this.ComponentTest.prototype.testGetCurrentState = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component'],
            function(application, Component) {
                var widget = new Component('id');
                assertNull(widget.getCurrentState());
            }
        );
    };
    this.ComponentTest.prototype.testHide = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/component', 'antie/widgets/componentcontainer'],
            function(application, Component, ComponentContainer) {
                var container = new ComponentContainer('container');
                var widget = new Component('id');
                container.appendChildWidget(widget);

                var hideSpy = this.sandbox.spy(container, 'hide');
                widget.hide();
                assert(hideSpy.called);
            }
        );
    };

})();
