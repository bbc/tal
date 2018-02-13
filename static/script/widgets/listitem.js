/**
 * @fileOverview Requirejs module containing the antie.widgets.ListItem class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/listitem',
    ['antie/widgets/container'],
    function(Container) {
        'use strict';

        /**
         * The ListItem widget is a container widget that is used by the {@link antie.widgets.List} widget when set to <code>List.RENDER_MODE_LIST</code>.
         * If you wish to control the classNames and id of list items, you can manually create them in your component/formatter and append them to the list.
         * Otherwise, they will be automatically generated and will wrap other widgets you add to any {@link antie.widgets.List} widget when set to <code>List.RENDER_MODE_LIST</code>.
         * @name antie.widgets.ListItem
         * @class
         * @private
         * @extends antie.widgets.Container
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         */
        return Container.extend(/** @lends antie.widgets.ListItem.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id) {
                init.base.call(this, id);
                this.addClass('listitem');
            },
            /**
             * Renders the widget and any child widgets to device-specific output using the {@link antie.devices.Device#createListItem} method.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                if(!this.outputElement) {
                    this.outputElement = device.createListItem(this.id, this.getClasses());
                }
                return render.base.call(this, device);
            }
        });
    }
);
