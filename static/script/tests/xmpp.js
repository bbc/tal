/*global Strophe, console */
function querySt(queryName) {
  var querystring = window.location.search.substring(1);
  var splitquery = querystring.split("&");
  for (i=0;i<splitquery.length;i++) {
    var ft = splitquery[i].split("=");
    if (ft[0] == queryName) {
      return ft[1];
    }
  }
}

var log = function(message) {
}

var host = "/antie/testqueues/";

var inputqueue = querySt("inputqueue") || "totv";
var videoeventsqueue = querySt("videoeventqueue") || "video_events";

var JSON = JSON || {};
JSON.stringify = JSON.stringify || function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);
	}
	else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n]; t = typeof(v);
			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};


var niceEval = function(js) {
  var executable = "("+js+ ")";
  var result = undefined;
  try{
    result = eval(executable);
  }
  catch (e) {
    try{
      result = eval(js);
    }
    catch (e){
      //console.log("failed");
    }
  }
  return result;
}

var XMPP = {

    handler_functions : {},
    xmlhttpOut :  new XMLHttpRequest(),
    xmlhttpIn  :  new XMLHttpRequest(),
    xmlhttpVideoEvents :  new XMLHttpRequest(),
	videoEventQueue : [],
    interval   :  0,

    registerFunction : function(name, func) {
		this.handler_functions[name] = func;
	},

	setup : function() {
		XMPP.xmlhttpIn.onreadystatechange = function() {
			if (XMPP.xmlhttpIn.readyState != 4)
				return;
			if (XMPP.xmlhttpIn.status == 200) {
				XMPP.onApiCall(XMPP.xmlhttpIn.responseText);
			}
			if (XMPP.xmlhttpIn.status > 0){
				XMPP.startApiListening();
			}
		};
		XMPP.setupVideoEventQueue();
	},

    onApiCall : function(messageJson) {
        var message = niceEval(messageJson);
        if (message == undefined){
          return true;
        }
        var resultCallback = function(result) {
          var returnMessage = {type:"result", id:message.id, value:result};
          XMPP.sendMessageTo(message.return_queue, JSON.stringify(returnMessage));
        };
        var func = this.handler_functions[message.name];
        if (func) {
            try {
                var flagWaitForCallback = resultCallback; // Separate variable is not strictly necessary, but makes handler code clearer.
                var result = func(message.arg, resultCallback, flagWaitForCallback);
                if (result === flagWaitForCallback) {
                    // Handler functions return flagWaitForCallback to indicate that they will (or already have)
                    // called resultCallback themselves. Otherwise we use the return value from the handler.
                    // I.e. if you want to defer sending the return value in your handler function...
                    // function myHandler(arg, resultCallback, flagWaitForCallback) {
                    //      asyncOperation(resultCallback);
                    //      return flagWaitForCallback;
                    // }
                }
                else {
                  if (message.return_queue){
                    resultCallback(result);
                  }
                }
            }
            catch (e) {
                // Report the exception to the test runner.
                var messageText = "Javascript exception -- " + e.name + ": " + e.message + ".";
                if (e.fileName) {messageText += " " + e.fileName;}
                if (e.lineNumber) {messageText += ":" + e.lineNumber;}
                var exceptionMessage = {type: "exception", id: message.id, value: messageText};
                XMPP.sendMessageTo(message.return_queue, JSON.stringify(exceptionMessage));
            }
        }
        return true;
    },

    sendMessageTo : function(queue, message) {
      XMPP.xmlhttpOut.open("POST", host +"queue/"+ queue,false);
      XMPP.xmlhttpOut.setRequestHeader("Content-type","text/plain");
      XMPP.xmlhttpOut.send(message);
    },

	setupVideoEventQueue : function() {
		XMPP.xmlhttpVideoEvents.onreadystatechange = XMPP.attemptToSendVideoEvents;
	},

	sendVideoEvent : function(event) {
		XMPP.videoEventQueue.push(event);
		XMPP.attemptToSendVideoEvents();
	},

	attemptToSendVideoEvents : function() {
		if (XMPP.videoEventQueue.length > 0){
			if (XMPP.xmlhttpVideoEvents.readyState == 4 || XMPP.xmlhttpVideoEvents.readyState == 0) {
				XMPP.xmlhttpVideoEvents.open("POST", host +"queue/"+ videoeventsqueue, true);
				XMPP.xmlhttpVideoEvents.setRequestHeader("Content-type", "text/plain");
				XMPP.xmlhttpVideoEvents.send(JSON.stringify(XMPP.videoEventQueue));
				XMPP.videoEventQueue = [];
			}
		}
    },

	stopConsumingMessages : function() {
		XMPP.getNextItem = function(){};
		XMPP.xmlhttpIn.abort();
	},

	getNextItem : function() {
		XMPP.xmlhttpIn.open("GET", host + "queue/" + inputqueue, true);
		XMPP.xmlhttpIn.send(null);
	},

    startApiListening : function () {
      XMPP.interval = window.setTimeout(function(){XMPP.getNextItem()}, 100);
 	}

};

XMPP.setup();