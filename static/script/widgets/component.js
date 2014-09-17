/**
 * @fileOverview Requirejs module containing the antie.widgets.Component class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def('antie/widgets/component',
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
            init: function(id) {
                this._super(id);
                this.addClass('component');
                this._isModal = false;
            },
            /**
             * Hide the component.
             */
            hide: function() {
                if(this.parentWidget) {
                    this.parentWidget.hide();
                }
            },
            /**
             * Returns any state information required (in addition to the initial arguments) that is required to restore this component.
             * @returns State information
             */
            getCurrentState: function() {
                return null;
            },

            getIsModal: function() {
                return this._isModal;
            },

            setIsModal: function(modal) {
                this._isModal = modal;
            },

            getConfig: function() {
                return RuntimeContext.getDevice().getConfig();
            },

            /**
             * Returns whether the widget is a Component.
             * @returns {Boolean} True if the widget is a Component.
             */
            isComponent: function() {
                return true;
            }
        });
    }
);
