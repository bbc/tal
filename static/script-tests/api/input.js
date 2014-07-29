var InputApi = {
  keypress : function(keyName) {
	var Application = require('antie/application');
	var KeyEvent = require('antie/events/keyevent');
	var application = Application.getCurrentApplication();
	application.bubbleEvent(new KeyEvent("keydown", KeyEvent[keyName]));
	application.bubbleEvent(new KeyEvent("keyup", KeyEvent[keyName]));
  }
};
