require.def('antie/widgets/carousel/strips/cullingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext'
    ],
    function (WidgetStrip, WidgetContext) {
        'use strict';
        var CullingStrip;
        CullingStrip = WidgetStrip.extend({
            init: function (id, orientation) {
                this._super(id, orientation);
                this.setAutoRenderChildren(false);
                this._widgetContexts = [];
            },

            append: function (widget, length) {
                this._super(widget, length);
                this._widgetContexts.push(new WidgetContext(widget, this));
            },

            hasDetachedWidgets: function () {
                var context, hasDetached, i;
                hasDetached = false;
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    context = this._widgetContexts[i];
                    hasDetached = hasDetached || !(context.attached());
                }
                return hasDetached;
            },

            attachIndexedWidgets: function (indexArray) {
                var i, itemIndex;
                for (i = 0; i !== indexArray.length; i += 1) {
                    itemIndex = indexArray[i];
                    this._widgetContexts[itemIndex].append();
                }
            }
        });
        return CullingStrip;
    }
);