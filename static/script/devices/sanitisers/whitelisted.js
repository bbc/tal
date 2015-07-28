/**
 * @fileOverview A sanitisation strategy using a whitelist of tags
 *
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
 require.def('antie/devices/sanitisers/whitelisted',
    [
      'antie/devices/sanitiser',
      'antie/lib/array.indexof' // Adds Array.prototype.indexOf()
    ],
    function (Sanitiser) {

    'use strict';

    Sanitiser.prototype = {

        _entities: {
            '&ldquo;': '“',
            '&rdguo;': '”',
            '&lsquo;': '‘',
            '&rsquo;': '’',
            '&laquo;': '«',
            '&raquo;': '»',
            '&lsaquo;': '‹',
            '&rsaquo;': '›',
            '&lt;': '<',
            '&gt;': '>',
            '&nbsp;': ' ',
            '&bull;': '•',
            '&deg;': '°',
            '&hellip;': '…',
            '&trade;': '™',
            '&copy;': '©',
            '&reg;': '®',
            '&mdash;': '—',
            '&ndash;': '–'
        },

        _whitelist: ['p', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'br'],

        setElementContent: function (el) {
            var dom = this._createDom();
            this._clearElement(el);
            this._processDomElement(dom.firstChild, el);
        },

        _clearElement: function(el) {
            for (var i = el.childNodes.length - 1; i >= 0; i--) {
                el.removeChild(el.childNodes[i]);
            }
        },

        _createDom: function () {
            var xmlDoc,
                string = "<content>" + this._string + "</content>";

            string = this._replaceEntities(string);

            if (window.DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(string, "text/xml");

            }
            else // Internet Explorer
            {
              xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async = false;
              xmlDoc.loadXML(string);
            }
            return xmlDoc;
        },

        _replaceEntities: function (string) {

            var replaced = {},
                regexp,
                matches = string.match(/&[a-zA-Z0-9]*;/g);

            string = string.replace(/&(?![a-zA-Z]*;)/g, '&amp;');

            if (matches === null) {
                return string;
            }

            for (var i = 0; i < matches.length; i++) {
                if (replaced[matches[i]] === undefined && this._entities[matches[i]] !== undefined) {
                    replaced[matches[i]] = true;

                    regexp = new RegExp(matches[i], 'g');
                    string = string.replace(regexp, this._entities[matches[i]]);
                }
            }

            return string;

        },

        _processDomElement: function (element, originalDom) {

            var content = element.childNodes,
                el;

            for (var i = 0; i < content.length; i++) {
                if (content[i].tagName) {
                    if (this._whitelist.indexOf(content[i].tagName) !== -1) {
                        el = document.createElement(content[i].tagName);
                        el = this._processDomElement(content[i], el);
                        originalDom.appendChild(el);
                    }
                } else {
                    el = document.createTextNode(content[i].data);
                    originalDom.appendChild(el);
                }
            }
            return originalDom;
        }
    };

});
