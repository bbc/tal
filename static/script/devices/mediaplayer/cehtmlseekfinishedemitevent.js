require.def(
    "antie/devices/mediaplayer/cehtmlseekfinishedemitevent",
    [
        "antie/devices/mediaplayer/seekfinishedemitevent",
        "antie/devices/mediaplayer/cehtml"
    ],
    function (SeekFinishedEmitEvent, CEHTML) {
        "use strict";

        SeekFinishedEmitEvent(CEHTML);

        return CEHTML;
    }
);
