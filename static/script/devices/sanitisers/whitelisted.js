/**
 * @fileOverview A sanitisation strategy using a whitelist of tags
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/sanitisers/whitelisted',
    [
        'antie/devices/sanitiser'
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

            setElementContent: function setElementContent (el) {
                var dom = this._createDom();
                this._clearElement(el);
                this._processDomElement(dom.firstChild, el);
            },

            _clearElement: function _clearElement (el) {
                for (var i = el.childNodes.length - 1; i >= 0; i--) {
                    el.removeChild(el.childNodes[i]);
                }
            },

            _createDom: function _createDom () {
                var xmlDoc,
                    string = '<content>' + this._string + '</content>';

                string = this._replaceEntities(string);

                if(window.DOMParser) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(string, 'text/xml');

                } else {// Internet Explorer
                    xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                    xmlDoc.async = false;
                    xmlDoc.loadXML(string);
                }
                return xmlDoc;
            },

            _replaceEntities: function _replaceEntities (string) {

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

            _processDomElement: function _processDomElement (element, originalDom) {

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
