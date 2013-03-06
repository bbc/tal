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
	this.MediaSourceTest = AsyncTestCase("MediaSource");

	this.MediaSourceTest.prototype.setUp = function() {
	};

	this.MediaSourceTest.prototype.tearDown = function() {
	};

	this.MediaSourceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource","antie/class"], function(MediaSource, Class) {

			assertEquals('MediaSource should be a function', 'function', typeof MediaSource);
			assert('MediaSource should extend from Class', new MediaSource() instanceof Class);

		});
	};

	this.MediaSourceTest.prototype.testConstructor = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE = 'video/mp4';

			var mediaSource = new MediaSource(MEDIA_URL, MEDIA_TYPE);

			assertEquals('MediaSource.src set by constructor', MEDIA_URL, mediaSource.src);
			assertEquals('MediaSource.type set by constructor', MEDIA_TYPE, mediaSource.type);

		});
	};

	this.MediaSourceTest.prototype.testIsEqualReturnsTrueWhenSourcesAreEqual = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE = 'video/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL, MEDIA_TYPE);
			var mediaSource2 = new MediaSource(MEDIA_URL, MEDIA_TYPE);

			assert('isEqual returns true for equal media sources', mediaSource1.isEqual(mediaSource2));
		});
	};

	this.MediaSourceTest.prototype.testIsEqualReturnsFalseWhenURLsDiffer = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE = 'video/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE);
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE);

			assertFalse('isEqual returns false for differing media sources', mediaSource1.isEqual(mediaSource2));
		});
	};

	this.MediaSourceTest.prototype.testIsEqualReturnsFalseWhenTypesDiffer = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL, MEDIA_TYPE1);
			var mediaSource2 = new MediaSource(MEDIA_URL, MEDIA_TYPE2);

			assertFalse('isEqual returns false for differing media sources', mediaSource1.isEqual(mediaSource2));
		});
	};

	this.MediaSourceTest.prototype.testIsEqualReturnsFalseWhenURLsAndTypesDiffer = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE2);

			assertFalse('isEqual returns false for differing media sources', mediaSource1.isEqual(mediaSource2));
		});
	};

	this.MediaSourceTest.prototype.testGetContentType = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE2);

			assertEquals(MEDIA_TYPE1, mediaSource1.getContentType());
			assertEquals(MEDIA_TYPE2, mediaSource2.getContentType());
		});
	};
	this.MediaSourceTest.prototype.testGetMediaType = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'audio/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE2);

			assertEquals(MediaSource.MEDIA_TYPE_UNKNOWN, mediaSource1.getMediaType());
			assertEquals(MediaSource.MEDIA_TYPE_UNKNOWN, mediaSource2.getMediaType());
		});
	};
	this.MediaSourceTest.prototype.testGetURLUsesConfig = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"VIDEO"}, "audio":{"mediaURIFormat":"AUDIO"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/mediasource"], function(application, MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE1 = 'video/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);

			var url = mediaSource1.getURL();
			application.destroy();

			assertEquals("VIDEO", url);
		}, config);
	};
	this.MediaSourceTest.prototype.testGetURL = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"%href%"}, "audio":{"mediaURIFormat":"%href%"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/mediasource"], function(application, MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE1 = 'video/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);

			var url = mediaSource1.getURL();
			application.destroy();

			assertEquals(MEDIA_URL1, url);
		}, config);
	};
	this.MediaSourceTest.prototype.testGetURLLiveStreamUsesUsualFormatter = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"%href%|normal"}, "audio":{"mediaURIFormat":"%href%"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/mediasource"], function(application, MediaSource) {
			var MEDIA_URL2 = 'http://endpoint.invalid/video.mp4';
			var MEDIA_TYPE2 = 'application/vnd.apple.mpegurl';
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE2);
			var url2 = mediaSource2.getURL();
			application.destroy();
			assertEquals(MEDIA_URL2 + "%7Cnormal", url2);

		}, config);
	};
	this.MediaSourceTest.prototype.testGetURLWithTags = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":[]},"streaming":{"video":{"mediaURIFormat":"%href%"}, "audio":{"mediaURIFormat":"%href%"}}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/mediasource"], function(application, MediaSource) {
			var MEDIA_URL1 = '---%a%%b%%c%---...---%x%%x%%z%!';
			var MEDIA_TYPE1 = 'video/mp4';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);

			var url = mediaSource1.getURL({
				"%a%": "AAA",
				"%b%": "BBB",
				"%y%": "_Y_",
				"%z%": "_Z_"
			});
			application.destroy();

			assertEquals("---AAABBB%25c%25---...---%25x%25%25x%25_Z_!", url);
		}, config);
	};
	this.MediaSourceTest.prototype.testIsLiveStreamStatic = function(queue) {
	   expectAsserts(2);

	   queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
		   var MEDIA_TYPE1 = 'video/mp4';
		   var MEDIA_TYPE2 = 'application/vnd.apple.mpegurl';

		   assertFalse(MediaSource.isLiveStream(MEDIA_TYPE1));
		   assertTrue(MediaSource.isLiveStream(MEDIA_TYPE2));
	   });
   };

 	this.MediaSourceTest.prototype.testIsLiveStream = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/mediasource"], function(MediaSource) {
			var MEDIA_URL1 = 'http://endpoint.invalid/video_1.mp4';
			var MEDIA_URL2 = 'http://endpoint.invalid/video_2.mp4';
			var MEDIA_TYPE1 = 'video/mp4';
			var MEDIA_TYPE2 = 'application/vnd.apple.mpegurl';

			var mediaSource1 = new MediaSource(MEDIA_URL1, MEDIA_TYPE1);
			var mediaSource2 = new MediaSource(MEDIA_URL2, MEDIA_TYPE2);

			assertFalse(mediaSource1.isLiveStream());
			assertTrue(mediaSource2.isLiveStream());
		});
	};
})();
