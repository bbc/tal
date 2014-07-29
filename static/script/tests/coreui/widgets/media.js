require(
	[
	 	'bstests/helper',
	 	'antie/mediasource'
	],
	function(helper, MediaSource) {
    module('bstests/widgets/media');

    var MEDIA_URL = "http://downloads.bbc.co.uk/iplayer/idcp/BR_HD_Barker_H264_TV1500_high32_2passVBR_2.mp4";

    helper.mediaTest('constructor via Device.createPlayer', 1, function(media, tearDownFunction) {
        require(
                ['antie/widgets/media']
                , function(Media) {
                    ok(media instanceof Media, "Device.createPlayer returns an object which is an instance of a Media widget");
                    tearDownFunction();
                }
        );
    });

    helper.mediaTest('render', 1, function(media, tearDownFunction) {
        // What is actually returned is dependant upon the devices media widget
        ok(media.render(media.getCurrentApplication().getDevice()) != null, "media.render() does not return null or undefined");
        tearDownFunction();
    });

    helper.mediaTest('setWindow', 5, function(media, tearDownFunction) {
        var device = media.getCurrentApplication().getDevice();
        var mediaElement = media.render(device);
        ok(device.getElementOffset(mediaElement), 'Able to get rendered media element offset');

        media.setWindow(100, 200, 300, 400);

        equal(device.getElementOffset(mediaElement).top, 200, "Element offset top equals expected value");
        equal(device.getElementOffset(mediaElement).left, 100, "Element offset left equals expected value");
        equal(device.getElementSize(mediaElement).width, 300, "Element offset width equals expected value");
        equal(device.getElementSize(mediaElement).height, 400, "Element offset height equals expected value");
        tearDownFunction();
    });

    helper.mediaTestWithPlayback("getCurrentSource", [new MediaSource(MEDIA_URL, 'video/mp4')], 1, function(media) {
        equal(media.getCurrentSource(), MEDIA_URL, "Current media matches expected media");
    });

    var MEDIA_URL_APOSTROPHES = "http://downloads.bbc.co.uk/iplayer/idcp/BR_HD_Barker_H264_TV1500_high32_2passVBR_2.mp4?i_haz_apostrophe'burgerz";
    var MEDIA_URL_APOSTROPHES_DECODED = "http://downloads.bbc.co.uk/iplayer/idcp/BR_HD_Barker_H264_TV1500_high32_2passVBR_2.mp4?i_haz_apostrophe%27burgerz";

    helper.mediaTestWithPlayback("getCurrentSource replaces apostrophes", [new MediaSource(MEDIA_URL_APOSTROPHES, 'video/mp4')], 1, function(media) {
        equal(media.getCurrentSource(), MEDIA_URL_APOSTROPHES_DECODED, "getCurrentSource has replaced the apostrophe with %27");
    });

    helper.mediaTestWithPlayback("setSources and getSources", [new MediaSource(MEDIA_URL, 'video/mp4')], 1, function(media) {
        ok(media.getSources()[0].isEqual(new MediaSource(MEDIA_URL, 'video/mp4')), "getSources matches media that was set by setSources.");
    });

});
