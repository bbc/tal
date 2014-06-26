/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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
    this.MediaTest = AsyncTestCase("MediaTest");

    this.MediaTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaTest.prototype.testEmbedModeConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(3);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.EMBED_MODE_EXTERNAL, Media.EMBED_MODE_EXTERNAL);
            assertEquals(MediaInterface.EMBED_MODE_BACKGROUND, Media.EMBED_MODE_BACKGROUND);
            assertEquals(MediaInterface.EMBED_MODE_EMBEDDED, Media.EMBED_MODE_EMBEDDED);
        });
    };

    this.MediaTest.prototype.testNetworkConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.NETWORK_EMPTY, Media.NETWORK_EMPTY);
            assertEquals(MediaInterface.NETWORK_IDLE, Media.NETWORK_IDLE);
            assertEquals(MediaInterface.NETWORK_LOADING, Media.NETWORK_LOADING);
            assertEquals(MediaInterface.NETWORK_NO_SOURCE, Media.NETWORK_NO_SOURCE);
        });
    };

    this.MediaTest.prototype.testDataPresenceConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.MEDIA_ERR_UNKNOWN, Media.MEDIA_ERR_UNKNOWN);
            assertEquals(MediaInterface.MEDIA_ERR_ABORTED, Media.MEDIA_ERR_ABORTED);
            assertEquals(MediaInterface.MEDIA_ERR_NETWORK, Media.MEDIA_ERR_NETWORK);
            assertEquals(MediaInterface.MEDIA_ERR_DECODE, Media.MEDIA_ERR_DECODE);
            assertEquals(MediaInterface.MEDIA_ERR_SRC_NOT_SUPPORTED, Media.MEDIA_ERR_SRC_NOT_SUPPORTED);
        });
    };


})();
