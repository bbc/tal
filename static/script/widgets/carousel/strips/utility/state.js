require.def('antie/widgets/carousel/strips/utility/state',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var State;
        State = Class.extend({
            init: function () {
                // implement in child
            },

            append: function (context, parent, widget) {
                // implement in child
            },

            prepend: function (context, parent, widget) {
                // implement in child
            },

            detach: function (context, widget) {
                // implement in child
            },

            attached: function () {
                // implement in child
            }
        });
        return State;
    }
);