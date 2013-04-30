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
                historian = new Historian('http://www.test.com/test/#&history=http://www.test2.com/test2/');
                assertEquals('http://www.test2.com/test2/', historian.back());    
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
                historian = new Historian('http://www.test.com/test/');
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
                historian = new Historian('http://www.test.com/test/#&history=http://www.test2.com/test2/&history=http://www.test3.com/test3/');
                assertEquals('http://www.test3.com/test3/#&history=http://www.test2.com/test2/', historian.back());    
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
                historian = new Historian('http://www.test.com/test/#/some/route/&history=http://www.test2.com/test2/');
                assertEquals('http://www.test2.com/test2/', historian.back());    
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
                historian = new Historian('http://www.test.com/test/#/some/route/&history=http://www.test2.com/test2/&route=/some/other/route');
                assertEquals('http://www.test2.com/test2/#/some/other/route', historian.back());    
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
                historian = new Historian('http://www.test.com/test/#/some/route/&history=http://www.test2.com/test2/&route=/some/other/route&history=http://www.test3.com/test3/&route=/yet/another/route');
                assertEquals('http://www.test3.com/test3/#/yet/another/route&history=http://www.test2.com/test2/&route=/some/other/route', historian.back());    
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
                historian = new Historian('http://www.test.com/test/');
                assertEquals('http://www.test2.com/test2/#&history=http://www.test.com/test/', 
                    historian.forward('http://www.test2.com/test2/'));    
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
                historian = new Historian('http://www.test.com/test/');
                assertEquals('http://www.test2.com/test2/#/favourites/&history=http://www.test.com/test/', 
                    historian.forward('http://www.test2.com/test2/#/favourites/'));    
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
                historian = new Historian('http://www.test.com/test/#/Experimental/');
                assertEquals('http://www.test2.com/test2/#&history=http://www.test.com/test/&route=/Experimental/', 
                    historian.forward('http://www.test2.com/test2/'));    
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
                historian = new Historian('http://www.test.com/test/#/Experimental/');
                assertEquals('http://www.test2.com/test2/#favourites/&history=http://www.test.com/test/&route=/Experimental/', 
                    historian.forward('http://www.test2.com/test2/#favourites/'));    
            }
        );
    };
    
    this.HistorianTest.prototype.testForwardUrlWithNoHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('');
                assertEquals('http://www.test2.com/test2/#favourites/', 
                    historian.forward('http://www.test2.com/test2/#favourites/'));    
            }
        );
    };
    
    this.HistorianTest.prototype.testToStringReturnsOnlyHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/#/some/route/&history=http://www.test2.com/test2/');
                assertEquals('&history=http://www.test2.com/test2/', 
                    historian.toString());    
            }
        );
    };

}());