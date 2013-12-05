require.def('antie/widgets/carousel/strips/cullingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip'
    ],
    function (WidgetStrip) {
        'use strict';
        var CullingStrip;
        CullingStrip = WidgetStrip.extend({
            init: function (id, orientation) {
                this._super(id, orientation);
                this._detachedWidgets = {};
                this.setAutoRenderChildren(false);
            },

            append: function (widget, length) {
                this._super(widget, length);
                this._detachedWidgets[widget.id] = true;
            },

            hasDetachedWidgets: function () {
                var hasDetached, property;
                hasDetached = false;
                for (property in this._detachedWidgets) {
                    if (this._detachedWidgets.hasOwnProperty(property)) {
                        hasDetached = true;
                    }
                }
                return hasDetached;
            },

            attachIndexedWidgets: function (indexArray) {
                this._ensureIndexedWidgetsRendered(indexArray);
                this._removeIndexedWidgetsFromDetachedSet(indexArray);
            },

            _removeIndexedWidgetsFromDetachedSet: function (indexArray) {
                var i, widgets, widget;
                widgets = this.widgets();
                for (i = 0; i !== indexArray.length; i += 1) {
                    widget = widgets[i];
                    delete this._detachedWidgets[widget.id];
                }
            },

            _ensureIndexedWidgetsRendered: function (indexArray) {
                var i, itemIndex, device, widgets, widget;
                widgets = this.widgets();
                device = this.getCurrentApplication().getDevice();
                for (i = 0; i !== indexArray.length; i += 1) {
                    itemIndex = indexArray[i];
                    widget = widgets[itemIndex];
                    if (!this._isRendered(widget)) {
                        widget.render(device);
                    }
                }
            },

            _isRendered: function (widget) {
                return widget.outputElement !== undefined && widget.outputElement !== null;
            }
        });
        return CullingStrip;
    }
);