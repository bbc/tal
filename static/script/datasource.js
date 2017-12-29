/**
 * @fileOverview Requirejs module containing base antie.DataSource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/datasource',
    ['antie/class'],
    function(Class) {
        'use strict';

        /**
         * Utility class to wrap disparate functions into a common interface for binding to lists.
         * @name antie.DataSource
         * @class
         * @extends antie.Class
         * @param {antie.widgets.Component} component Component which 'owns' this data.
         * @param {Object} obj Object on which to call 'func' method.
         * @param {String} func Name of function to call.
         * @param {Array} args Arguments to pass the function.
         */
        return Class.extend(/** @lends antie.DataSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (component, obj, func, args) {
                this._request = null;
                this._component = component;
                this._obj = obj;
                this._func = func;
                this._args = args;

                if(component) {
                    var self = this;

                    var beforeHideListener = function() {
                        component.removeEventListener('beforehide', beforeHideListener);
                        self.abort();
                    };
                    component.addEventListener('beforehide', beforeHideListener);
                }
            },
            /**
             * Performs the request for data.
             * @param {Object} callbacks Object containing onSuccess and onError callback functions.
             */
            load: function load (callbacks) {
                this._request = this._obj[this._func].apply(this._obj, [callbacks].concat(this._args || []));
            },
            /**
             * Aborts a currently loading request.
             */
            abort: function abort () {
                if(this._request) {
                    this._request.abort();
                }
            }
        });
    }
);
