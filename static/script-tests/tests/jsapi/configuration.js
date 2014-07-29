(function() {
	this.ConfigurationOverrideAPITest = AsyncTestCase("Configuration override API");

	this.ConfigurationOverrideAPITest.prototype.setUp = function() {
		this.originalConfiguration = this.getConfiguration();
		this.setConfiguration({});
	};

	this.ConfigurationOverrideAPITest.prototype.tearDown = function() {
		this.setConfiguration(this.originalConfiguration);
	};

	this.ConfigurationOverrideAPITest.prototype.assertElementIsDefinedAndEqualTo = function(key, value) {
		var item = this.getConfiguration()[key];
		assertNotNull("Configuration element '"+key+"' should not be NULL", item);
		assertNotUndefined("Configuration element '"+key+"' should not be undefined", item);
		assertEquals("Configuration element '"+key+"' should have the value '"+value+"'", value, item);
	};

	this.ConfigurationOverrideAPITest.prototype.setConfiguration = function(newConfiguration) {
		antie.framework.deviceConfiguration = newConfiguration;
	};

	this.ConfigurationOverrideAPITest.prototype.getConfiguration = function() {
		return antie.framework.deviceConfiguration;
	};

	this.ConfigurationOverrideAPITest.prototype.testAddingSingleElementToConfiguration = function(queue) {
		expectAsserts(3);
		ConfigurationApi.override({newelement:'item1'});
		this.assertElementIsDefinedAndEqualTo('newelement', 'item1');
	};

	this.ConfigurationOverrideAPITest.prototype.testAddingMultipleElementsToConfiguration = function(queue) {
		expectAsserts(6);
		ConfigurationApi.override({newelement:'item1', secondelement:'item2'});
		this.assertElementIsDefinedAndEqualTo('newelement', 'item1');
		this.assertElementIsDefinedAndEqualTo('secondelement', 'item2');
	};

	this.ConfigurationOverrideAPITest.prototype.testOverridingASingleItemInTheConfigurationDoesntLoseAllTheChildren = function(queue) {
		expectAsserts(2);
		this.setConfiguration({
			media_selector : {
				url : "http://open.live.bbc.co.uk/",
				mediaset : "stb-hd-h264"
			}
		});

		ConfigurationApi.override({media_selector:{url:"http://samsung.gateway.bbc.co.uk/"}});

		var config = this.getConfiguration();
		assertEquals("Nested item is correctly updated", "http://samsung.gateway.bbc.co.uk/", config.media_selector.url);
		assertEquals("Nested item is not overridden", "stb-hd-h264", config.media_selector.mediaset);
	};

	this.ConfigurationOverrideAPITest.prototype.testOverridingASingleItemWithDifferentlyNestedChildrenDoesNotBreak = function(queue) {
		expectAsserts(4);
		this.setConfiguration({
			a : {
				b : {
					c : {
						d : "d-content-unchanged"
					},
					e : {
						f : "f-content-unchanged",
						g : {
							h : "h-content-unchanged"
						}
					}
				},
				i : "i-content-unchanged"
			}
		});

	    var patch = {
			a : {
				b : {
					c : "c-content-new",
					e : {
						g : {
							h : "h-content-new"
						}
					}
				}
			}
		};

		var expected = {
			a : {
				b : {
					c : "c-content-new",
					e : {
						f : "f-content-unchanged",
						g : {
							h : "h-content-new"
						}
					}
				},
				i : "i-content-unchanged"
			}
		};
		ConfigurationApi.override(patch);

		var config = this.getConfiguration();

		assertEquals("c-content-new", config.a.b.c);
		assertEquals("f-content-unchanged", config.a.b.e.f);
		assertEquals("h-content-new", config.a.b.e.g.h);
		assertEquals("i-content-unchanged", config.a.i);
	};

})();