/**
 * @fileOverview Requirejs module containing the antie.widgets.Component class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */


define('antie/widgets/component',
    [
        'antie/widgets/container',
        'antie/runtimecontext'
    ],
    function(Container, RuntimeContext) {
        'use strict';

        /**
         * The Component widget class represents sections of UI that may be dynamically loaded.
         * @name antie.widgets.Component
         * @class
         * @extends antie.widgets.Container
         * @requires antie.RuntimeContext
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         */
        return Container.extend(/** @lends antie.widgets.Component.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id) {
                init.base.call(this, id);
                this.addClass('component');
                this._isModal = false;
            },
            /**
             * Hide the component.
             */
            hide: function hide () {
                if(this.parentWidget) {
                    this.parentWidget.hide();
                }
            },
            /**
             * Returns any state information required (in addition to the initial arguments) that is required to restore this component.
             * @returns State information
             */
            getCurrentState: function getCurrentState () {
                return null;
            },

            getIsModal: function getIsModal () {
                return this._isModal;
            },

            setIsModal: function setIsModal (modal) {
                this._isModal = modal;
            },

            getConfig: function getConfig () {
                return RuntimeContext.getDevice().getConfig();
            },

            /**
             * Returns whether the widget is a Component.
             * @returns {Boolean} True if the widget is a Component.
             */
            isComponent: function isComponent () {
                return true;
            }
        });
    }
);
