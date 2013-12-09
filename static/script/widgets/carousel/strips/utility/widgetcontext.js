require.def('antie/widgets/carousel/strips/utility/widgetcontext',
    [
        'antie/class',
        'antie/widgets/carousel/strips/utility/initstate'
    ],
    function (Class, InitState) {
        'use strict';
        var WidgetContext;
        WidgetContext = Class.extend({
            init: function (widget, parent) {
                this._widget = widget;
                this._parent = parent;
                this._state = new InitState(this);
            },

            /**
             * Renders (if necessary) and appends output element to parent if not already child
             */
            append: function () {
                this._state.append(this, this._parent, this._widget);
            },

            /**
             * Renders (if necessary) and prepends output element to parent if not already child
             */
            prepend: function () {
                this._state.prepend(this, this._parent, this._widget);
            },

            /**
             * Removes output element from parent if child
             */
            detach: function () {
                this._state.detach(this, this._widget);
            },

            /**
             * @returns {Boolean} true if widget rendered and attached to parent, false otherwise
             */
            attached: function () {
                return this._state.attached();
            },

            setState: function (State) {
                this._state = new State(this);
            }
        });

        return WidgetContext;
    }
);