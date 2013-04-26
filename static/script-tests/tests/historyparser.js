(function() {
    this.HistoryParserTest = AsyncTestCase("HistoryParser");

    this.HistoryParserTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.HistoryParserTest.prototype.tearDown = function() {
    };
    
    this.HistoryParserTest.prototype.testSingleHistoryReturned = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(HistoryParser) {
                var parser;
                history = new HistoryParser();
                assertEquals('http://www.bbc.co.uk/iplayer/', 
                    history.backUrl('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    
    this.HistoryParserTest.prototype.testFirstHistoryReturned = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(HistoryParser) {
                var parser;
                history = new HistoryParser();
                assertEquals('http://www.bbc.co.uk/sprtiptv/#&history=http://www.bbc.co.uk/iplayer/', 
                    history.backUrl('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/&history=http://www.bbc.co.uk/sprtiptv/'));    
            }
        );
    };
    this.HistoryParserTest.prototype.testCurrentRouteNotInHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(HistoryParser) {
                var parser;
                history = new HistoryParser();
                assertEquals('http://www.bbc.co.uk/iplayer/', 
                    history.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    this.HistoryParserTest.prototype.testRouteInHistoryPreserved = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(HistoryParser) {
                var parser;
                history = new HistoryParser();
                assertEquals('http://www.bbc.co.uk/iplayer/#/some/other/route', 
                    history.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route'));    
            }
        );
    };
    this.HistoryParserTest.prototype.testConvolutedRouteAndHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(HistoryParser) {
                var parser;
                history = new HistoryParser();
                assertEquals('http://www.bbc.co.uk/sprtiptv/#/yet/another/route&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route', 
                    history.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route&history=http://www.bbc.co.uk/sprtiptv/&route=/yet/another/route'));    
            }
        );
    };
}());