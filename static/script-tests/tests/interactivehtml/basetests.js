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
	this.HTMLBaseSpec = AsyncTestCase('HTML Base Spec');

	this.HTMLBaseSpec.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTMLBaseSpec.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.HTMLBaseSpec.prototype.testJS15 = function(queue) {
		expectAsserts(1);

		var exp = Number.prototype.toExponential(4);
		assertTypeOf('Number.prototype.toExponential has thrown an error', 'string', exp);

	};

	this.HTMLBaseSpec.prototype.testXMLHTTPRequest = function(queue) {
		expectAsserts(1);

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', 'html.js', false);
		xmlhttp.send();
		assertEquals('not valid response from ajax request', 200, xmlhttp.status);

	};

	this.HTMLBaseSpec.prototype.testAnchorElementFocus = function(queue) {
		expectAsserts(2);

		var anchor1 = document.createElement('a');
		anchor1.innerHTML = 'test text';
		anchor1.id = 'anchor1';
		anchor1.href = '#';
		document.body.appendChild(anchor1);
		var anchor2 = document.createElement('a');
		anchor2.innerHTML = 'some more text';
		anchor2.id = 'anchor2';
		anchor2.href = '#';
		document.body.appendChild(anchor2);

		document.getElementById('anchor2').focus();
		assertEquals('second anchor not focused', 'some more text', document.activeElement.innerText);

		document.getElementById('anchor1').focus();
		assertEquals('first anchor not focused', 'test text', document.activeElement.innerText);

	};

	this.HTMLBaseSpec.prototype.testInputElementFocus = function(queue) {
		expectAsserts(1);

		var input1 = document.createElement('input');
		input1.id = 'input1';
		document.body.appendChild(input1);

		document.getElementById('input1').focus();
		assertEquals('input not focused', document.getElementById('input1'), document.activeElement);

	};

	this.HTMLBaseSpec.prototype.testSelectElementFocus = function(queue) {
		expectAsserts(1);

		var select1 = document.createElement('select');
		select1.id = 'select1';
		document.body.appendChild(select1);

		document.getElementById('select1').focus();
		assertEquals('select not focused', document.getElementById('select1'), document.activeElement);

	};

	this.HTMLBaseSpec.prototype.testGetElementsByTagName = function(queue) {
		expectAsserts(1);

		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');
		var div4 = document.createElement('div');
		var div5 = document.createElement('div');

		document.body.appendChild(div1);
		document.body.appendChild(div2);
		document.body.appendChild(div3);
		document.body.appendChild(div4);
		document.body.appendChild(div5);

		assertEquals(5, document.getElementsByTagName('div').length);

	};

	this.HTMLBaseSpec.prototype.testRemoveElement = function(queue) {
		expectAsserts(2);

		var div = document.createElement('div');
		div.id = 'sizingdiv';
		div.className = 'sizingdivclass';
		document.body.appendChild(div);
		assertEquals('sizingdivclass', document.getElementById('sizingdiv').className);

		document.body.removeChild(document.getElementById('sizingdiv'));
		assertEquals(undefined, document.getElementById('sizingdiv'));

	};

	this.HTMLBaseSpec.prototype.testWindowLocation = function(queue) {
		expectAsserts(1);

		assertNotEquals(undefined, window.location);

	};

	this.HTMLBaseSpec.prototype.testWindowName = function(queue) {
		expectAsserts(1);

		assertNotEquals(undefined, window.name);

	};

	this.HTMLBaseSpec.prototype.testDocumentCookie = function(queue) {
		expectAsserts(1);

		assertNotEquals(undefined, document.cookie);

	};

	this.HTMLBaseSpec.prototype.testSetStyle = function(queue) {
		expectAsserts(1);

		var div1 = document.createElement('div');
		div1.id = 'setstyle1';
		div1.style.display = 'inline';
		document.body.appendChild(div1);

		assertEquals('inline', document.getElementById('setstyle1').style.display);

	};

	this.HTMLBaseSpec.prototype.testSection = function(queue) {
		expectAsserts(1);

		var section1 = document.createElement('section');
		section1.id = 'sectiontest';
		document.body.appendChild(section1);
		assertEquals(1, document.getElementsByTagName('section').length);

	};

	this.HTMLBaseSpec.prototype.testCanvas = function(queue) {
		expectAsserts(1);

		var canvas1 = document.createElement('canvas');
		canvas1.id = 'canvastest';
		document.body.appendChild(canvas1);
		assertEquals(1, document.getElementsByTagName('canvas').length);

	};

	this.HTMLBaseSpec.prototype.testDatalist = function(queue) {
		expectAsserts(1);

		var input1 = document.createElement('input');
		input1.id = 'inputtest';
		input1.list = 'linkeddatalist';
		document.body.appendChild(input1);
		var datalist1 = document.createElement('datalist');
		datalist1.id = 'linkeddatalist';
		document.body.appendChild(datalist1);
		assertEquals(1, document.getElementsByTagName('datalist').length);

	};

	this.HTMLBaseSpec.prototype.testWindowAddEventListener = function(queue) {
		expectAsserts(1);

		function onLoadFunction () {
			assert(true);
		}

		window.addEventListener('load', onLoadFunction(), false);

	};

	this.HTMLBaseSpec.prototype.testCreateImageOnLoad = function(queue) {
		expectAsserts(1);

		var image1 = document.createElement('img');
		image1.src = 'http://endpoint.invalid/image';
		document.body.appendChild(image1);

		assertEquals(1, document.getElementsByTagName('img').length);

	};

	this.HTMLBaseSpec.prototype.testCSSSelectors = function(queue) {
		expectAsserts(6);

		var base = document.createElement('div');
		base.id = 'basetests';
		var sec3 = document.createElement('div');
		sec3.className = 'sec3';
		sec3.id = 'num6';
		var sec2 = document.createElement('div');
		sec2.className = 'sec2';
		sec2.id = 'num5';
		var sec1 = document.createElement('div');
		sec1.className = 'sec1';
		sec1.id = 'num4';
		var num1 = document.createElement('div');
		num1.className = 'num2';
		num1.id = 'num2';
		var num2 = document.createElement('div');
		num2.className = 'num2 inner';
		num2.id = 'num3';
		var num4 = document.createElement('div');
		var num5 = document.createElement('div');
		num5.id = 'num7';

		sec2.appendChild(sec3);
		sec1.appendChild(sec2);
		num4.appendChild(num5);
		base.appendChild(num4);
		base.appendChild(sec1);
		base.appendChild(num2);
		base.appendChild(num1);
		document.body.appendChild(base);


		assertEquals('30px', $('#num2').css('font-size'));
		assertEquals('20px', $('#num3').css('font-size'));
		assertEquals('12px', $('#num4').css('font-size'));
		assertEquals('14px', $('#num5').css('font-size'));
		assertEquals('16px', $('#num6').css('font-size'));
		assertEquals('24px', $('#num7').css('font-size'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBackgroundColor = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('backgroundColor'), true, /rgb\(255, 0, 0\)|#ff0000/.test($('#cssattributes').css('backgroundColor')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBackgroundImage = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('backgroundImage'), true, /blocks/.test($('#cssattributes').css('backgroundImage')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBackgroundPosition = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('backgroundPosition'), '100% 50%', $('#cssattributes').css('backgroundPosition'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBackgroundRepeat = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('backgroundRepeat'), 'repeat-y', $('#cssattributes').css('backgroundRepeat'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBorder = function(queue) {
		expectAsserts(6);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('border-top-width'), '8px', $('#cssattributes').css('border-top-width'));
		assertEquals($('#cssattributes').css('border-top-style'), 'double', $('#cssattributes').css('border-top-style'));
		assertEquals($('#cssattributes').css('border-top-color'), true, /rgb\(255, 0, 0\)|#ff0000/.test($('#cssattributes').css('border-top-color')));
		assertEquals($('#cssattributes').css('border-bottom-width'), '4px', $('#cssattributes').css('border-bottom-width'));
		assertEquals($('#cssattributes').css('border-bottom-style'), 'groove', $('#cssattributes').css('border-bottom-style'));
		assertEquals($('#cssattributes').css('border-bottom-color'), true, /rgb\(255, 0, 0\)|#ff0000/.test($('#cssattributes').css('border-bottom-color')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeBottom = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('bottom'), '10px', $('#cssattributes').css('bottom'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeClear = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('clear'), 'both', $('#cssattributes').css('clear'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeColor = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('color'), true, /rgb\(255, 0, 0\)|#ff0000/.test($('#cssattributes').css('color')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeDisplay = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('display'), 'list-item', $('#cssattributes').css('display'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeFloat = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('float'), 'right', $('#cssattributes').css('float'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeFontFamily = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('font-family'), true, /Arial|Tiresias/.test($('#cssattributes').css('font-family')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeFontStyle = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('font-style'), 'italic', $('#cssattributes').css('font-style'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeFontWeight = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('font-weight'), true, /bold|\d{3}/.test($('#cssattributes').css('font-weight')));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeFontSize = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('font-size'), '12px', $('#cssattributes').css('font-size'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeHeight = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('height'), '200px', $('#cssattributes').css('height'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeLeft = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('left'), '50px', $('#cssattributes').css('left'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeLineHeight = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('line-height'), '18px', $('#cssattributes').css('line-height'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeListStyle = function(queue) {
		expectAsserts(3);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('list-style-image'), true, /blocks/.test($('#cssattributes').css('list-style-image')));
		assertEquals($('#cssattributes').css('list-style-position'), 'outside', $('#cssattributes').css('list-style-position'));
		assertEquals($('#cssattributes').css('list-style-type'), 'square', $('#cssattributes').css('list-style-type'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeMargin = function(queue) {
		expectAsserts(2);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('margin-left'), '20px', $('#cssattributes').css('margin-left'));
		assertEquals($('#cssattributes').css('margin-right'), '30px', $('#cssattributes').css('margin-right'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeOverflow = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('overflow'), 'scroll', $('#cssattributes').css('overflow'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributePadding = function(queue) {
		expectAsserts(2);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('padding-top'), '10px', $('#cssattributes').css('padding-top'));
		assertEquals($('#cssattributes').css('padding-right'), '15px', $('#cssattributes').css('padding-right'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributePosition = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('position'), 'fixed', $('#cssattributes').css('position'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeRight = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('right'), '40px', $('#cssattributes').css('right'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeTextAlign = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('text-align'), 'justify', $('#cssattributes').css('text-align'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeTextTransform = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('text-transform'), 'uppercase', $('#cssattributes').css('text-transform'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeTop = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('top'), '15px', $('#cssattributes').css('top'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeVerticalAlign = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('vertical-align'), 'text-top', $('#cssattributes').css('vertical-align'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeVisibility = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('visibility'), 'hidden', $('#cssattributes').css('visibility'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeWidth = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('width'), '400px', $('#cssattributes').css('width'));

	};

	this.HTMLBaseSpec.prototype.testCSSAttributeZIndex = function(queue) {
		expectAsserts(1);

		var base = document.createElement('div');
		base.id = 'cssattributes';
		document.body.appendChild(base);

		assertEquals($('#cssattributes').css('zIndex'), '100', $('#cssattributes').css('zIndex'));

	};

})();
