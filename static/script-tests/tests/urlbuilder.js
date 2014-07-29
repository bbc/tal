(function() {
	this.URLBuilderTest = AsyncTestCase("URLBuilder");

	this.URLBuilderTest.prototype.setUp = function() {
	};

	this.URLBuilderTest.prototype.tearDown = function() {
	};

	this.URLBuilderTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/urlbuilder","antie/class"], function(URLBuilder, Class) {

			assertEquals('URLBuilder should be a function', 'function', typeof URLBuilder);
			assert('URLBuilder should extend from Class', new URLBuilder() instanceof Class);

		});
	};

	this.URLBuilderTest.prototype.testGetURLNoTags = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "http://www.test.bbc.co.uk/";
			var href = "http://www.bbc.co.uk/";
			var tags = {};
			assertEquals("http://www.test.bbc.co.uk/", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLHREFOnly = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%href%";
			var href = "http://www.bbc.co.uk/";
			var tags = {
			};
			assertEquals("http://www.bbc.co.uk/", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLHREFAndTags = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%a%%b%%c%";
			var href = "http://www.bbc.co.uk/";
			var tags = {
				"%a%":"AAA",
				"%c%":"-C-"
			};
			assertEquals("AAA%25b%25-C-", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLApostrophesAreEncoded = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%href%''%a%";
			var href = "'";
			var tags = {
				"%a%":"'"
			};
			assertEquals("%27%27%27%27", new URLBuilder(template).getURL(href, tags));
		});
	};
})();
