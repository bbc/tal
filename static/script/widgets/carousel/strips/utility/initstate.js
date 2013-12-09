require.def('antie/widgets/carousel/strips/utility/initstate',
    [
        'antie/widgets/carousel/strips/utility/state',
        'antie/widgets/carousel/strips/utility/attachedstate'
    ],
    function (State, AttachedState) {
        'use strict';
        var InitState;
        InitState = State.extend({
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

            _attach: function (context, parent, widget, attachMethodName) {
                var device = widget.getCurrentApplication().getDevice();
                widget.render(device);
                device[attachMethodName](parent.outputElement, widget.outputElement);
                context.setState(AttachedState);
            }
        });

        return InitState;
    }
);