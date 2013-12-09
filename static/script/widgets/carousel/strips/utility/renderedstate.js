require.def('antie/widgets/carousel/strips/utility/renderedstate',
    [
        'antie/widgets/carousel/strips/utility/state',
        'antie/widgets/carousel/strips/utility/attachedstate'
    ],
    function (State, AttachedState) {
        'use strict';
        var RenderedState;
        RenderedState = State.extend({
            init: function () {

            },

            append: function (context, parent, widget) {
                this._attach(context, parent, widget, 'appendChildElement');
            },

            prepend: function (context, parent, widget) {
                this._attach(context, parent, widget, 'prependChildElement');
            },

            detach: function (context, widget) {

            },

            attached: function () {
                return false;
            },

            _getDevice: function (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _attach: function (context, parent, widget, attachMethodName) {
                var device = this._getDevice(widget);
                device[attachMethodName](parent.outputElement, widget.outputElement);
                context.setState(AttachedState);
            }
        });
        return RenderedState;
    }
);