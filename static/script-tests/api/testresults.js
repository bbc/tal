/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * All rights reserved
 * Please contact us for an alternative licence
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
		failureMessageContainer.innerHTML += "All tests passed"
	},
	failed : function(failures) {
		var failureMessageContainer = TestResults._createMessageBox("#D61111");
		failureMessageContainer.innerHTML += "Failed Scenarios : <ol>"
		for (var i = 0; i < failures.length; i++){
			failureMessageContainer.innerHTML += "<li>" + failures[i] + "</li>";
		}
		failureMessageContainer.innerHTML += "</ol>";
	}
}