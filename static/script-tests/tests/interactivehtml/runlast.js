(function() {
	this.HTMLBaseSpecAtEnd = AsyncTestCase('HTML Base Spec - run last');

	this.HTMLBaseSpecAtEnd.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTMLBaseSpecAtEnd.prototype.tearDown = function() {
		this.sandbox.restore();
	};


	this.HTMLBaseSpecAtEnd.prototype.testDocumentBody = function(queue) {
		expectAsserts(1);

		assertNotEquals(undefined, document.body);

	};

	this.HTMLBaseSpecAtEnd.prototype.testDocumentElement = function(queue) {
		expectAsserts(1);

		assertNotEquals(undefined, document.documentElement);

	};

})();
