/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ImageTest = AsyncTestCase('Image');

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
            'lib/mockapplication',
            ['antie/widgets/image','antie/widgets/container'],
            function(application, Image, Container) {
                assertEquals('Image should be a function', 'function', typeof Image);
                assert('Image should extend from Container', new Image() instanceof Container);
            });
    };
    
    this.ImageTest.prototype.testRenderContainerMode = function(queue) {
        expectAsserts(8);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/image'],
            function(application, Image) {
                var size = {width: 107, height: 32};
                var widget = new Image('id', 'about:blank', size, Image.RENDER_MODE_CONTAINER);
                widget.addClass('testClass');

                var device = application.getDevice();
                var createImageSpy = this.sandbox.spy(device, 'createImage');
                var el = widget.render(device);

                assert(createImageSpy.called);
                assertEquals(typeof device.createImage(), typeof el);
                assertEquals('id', el.id);
                var img = el.getElementsByTagName('img')[0];
                assertEquals('about:blank', img.src);
                assertEquals(size.width + 'px', el.style.width);
                assertEquals(size.height + 'px', el.style.height);
                assertClassName('image', el);
                assertClassName('testClass', el);
            }
        );
    };
    
    this.ImageTest.prototype.testRenderImgMode = function(queue) {
        expectAsserts(6);

        queuedApplicationInit(
                queue,
                'lib/mockapplication',
                ['antie/widgets/image'],
                function(application, Image) {
                    var widget = new Image('id', 'about:blank', null, Image.RENDER_MODE_IMG);
                    widget.addClass('testClass');

                    var device = application.getDevice();
                    var createImageSpy = this.sandbox.spy(device, 'createImage');
                    var el = widget.render(device);

                    assert(createImageSpy.called);
                    assertEquals(typeof device.createImage(), typeof el);
                    assertEquals('id_img', el.id);
                    assertEquals('about:blank', el.src);
                    assertClassName('image', el);
                    assertClassName('testClass', el);
                }
        );
    };

    this.ImageTest.prototype.testRenderUnspecifiedMode = function(queue) {
        expectAsserts(8);

        queuedApplicationInit(
                queue,
                'lib/mockapplication',
                ['antie/widgets/image'],
                function(application, Image) {
                    var size = {width: 107, height: 32};
                    var widget = new Image('id', 'about:blank', size);
                    widget.addClass('testClass');

                    var device = application.getDevice();
                    var createImageSpy = this.sandbox.spy(device, 'createImage');
                    var el = widget.render(device);

                    assert(createImageSpy.called);
                    assertEquals(typeof device.createImage(), typeof el);
                    assertEquals('id', el.id);
                    var img = el.getElementsByTagName('img')[0];
                    assertEquals('about:blank', img.src);
                    assertEquals(size.width + 'px', el.style.width);
                    assertEquals(size.height + 'px', el.style.height);
                    assertClassName('image', el);
                    assertClassName('testClass', el);
                }
        );
    };


    this.ImageTest.prototype.testSetGetSource = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            ['antie/widgets/image'],
            function(application, Image) {
                var size = {width: 107, height: 32};
                var widget = new Image('id', 'about:blank', size);
                assertEquals('about:blank', widget.getSrc());
                widget.setSrc('about:invalid');
                assertEquals('about:invalid', widget.getSrc());
            }
        );
    };
})();
