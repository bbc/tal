/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.AudioSourceTest = AsyncTestCase('AudioSource');

    this.AudioSourceTest.prototype.setUp = function() {
    };

    this.AudioSourceTest.prototype.tearDown = function() {
    };

    this.AudioSourceTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/audiosource','antie/mediasource'], function(AudioSource, MediaSource) {

            assertEquals('AudioSource should be a function', 'function', typeof AudioSource);
            assert('AudioSource should extend from Class', new AudioSource() instanceof MediaSource);

        });
    };
    this.AudioSourceTest.prototype.testGetMediaType = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/mediasource', 'antie/audiosource'], function(MediaSource, AudioSource) {
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

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':[]},'streaming':{'video':{'mediaURIFormat':'VIDEOURL'}, 'audio':{'mediaURIFormat':'AUDIOURL'}}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/audiosource'], function(application, AudioSource) {
            var MEDIA_URL1 = 'http://endpoint.invalid/video.mp4';
            var MEDIA_TYPE1 = 'video/mp4';

            var mediaSource1 = new AudioSource(MEDIA_URL1, MEDIA_TYPE1);

            var url = mediaSource1.getURL();
            application.destroy();

            assertEquals('AUDIOURL', url);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/mediasource', 'antie/audiosource'], this.AudioSourceTest);

})();
