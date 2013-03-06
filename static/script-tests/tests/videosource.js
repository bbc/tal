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
	this.VideoSourceTest = AsyncTestCase("VideoSource");

	this.VideoSourceTest.prototype.setUp = function() {
	};

	this.VideoSourceTest.prototype.tearDown = function() {
	};

	this.VideoSourceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/videosource","antie/mediasource"], function(VideoSource, MediaSource) {

			assertEquals('VideoSource should be a function', 'function', typeof VideoSource);
			assert('VideoSource should extend from Class', new VideoSource() instanceof MediaSource);

		});
	};
	this.VideoSourceTest.prototype.testGetMediaType = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource", "antie/videosource"], function(MediaSource, VideoSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new VideoSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new VideoSource(MEDIA_URL2, MEDIA_TYPE2);

			assertEquals(MediaSource.MEDIA_TYPE_VIDEO, mediaSource1.getMediaType());
			assertEquals(MediaSource.MEDIA_TYPE_VIDEO, mediaSource2.getMediaType());
		});
	};
	this.VideoSourceTest.prototype.testGetURL = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"VIDEOURL"}, "audio":{"mediaURIFormat":"AUDIOURL"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/videosource"], function(application, VideoSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE1 = 'video/mp4';

			var mediaSource1 = new VideoSource(MEDIA_URL1, MEDIA_TYPE1);

			var url = mediaSource1.getURL();
			application.destroy();

			assertEquals("VIDEOURL", url);
		}, config);
	};
})();
