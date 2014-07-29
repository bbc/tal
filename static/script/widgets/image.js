/**
 * @fileOverview Requirejs module containing the antie.widgets.Image class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/widgets/image',
	['antie/widgets/container'],
	function(Container) {
		/**
		 * The Image widget displays an image. It supports lazy loading/unloading of images to conserve memory.
		 * You can use CSS to set a background image on the container first and then when the image specified 
		 * in setSrc is loaded up it will fill the <div> and obscure the background image.
		 * @name antie.widgets.Image
		 * @class
		 * @extends antie.widgets.Container
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {String} src The image source URL.
		 * @param {Size} size The size of the image.
		 */
		var Image = Container.extend(/** @lends antie.widgets.Image.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, src, size) {
				this._super(id);
				this._src = src;
				this._size = size;
				this._imageElement = null;
				this._renderMode = Image.RENDER_MODE_CONTAINER;
				this.addClass('image');
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				this._imageElement = device.createImage(this.id + "_img", null, this._src, this._size);
				if(this._renderMode == Image.RENDER_MODE_CONTAINER) {
					this.outputElement = this._super(device);
					if(this._size) {
						device.setElementSize(this.outputElement, this._size);
					}
					device.prependChildElement(this.outputElement, this._imageElement);
				} else {
					this.outputElement = this._imageElement;
				}
	
				return this.outputElement;
			},
			/**
			 * Sets the image source URL.
			 * @param {String} src The new image source URL to display.
			 */
			setSrc: function(src) {
				this._src = src;
				if(this._imageElement) {
					this._imageElement.src = src;
				}
			},
			/**
			 * Sets the image source URL.
			 * @returns The current image source URL.
			 */
			getSrc: function() {
				return this._src;
			},
			setRenderMode: function(mode) {
				this._renderMode = mode;
			},
			getRenderMode: function() {
				return this._renderMode;
			}
		});

		Image.RENDER_MODE_IMG = 0;
		Image.RENDER_MODE_CONTAINER = 1;

		return Image;
	}
);
