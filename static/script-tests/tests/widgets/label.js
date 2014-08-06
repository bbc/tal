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
	this.LabelTest = AsyncTestCase("Label");

	this.LabelTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.LabelTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

    function stubDeviceConfig(sandbox, device, deviceSupportsTruncation) {
        sandbox.stub(device.prototype, "getConfig", function() {
            return {
                css: {
                    supportsTextTruncation: deviceSupportsTruncation
                }
            };
        });
    }


	this.LabelTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
            [
                "antie/widgets/label",
                "antie/widgets/widget"
            ],
			function(application, Label, Widget) {
				assertEquals('Label should be a function', 'function', typeof Label);
				assert('Label should extend from Widget', new Label() instanceof Widget);
		});
	};
 	this.LabelTest.prototype.testRender = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
               ["antie/widgets/label"],
				function(application, Label) {
					var widget = new Label("hello", "world");

					var device = application.getDevice();
					var createLabelSpy = this.sandbox.spy(device, 'createLabel');
					var el = widget.render(device);
					assert(createLabelSpy.called);
					assertSame(typeof device.createLabel(), typeof el);
					assertEquals("hello", el.id);
					assertEquals("world", el.innerHTML);
					assertClassName("label", el);
				}
		);
	};
 	this.LabelTest.prototype.testSetGetText = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
                ["antie/widgets/label"],
				function(application, Label) {
                    stubDeviceConfig(this.sandbox, Label, null, false);

					var widget1 = new Label("hello");
					assertEquals("hello", widget1.getText());

					var widget2 = new Label("id", "world");
					assertEquals("world", widget2.getText());

					widget2.setText("goodbye");
					assertEquals("goodbye", widget2.getText());
				}
		);
	};

	this.LabelTest.prototype.testTruncateTextCalledAfterTimeoutOfZeroWhenTruncationIsEnabledOnFirstRender = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/label"],
				function(application, Label) {
                    var device = application.getDevice();
                    stubDeviceConfig(this.sandbox, device, false);

                    var clock = this.sandbox.useFakeTimers();

                    var label = new Label("hello");
                    var truncateTextSpy = this.sandbox.stub(label, '_truncateText');
                    label.setTruncationMode(Label.TRUNCATION_MODE_RIGHT_ELLIPSIS);
                    label.render(device);
                    assert(!truncateTextSpy.called)
                    clock.tick(0);
                    assert(truncateTextSpy.called);
				}
		);
	};

    this.LabelTest.prototype.testTruncateTextCalledImmediatelyWhenTruncationIsEnabledOnFutureRenders = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label"],
            function(application, Label) {
                var device = application.getDevice();
                stubDeviceConfig(this.sandbox, device, false);

                var clock = this.sandbox.useFakeTimers();

                var label = new Label("hello");
                var truncateTextSpy = this.sandbox.stub(label, '_truncateText');
                label.setTruncationMode(Label.TRUNCATION_MODE_RIGHT_ELLIPSIS);
                label.render(device);
                clock.tick(0);
                label.setText("Something else");
                assert(truncateTextSpy.called);
            }
        );
    };
})();