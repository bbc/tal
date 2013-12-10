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
                var i, itemIndex, indexSet, firstAttachedIndex;
                indexSet = {};
                firstAttachedIndex = this._firstAttachedIndex();

                for (i = 0; i !== indexArray.length; i += 1) {
                    itemIndex = indexArray[i];
                    indexSet[itemIndex] = true;
                    if (itemIndex < firstAttachedIndex) {
                        this._widgetContexts[itemIndex].prepend();
                    } else {
                        this._widgetContexts[itemIndex].append();
                    }
                }

                this._detatchWidgetsNotIndexed(indexSet);
            },

            _detatchWidgetsNotIndexed: function (indexSet) {
                var i;
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    if (!indexSet.hasOwnProperty(i)) {
                        this._widgetContexts[i].detach();
                    }
                }
            },

            _firstAttachedIndex: function () {
                var i, attached, firstAttachedIndex;
                i = 0;
                attached = false;
                while (i < this._widgetContexts.length && attached === false) {
                    attached = this._widgetContexts[i].attached();
                    i += 1;
                }
                firstAttachedIndex = i;
                return firstAttachedIndex;
            }
        });
        return CullingStrip;
    }
);