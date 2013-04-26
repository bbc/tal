(function() {
    /* jshint newcap: false */
    this.HistorianTest = AsyncTestCase("Historian");

    this.HistorianTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.HistorianTest.prototype.tearDown = function() {
    };
    
    this.HistorianTest.prototype.testSingleHistoryReturned = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(Historian) {
                var historian;
                historian = new Historian();
                assertEquals('http://www.bbc.co.uk/iplayer/', 
                    historian.backUrl('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    
    this.HistorianTest.prototype.testFirstHistoryReturned = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(Historian) {
                var historian;
                historian = new Historian();
                assertEquals('http://www.bbc.co.uk/sprtiptv/#&history=http://www.bbc.co.uk/iplayer/', 
                    historian.backUrl('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/&history=http://www.bbc.co.uk/sprtiptv/'));    
            }
        );
    };
    this.HistorianTest.prototype.testCurrentRouteNotInHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(Historian) {
                var historian;
                historian = new Historian();
                assertEquals('http://www.bbc.co.uk/iplayer/', 
                    historian.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    this.HistorianTest.prototype.testRouteInHistoryPreserved = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(Historian) {
                var historian;
                historian = new Historian();
                assertEquals('http://www.bbc.co.uk/iplayer/#/some/other/route', 
                    historian.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route'));    
            }
        );
    };
    this.HistorianTest.prototype.testConvolutedRouteAndHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historyparser'
            ],
            function(Historian) {
                var historian;
                historian = new Historian();
                assertEquals('http://www.bbc.co.uk/sprtiptv/#/yet/another/route&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route', 
                    historian.backUrl('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route&history=http://www.bbc.co.uk/sprtiptv/&route=/yet/another/route'));    
            }
        );
    };
}());