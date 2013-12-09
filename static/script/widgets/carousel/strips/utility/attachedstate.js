require.def('antie/widgets/carousel/strips/utility/attachedstate',
    [
        'antie/widgets/carousel/strips/utility/state',
        'antie/widgets/carousel/strips/utility/renderedstate'
    ],
    function (State, RenderedState) {
        'use strict';
        var AttachedState;
        AttachedState = State.extend({
            init: function () {

            },

            append: function (context, parent, widget) {

            },

            prepend: function (context, parent, widget) {

            },

            detach: function (context, widget) {
                var device = this._getDevice(widget);
                device.removeElement(widget.outputElement);
                context.setState(new RenderedState());
            },

            attached: function () {
                return true;
            },

            _getDevice: function (widget) {
                return widget.getCurrentApplication().getDevice(widget);
            }
        });
        return AttachedState;
    }
);