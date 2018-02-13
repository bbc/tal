/**
 * @fileOverview Requirejs module containing the antie.widgets.Image class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/image',
    ['antie/widgets/container'],
    function(Container) {
        'use strict';

        /**
         * The Image widget displays an image. It supports lazy loading/unloading of images to conserve memory.
         * You can use CSS to set a background image on the container first and then when the image specified
         * in setSrc is loaded up it will fill the <div> and obscure the background image.
         * @name antie.widgets.Image
         * @class
         * @extends antie.widgets.Container
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {String} src The image source URL.
         * @param {Size} [size] The size of the image.
         * @param {Number} [renderMode] What mode the image will be rendered in. Either Image.RENDER_MODE_IMG or Image.RENDER_MODE_CONTAINER.
         */
        var Image = Container.extend(/** @lends antie.widgets.Image.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, src, size, renderMode) {
                init.base.call(this, id);
                this._src = src;
                this._size = size;
                this._imageElement = null;
                this._renderMode = (renderMode === Image.RENDER_MODE_IMG) ? Image.RENDER_MODE_IMG : Image.RENDER_MODE_CONTAINER;
                this.addClass('image');
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                this._imageElement = device.createImage(this.id + '_img', null, this._src, this._size);
                if(this._renderMode === Image.RENDER_MODE_CONTAINER) {
                    this.outputElement = render.base.call(this, device);
                    if(this._size) {
                        device.setElementSize(this.outputElement, this._size);
                    }
                    device.prependChildElement(this.outputElement, this._imageElement);
                } else {
                    this.outputElement = this._imageElement;
                    device.setElementClasses(this.outputElement, this.getClasses());
                }

                return this.outputElement;
            },
            /**
             * Sets the image source URL.
             * @param {String} src The new image source URL to display.
             */
            setSrc: function setSrc (src) {
                this._src = src;
                if(this._imageElement) {
                    this._imageElement.src = src;
                }
            },
            /**
             * Gets the image source URL.
             * @returns The current image source URL.
             */
            getSrc: function getSrc () {
                return this._src;
            },
            setRenderMode: function setRenderMode (mode) {
                this._renderMode = mode;
            },
            getRenderMode: function getRenderMode () {
                return this._renderMode;
            }
        });

        Image.RENDER_MODE_IMG = 0;
        Image.RENDER_MODE_CONTAINER = 1;

        return Image;
    }
);
