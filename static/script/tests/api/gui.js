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
		return style.display !== 'none' && style.visibility !== 'hidden';
	}
};
