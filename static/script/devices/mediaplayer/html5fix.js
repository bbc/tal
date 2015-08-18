require.def(
    "antie/devices/mediaplayer/html5fix",
    [
        "antie/devices/mediaplayer/thefix",
        "antie/devices/mediaplayer/html5"
    ],
    function (TheFix, HTML5) {
        "use strict";

        TheFix(HTML5)
    }
);
