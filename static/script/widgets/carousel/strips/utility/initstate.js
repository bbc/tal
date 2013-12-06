require.def('antie/widgets/carousel/strips/utility/initstate',
    [
        'antie/widgets/carousel/strips/utility/state',
        'antie/widgets/carousel/strips/utility/attachedstate'
    ],
    function (State, AttachedState) {
        'use strict';
        var InitState;
        InitState = State.extend({
            init: function (context) {
                this._context = context;
            },

            append: function (parent, widget) {
                var device = widget.getCurrentApplication().getDevice();
                widget.render(device);
                device.appendChildElement(parent.outputElement, widget.outputElement);
                this._context.setState(AttachedState);
            },

            prepend: function (parent, widget) {

            },

            detach: function (widget) {

            },

            attached: function () {

            }
        });
        return InitState;
    }
);