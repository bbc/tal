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
	this.AudioSourceTest = AsyncTestCase("AudioSource");

	this.AudioSourceTest.prototype.setUp = function() {
	};

	this.AudioSourceTest.prototype.tearDown = function() {
	};

	this.AudioSourceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/audiosource","antie/mediasource"], function(AudioSource, MediaSource) {

			assertEquals('AudioSource should be a function', 'function', typeof AudioSource);
			assert('AudioSource should extend from Class', new AudioSource() instanceof MediaSource);

		});
	};
	this.AudioSourceTest.prototype.testGetMediaType = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource", "antie/audiosource"], function(MediaSource, AudioSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/audio.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new AudioSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new AudioSource(MEDIA_URL2, MEDIA_TYPE2);

			assertEquals(MediaSource.MEDIA_TYPE_AUDIO, mediaSource1.getMediaType());
			assertEquals(MediaSource.MEDIA_TYPE_AUDIO, mediaSource2.getMediaType());
		});
	};
	this.AudioSourceTest.prototype.testGetURL = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"VIDEOURL"}, "audio":{"mediaURIFormat":"AUDIOURL"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/audiosource"], function(application, AudioSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE1 = 'video/mp4';

			var mediaSource1 = new AudioSource(MEDIA_URL1, MEDIA_TYPE1);

			var url = mediaSource1.getURL();
			application.destroy();

			assertEquals("AUDIOURL", url);
		}, config);
	};

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(["antie/mediasource", "antie/audiosource"], this.AudioSourceTest);

})();
