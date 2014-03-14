require.def('antie/widgets/carousel/strips/cullingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext',
        'antie/widgets/carousel/strips/utility/states'
    ],
    function (WidgetStrip, WidgetContext, STATES) {
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
                this._widgetContexts.push(this._createContext(widget, this));
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
                    context.setState('INIT');
                }
                return this.outputElement;
            },

            insert: function (index, widget, length) {
                this._super(index, widget, length);
                this._widgetContexts.splice(index, 0, this._createContext(widget, this));
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
                var i, itemIndex, indexSet, firstIndexWithLength, preIndices, postIndices;
                indexSet = {};
                firstIndexWithLength = this._firstIndexWithLength();
                preIndices = [];
                postIndices = [];
                for (i = 0; i !== indexArray.length; i += 1) {
                    itemIndex = indexArray[i];
                    indexSet[itemIndex] = true;
                    if (itemIndex < firstIndexWithLength) {
                        preIndices.push(itemIndex);
                    } else {
                        postIndices.push(itemIndex);
                    }
                }
                this._detatchWidgetsNotIndexed(indexSet);
                preIndices.reverse();
                for (i = 0; i !== preIndices.length; i += 1) {
                    itemIndex = preIndices[i];
                    this._widgetContexts[itemIndex].prepend();
                }
                for (i = 0; i !== postIndices.length; i += 1) {
                    itemIndex = postIndices[i];
                    this._widgetContexts[itemIndex].append();
                }
            },

            getLengthToIndex: function (index) {
                var firstAttached, i, length, totalLength;
                totalLength = 0;
                firstAttached = this._firstIndexWithLength();
                for (i = firstAttached; i < index; i += 1) {
                    length = this._lengths[i];
                    if (length === undefined) {
                        this._throwNoLengthError();
                    }
                    totalLength += length;
                }
                return totalLength;
            },

            lengthOfWidgetAtIndex: function (index) {
                if (this._lengths[index] !== undefined) {
                    return this._lengths[index];
                } else {
                    this._throwNoLengthError();
                }
            },

            _detatchWidgetsNotIndexed: function (indexSet) {
                var i;
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    if (!indexSet.hasOwnProperty(i)) {
                        this._widgetContexts[i].detach();
                    }
                }
            },

            _firstIndexWithLength: function () {
                var i, attached, firstAttachedIndex;
                i = 0;
                attached = false;
                while (i < this._widgetContexts.length && attached === false) {
                    attached = this._widgetContexts[i].hasLength();
                    firstAttachedIndex = i;
                    i += 1;
                }
                return firstAttachedIndex;
            },

            _createContext: function (widget, parent) {
                return new WidgetContext(widget, parent, STATES);
            },

            _throwNoLengthError: function () {
                throw new Error("You must set widget lengths before aligning culling strip");
            }
        });
        return CullingStrip;
    }
);