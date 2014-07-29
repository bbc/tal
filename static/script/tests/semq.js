require.def('antie/tests/semq',
    [
      'antie/class'
    ],
    function(Class) {
        return Class.extend( {
            init : function(server, queue) {
               this.queue = queue;
               this.server = server;
               this.queuedmessages = [];
               this.outputRequest = new XMLHttpRequest();
            },

            send : function(message, queue) {
               var queuename = queue || this.queue;
               this._addToQueue({message : message, queue : queuename});
            },

            addOnMessageHandler : function(handler) {
               this.handlers.push(handler);
               if (this.handlers.length === 1) {
                  this._startListening();
               }
            },

            removeOnMessageHandler : function(handler) {
               for (var i = 0; i < this.handlers.length; i++){
                  if (this.handlers[i] === handler){
                    this.handlers.splice(i,1);
                  }
               }
               if (this.handlers.length === 0) {
                  this._stopListening();
               }
            },
            
            _get : function() {
              var self = this;
              window.clearTimeout(this.listenInterval);
              this.inputRequest.open("GET", this._constructQueueUrl(this.server, this.queue), true);
              this.inputRequest.onreadystatechange = function() {
                var error = false;
                if (self.inputRequest.readyState != 4)
                  return;
                if (self.inputRequest.status === 200){
                  self._onMessage(self.inputRequest.responseText);
                }
                else if (self.inputRequest.status !== 404){
                  error = true;
                }
                self.inputRequest.abort();
                self._startListening(error);
              }
              this.inputRequest.send("");
            },


            _startListening : function(errorEncounteredLastTime) {
              var self = this;
             this.inputRequest |= new XMLHttpRequest();
              if (errorEncounteredLastTime){
                this.delayInterval = Math.max(this.delayInterval * 2, 5000);
              }
              else {
                this.delayInterval = 1;
              }
              this.listenInterval = window.setTimeout(function(){self._get()}, this.delayInterval);
            },

            _stopListening : function() {
            },

            _onMessage : function(message) {
               for (var i = 0; i < this.handlers.length; i++){
                 this.handlers[i](message);
               }
            },

            _constructQueueUrl : function(server, queue) {
               return server + "/queue/" + queue;
            },

            _addToQueue : function(message) {
               this.queuedmessages.push(message); 
               this._attemptToSendMessages();
            },

            _attemptToSendMessages : function() {
              var self = this;
               var sendMessages = function() {
                 if (self.queuedmessages.length > 0) {
                   var request = self.outputRequest;
                   var send = false;
                   if (request.readyState == 4 || request.readyState == 0) {
                     var message = self.queuedmessages.shift();
                     request.open("POST", self._constructQueueUrl(self.server, message.queue), true);
                     request.setRequestHeader("Content-type", "text/plain");
                     send = true;
                   }
                   if (self.queuedmessages.length > 0) {
                     request.onreadystatechange = sendMessages;
                   }
                   if (send) {
                     request.send(message.message);
                   }
                 }
               }
               sendMessages();
           }
/*

    startApiListening : function () {
      XMPP.interval = window.setTimeout(function(){XMPP.getNextItem()}, 1);
 	}

*/
            
        });
    });
