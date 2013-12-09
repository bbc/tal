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
                this._attach(parent, widget, 'appendChildElement');
            },

            prepend: function (parent, widget) {
                this._attach(parent, widget, 'prependChildElement');
            },

            detach: function (widget) {
            },

            attached: function () {
                return false;
            },

            _attach: function (parent, widget, attachMethodName) {
                var device = widget.getCurrentApplication().getDevice();
                widget.render(device);
                device[attachMethodName](parent.outputElement, widget.outputElement);
                this._context.setState(AttachedState);
            }
        });
        
        return InitState;
    }
);