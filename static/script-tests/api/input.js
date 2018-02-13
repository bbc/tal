/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

var InputApi = {
  keypress : function(keyName) {
	var Application = require('antie/application');
	var KeyEvent = require('antie/events/keyevent');
	var application = Application.getCurrentApplication();
	application.bubbleEvent(new KeyEvent("keydown", KeyEvent[keyName]));
	application.bubbleEvent(new KeyEvent("keyup", KeyEvent[keyName]));
  }
};
