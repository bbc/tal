require.def('antie/widgets/carousel/strips/hidingstrip',
    [
        'antie/widgets/carousel/strips/cullingstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext',
        'antie/widgets/carousel/strips/utility/visibilitystates'
    ],
    function (CullingStrip, WidgetContext, VISIBILITY_STATES) {
        'use strict';
        var HidingStrip;
        HidingStrip = CullingStrip.extend({
            createContext: function (widget, parent) {
                return new WidgetContext(widget, parent, VISIBILITY_STATES);
            }
        });
        return HidingStrip;
    }
);