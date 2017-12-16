/**
 * @fileOverview Requirejs module containing the antie.widgets.TextPager class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/textpager',
    [
        'antie/widgets/label',
        'antie/events/textpagechangeevent'
    ],
    function(Label, TextPageChangeEvent) {
        'use strict';

        /**
         * The TextPager widget displays text. It computers its own size, allows scrolling and reports page numbers.
         * @name antie.widgets.TextPager
         * @class
         * @extends antie.widgets.Label
         * @requires antie.events.TextPageChangeEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         */
        var TextPager = Label.extend(/** @lends antie.widgets.TextPager.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, enableHTML) {
                init.base.call(this, id, '', enableHTML);
                this.addClass('textpager');
                this._page = 1;
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                var s = this._text;

                if(!this.outputElement) {
                    this.outputElement = device.createContainer(this.id, this.getClasses());
                    this.innerElement = device.createContainer(this.id + '_inner');
                    this.outputElement.appendChild(this.innerElement);
                }
                device.setElementContent(this.innerElement, s, this._enableHTML);

                return this.outputElement;
            },
            getPageCount: function getPageCount () {
                if (!this._paddingFudge) {
                    this._paddingFudge = true;
                    this.textHeight = this.innerElement.clientHeight;
                    this.boxHeight = this.outputElement.clientHeight;

                    this.lineHeight = this.getCurrentApplication().getLayout().textPager.lineHeight;

                    this.lines_in_box = Math.floor(this.boxHeight / this.lineHeight);
                    this.lines_in_text = Math.floor(this.textHeight / this.lineHeight);

                    this._pageCount = Math.ceil(this.lines_in_text / this.lines_in_box);
                    var extra = this.textHeight - (this.lines_in_text % this.lines_in_box);
                    this.innerElement.style.paddingBottom = this.lineHeight * extra + 'px';
                }
                return this._pageCount;
            },
            getCurrentPage: function getCurrentPage () {
                return this._page;
            },
            setPage: function setPage (page) {
                var el = this.outputElement;
                this._page = page;
                el.scrollTop = (page - 1) * this.lineHeight * this.lines_in_box;
                this.bubbleEvent(new TextPageChangeEvent(this, page));
            },
            pageUp: function pageUp () {
                var page = this.getCurrentPage();
                if (page === 1) {
                    return;
                }
                this.setPage(page - 1);
            },
            pageDown: function pageDown () {
                var max = this.getPageCount();
                var page = this.getCurrentPage();
                if (page === max) {
                    return;
                }
                this.setPage(page + 1);
            },

            setText: function setText (text) {
                setText.base.call(this, text);

                // Remove the bottom padding to allow the page count to be
                // recalculated.
                if(this.innerElement) {
                    this.innerElement.style.paddingBottom = 0;
                }
                this._paddingFudge = false;
            }
        });
        return TextPager;
    }
);
