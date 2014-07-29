/**
 * @fileOverview Requirejs module containing the antie.widgets.Component class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/widgets/component',
	[
	 	'antie/widgets/container',
	 	'require',
	 	'antie/application'
	],
	function(Container) {
		/**
		 * The Component widget class represents sections of UI that may be dynamically loaded.
		 * @name antie.widgets.Component
		 * @class
		 * @extends antie.widgets.Container
		 * @requires antie.Application
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
				if(this.parentWidget != null) {
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
                return this.getCurrentApplication().getDevice().getConfig();
            }
		});
	}
);
