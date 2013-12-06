require.def('antie/widgets/carousel/strips/utility/state',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var State;
        State = Class.extend({
            init: function (context) {
                // implement in child
            },

            append: function (parent, widget) {
                // implement in child
            },

            prepend: function (parent, widget) {
                // implement in child
            },

            detach: function (widget) {
                // implement in child
            },

            attached: function () {
                // implement in child
            }
        });
        return State;
    }
);