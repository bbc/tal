require(
	[
	 	'bstests/helper',
	 	'antie/mediasource'
	],
	function(helper, MediaSource) {
    module('bstests/devices/media/html5');

    var MEDIA_URL1 = "http://downloads.bbc.co.uk/iplayer/idcp/BR_HD_Barker_H264_TV1500_high32_2passVBR_2.mp4";
    var MEDIA_URL2 = "http://downloads.bbc.co.uk/iplayer/idcp/b00tv92s_1284560975.mp4";

    var MEDIA_SOURCE1 = new MediaSource(MEDIA_URL1, 'video/mp4');
    var MEDIA_SOURCE2 = new MediaSource(MEDIA_URL2, 'video/mp4');

    function html5VideoTest(sources) {
        var NUMBER_OF_TESTS_OUTSIDE_OF_LOOP = 3;
        var NUMBER_OF_TESTS_IN_LOOP = 3;

        helper.mediaTestWithPlayback('render with ' + sources.length + " sources", sources, ((sources.length*NUMBER_OF_TESTS_IN_LOOP)+NUMBER_OF_TESTS_OUTSIDE_OF_LOOP), function(media) {
            // What is actually returned is dependant upon the devices media widget
            var renderedElement = media.render(media.getCurrentApplication().getDevice());
            var sourceElements = renderedElement.getElementsByTagName("source");

            ok(renderedElement != null, "media.render() does not return null or undefined");
            equal(renderedElement.tagName.toUpperCase(), "VIDEO", "Tag is video");
            equal(sourceElements.length, sources.length, "Number of source elements is correct");

            for (var i = 0; i < sources.length; i++) {
                equal(sourceElements[i].src, sources[i].src, "First element of source has src attribute pointing to correct src url");
                ok(sourceElements[i].type.length > 0, "Type attribute of source element is non empty string");
                equal(sourceElements[i].type, "video/mp4", "Type attribute of source element matches expected value");
            }
        });
    }

    html5VideoTest([MEDIA_SOURCE1]);
    html5VideoTest([MEDIA_SOURCE1, MEDIA_SOURCE2]);
});