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
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/');
                assertEquals('http://www.bbc.co.uk/iplayer/', historian.back());    
            }
        );
    };
    
    this.HistorianTest.prototype.testNoHistoryReturnsEmptyString = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/');
                assertEquals('', historian.back());    
            }
        );
    };
    
    this.HistorianTest.prototype.testFirstOfTwoHistoriesReturned = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#&history=http://www.bbc.co.uk/iplayer/&history=http://www.bbc.co.uk/sprtiptv/');
                assertEquals('http://www.bbc.co.uk/sprtiptv/#&history=http://www.bbc.co.uk/iplayer/', historian.back());    
            }
        );
    };
    this.HistorianTest.prototype.testCurrentRouteNotInHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/');
                assertEquals('http://www.bbc.co.uk/iplayer/', historian.back());    
            }
        );
    };
    this.HistorianTest.prototype.testRouteInHistoryPreserved = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route');
                assertEquals('http://www.bbc.co.uk/iplayer/#/some/other/route', historian.back());    
            }
        );
    };
    this.HistorianTest.prototype.testConvolutedRouteAndHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#/some/route/&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route&history=http://www.bbc.co.uk/sprtiptv/&route=/yet/another/route');
                assertEquals('http://www.bbc.co.uk/sprtiptv/#/yet/another/route&history=http://www.bbc.co.uk/iplayer/&route=/some/other/route', historian.back());    
            }
        );
    };
    this.HistorianTest.prototype.testForwardUrl = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/');
                assertEquals('http://www.bbc.co.uk/iplayer/#&history=http://www.bbc.co.uk/catal/', 
                    historian.forward('http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    this.HistorianTest.prototype.testForwardUrlWithDestinationRoute = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/');
                assertEquals('http://www.bbc.co.uk/iplayer/#/favourites/&history=http://www.bbc.co.uk/catal/', 
                    historian.forward('http://www.bbc.co.uk/iplayer/#/favourites/'));    
            }
        );
    };
    this.HistorianTest.prototype.testForwardUrlWithSourceRoute = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#/Experimental/');
                assertEquals('http://www.bbc.co.uk/iplayer/#&history=http://www.bbc.co.uk/catal/&route=/Experimental/', 
                    historian.forward('http://www.bbc.co.uk/iplayer/'));    
            }
        );
    };
    
    this.HistorianTest.prototype.testForwardUrlWithSourceAndDestinationRoutes = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.bbc.co.uk/catal/#/Experimental/');
                assertEquals('http://www.bbc.co.uk/iplayer/#favourites/&history=http://www.bbc.co.uk/catal/&route=/Experimental/', 
                    historian.forward('http://www.bbc.co.uk/iplayer/#favourites/'));    
            }
        );
    };
}());