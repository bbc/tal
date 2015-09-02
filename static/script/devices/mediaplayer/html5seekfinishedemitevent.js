require.def(
    "antie/devices/mediaplayer/html5seekfinishedemitevent",
    [
        "antie/devices/mediaplayer/seekfinishedemitevent",
        "antie/devices/mediaplayer/html5"
    ],
    function (SeekFinishedEmitEvent, HTML5) {
        "use strict";

        SeekFinishedEmitEvent(HTML5);

        return HTML5;
    }
);
