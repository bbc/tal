/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

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
			logging : {
				level : "all",
				strategy : "onscreen"
			}
		});

		ConfigurationApi.override({logging:{level:"none"}});

		var config = this.getConfiguration();
		assertEquals("Nested item is correctly updated", "none", config.logging.level);
		assertEquals("Nested item is not overridden", "onscreen", config.logging.strategy);
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