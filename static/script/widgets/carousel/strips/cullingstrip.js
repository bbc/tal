require.def('antie/widgets/carousel/strips/cullingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext',
        'antie/widgets/carousel/strips/utility/initstate'
    ],
    function (WidgetStrip, WidgetContext, InitState) {
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

            render: function (device) {
                var i, context;
                if (!this.outputElement) {
                    this.outputElement = device.createContainer(this.id, this.getClasses());
                } else {
                    device.clearElement(this.outputElement);
                }
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    context = this._widgetContexts[i];
                    context.setState(InitState);
                }
            },

            insert: function (index, widget, length) {
                this._super(index, widget, length);
                this._widgetContexts.splice(index, 0, new WidgetContext(widget, this));
            },

            remove: function (widget) {
                var i, widgets, returnValue;
                widgets = this.widgets();
                for (i = 0; i !== widgets.length; i += 1) {
                    if (widget === widgets[i]) {
                        this._widgetContexts.splice(i, 1);
                    }
                }
                returnValue = this._super(widget, false);

                return returnValue;
            },

            removeAll: function () {
                this._widgetContexts = [];
                this._super();
            },

            needsVisibleIndices: function () {
                return this._widgetContexts.length > 0;
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