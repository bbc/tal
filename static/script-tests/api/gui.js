/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

var GuiApi = {

	isFocused : function (id) {
		var Application = require('antie/application');
		var application = Application && Application.getCurrentApplication();
		var focusedWidget = application && application.getFocussedWidget();
		var widgetId = focusedWidget && focusedWidget.id;
		return widgetId === id;
	},

	getTextContent : function(id) {
		var element = document.getElementById(id);
		return element.textContent;
	},

	isVisible: function(id) {
		var element = document.getElementById(id);
		if (!element) {
			return false;
		}
		var style = element.style;
		return style && style.display !== 'none' && style.visibility !== 'hidden';
	}
};
