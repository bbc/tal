/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.HTML5MediaPlayerTests = AsyncTestCase('HTML5MediaPlayer');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

    // Mixin the common tests shared by all HTML5 MediaPlayer implementations
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5MediaPlayerTests, 'antie/devices/mediaplayer/html5', config);

})();
