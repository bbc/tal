/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

var TestResults = {

	_createMessageBox : function (colour) {
		window.document.body.bgColor = colour;
		var failureMessageContainer = document.createElement("div");
		failureMessageContainer.style.position = "absolute";
		failureMessageContainer.style.top = "0%";
		failureMessageContainer.style.left = "0%";
		failureMessageContainer.style.padding = "10%";
		failureMessageContainer.style.width = "100%";
		failureMessageContainer.style.height = "100%";
		failureMessageContainer.style.color = "#D6D6D6";
		failureMessageContainer.style.backgroundColor = colour;
		document.body.appendChild(failureMessageContainer);
		return failureMessageContainer;
	},

	passed : function() {
		var failureMessageContainer = TestResults._createMessageBox("#11D611");
		failureMessageContainer.innerHTML += "All tests passed";
	},
	failed : function(failures) {
		var failureMessageContainer = TestResults._createMessageBox("#D61111");
		failureMessageContainer.innerHTML += "Failed Scenarios : <ol>";
		for (var i = 0; i < failures.length; i++){
			failureMessageContainer.innerHTML += "<li>" + failures[i] + "</li>";
		}
		failureMessageContainer.innerHTML += "</ol>";
	}
};
