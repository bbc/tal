/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ListItemTest = AsyncTestCase('ListItem');

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
            'lib/mockapplication',
            ['antie/widgets/listitem','antie/widgets/container'],
            function(application, ListItem, Container) {
                assertEquals('ListItem should be a function', 'function', typeof ListItem);
                assert('ListItem should extend from Container', new ListItem() instanceof Container);
            });
    };
    this.ListItemTest.prototype.testRender = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/listitem'],
            function(application, ListItem) {
                var widget = new ListItem('id');

                var device = application.getDevice();
                var createListItemSpy = this.sandbox.spy(device, 'createListItem');
                var el = widget.render(device);

                assert(createListItemSpy.called);
                assertEquals(typeof device.createListItem(), typeof el);
                assertEquals('id', el.id);
                assertClassName('listitem', el);
            }
        );
    };
})();
