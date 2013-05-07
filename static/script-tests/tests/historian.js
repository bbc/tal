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
                historian = new Historian('http://www.test.com/test/#&*history=http://www.test2.com/test2/');
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
                historian = new Historian('http://www.test.com/test/#&*history=http://www.test2.com/test2/&*history=http://www.test3.com/test3/');
                assertEquals('http://www.test2.com/test2/#&*history=http://www.test3.com/test3/', historian.back());
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
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://www.test2.com/test2/');
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
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://www.test2.com/test2/&*route=/some/other/route');
                assertEquals('http://www.test2.com/test2/#/some/other/route', historian.back());    
            }
        );
    };
    this.HistorianTest.prototype.testConvolutedRouteAndHistoryBack = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://www.test2.com/test2/&*route=/some/other/route&*history=http://www.test3.com/test3/&*route=/yet/another/route');
                assertEquals('http://www.test2.com/test2/#/some/other/route&*history=http://www.test3.com/test3/&*route=/yet/another/route', historian.back());
            }
        );
    };
    this.HistorianTest.prototype.testConvolutedRouteAndHistoryForward = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://www.test2.com/test2/&*route=/some/other/route&*history=http://www.test3.com/test3/&*route=/yet/another/route');
                assertEquals('http://www.example.com#&*history=http://www.test.com/test/&*route=/some/route/&*history=http://www.test2.com/test2/&*route=/some/other/route&*history=http://www.test3.com/test3/&*route=/yet/another/route', historian.forward('http://www.example.com'));
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
                assertEquals('http://www.test2.com/test2/#&*history=http://www.test.com/test/', 
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
                assertEquals('http://www.test2.com/test2/#/favourites/&*history=http://www.test.com/test/', 
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
                assertEquals('http://www.test2.com/test2/#&*history=http://www.test.com/test/&*route=/Experimental/', 
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
                assertEquals('http://www.test2.com/test2/#favourites/&*history=http://www.test.com/test/&*route=/Experimental/', 
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

    /**
     * Test that having the &history token in the URL doesn't break the URL-splitting logic.
     */
    this.HistorianTest.prototype.testForwardUrlWithHistoryInUrl = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/?blah&history=woo');
                assertEquals('http://www.test2.com/test2/?test1&history=test2#&*history=http://www.test.com/test/?blah&history=woo', 
                    historian.forward('http://www.test2.com/test2/?test1&history=test2'));
            }
        );
    };

    this.HistorianTest.prototype.testBackWithHistoryInUrl = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/?blah&history=woo#some/route&*history=http://www.example.com&*route=a/route');
                assertEquals('http://www.example.com#a/route', 
                    historian.back());
            }
        );
    };

    this.HistorianTest.prototype.testToStringWithHistoryInUrl = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian;
                historian = new Historian('http://www.test.com/test/?blah&history=woo#some/route&*history=http://www.example.com&*route=another/route');
                assertEquals('&*history=http://www.example.com&*route=another/route', 
                    historian.toString());
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
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://www.test2.com/test2/');
                assertEquals('&*history=http://www.test2.com/test2/', 
                    historian.toString());    
            }
        );
    };

    this.HistorianTest.prototype.testReallyLongHistoryIsTrimmedOnForwardNavigation = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                // url is 983 characters
                var historian, forwardUrl;
                historian = new Historian('http://www.111.com/test/#/some/route/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/&*history=http://www.777.com/test2/&*history=http://www.888.com/test2/&*history=http://www.999.com/test2/&*history=http://www.000.com/test2/&*history=http://www.111.com/test2/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/&*history=http://www.777.com/test2/&*history=http://www.888.com/test2/&*history=http://www.999.com/test2/&*history=http://www.000.com/test2/&*history=http://www.111.com/test2/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/&*history=http://www.777.com/test2/&*history=http://www.888.com/test2/');
                // url we get back has to be under 1000 characters, despite the fact this url should take it over the edge
                forwardUrl = historian.forward('http://www.example.com/long-url-is-long/relatively-speaking');

                assertEquals('URL with oldest two history elements dropped', 'http://www.example.com/long-url-is-long/relatively-speaking#&*history=http://www.111.com/test/&*route=/some/route/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/&*history=http://www.777.com/test2/&*history=http://www.888.com/test2/&*history=http://www.999.com/test2/&*history=http://www.000.com/test2/&*history=http://www.111.com/test2/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/&*history=http://www.777.com/test2/&*history=http://www.888.com/test2/&*history=http://www.999.com/test2/&*history=http://www.000.com/test2/&*history=http://www.111.com/test2/&*history=http://www.222.com/test2/&*history=http://www.333.com/test2/&*history=http://www.444.com/test2/&*history=http://www.555.com/test2/&*history=http://www.666.com/test2/', forwardUrl);
                assert('URL less than 1000 characters', forwardUrl.length <= 1000);
            }
        );
    };


    this.HistorianTest.prototype.testUntrimmableHistoryDropsAllHistory = function(queue) {
        queuedRequire(
            queue,
            [
                'antie/historian'
            ],
            function(Historian) {
                var historian, forwardUrl;
                historian = new Historian('http://www.test.com/test/#/some/route/&*history=http://reallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveitreallylongurlsolongyouwontbelieveit.com');
                forwardUrl = historian.forward('http://www.example.com/long-url-is-long/relatively-speaking#some-route');

                // Have to drop the entire history to make it fit
                assertEquals('URL has dropped most history', 'http://www.example.com/long-url-is-long/relatively-speaking#some-route&*history=http://www.test.com/test/&*route=/some/route/', forwardUrl);
            }
        );
    };


}());