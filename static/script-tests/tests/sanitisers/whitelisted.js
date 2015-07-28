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
 require(
    [
        'antie/devices/sanitiser',
        'antie/devices/sanitisers/whitelisted'
    ],
    function(Sanitiser) {
        "use strict";

        describe('Basic Sanitisation', function() {

            var el;

            beforeEach(function () {
                el = document.createElement('div');
            });

            it('returns the text string when no dom elements are present', function() {
                var string = "my string",
                    sanitiser = new Sanitiser(string);
                sanitiser.setElementContent(el);
                expect(el.firstChild.data).toEqual(string);
            });

            it('clears all child nodes', function() {
                var string = "",
                    sanitiser = new Sanitiser(string);
                sanitiser.setElementContent(el);
                expect(el.childNodes.length).toEqual(0);
            });

            it ('returns strips out tags that are not part of the whitelist', function () {
                 var string = "<script>my string</script>",
                     sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild).toEqual(null);
            });

            it ('returns tags that are part of the whitelist in the text', function () {
                var string = "<p>my string</p>",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.tagName.toUpperCase()).toEqual('P');
                expect(el.firstChild.firstChild.data).toEqual('my string');
            });

            it ('returns br tags', function () {
                var string = "my <br /> string",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.data).toEqual('my ');
                expect(el.childNodes[1].tagName.toUpperCase()).toEqual('BR');
            });


            it ('returns old br tags', function () {
                var string = "my <br> string",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.data).toEqual('my ');
                expect(el.childNodes[1].tagName.toUpperCase()).toEqual('BR');
            });


            it ('returns dual level nodes', function () {
                var string = "<p>P1</p><p>P2</p>",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.firstChild.data).toEqual('P1');
                expect(el.childNodes[1].firstChild.data).toEqual('P2');
            });

            it ('returns html entities', function () {
                var string = "&bull;&bull;&bull;",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.data).toEqual('•••');
            });

            it ('returns text that contains ampersands', function () {
                var string = "<p>my & string</p>",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.firstChild.data).toEqual('my & string');
            });

            it ('returns recursively included tags', function () {
                var string = "<p><p>my string</p></p>",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.firstChild.tagName.toUpperCase()).toEqual('P');
                expect(el.firstChild.firstChild.firstChild.data).toEqual('my string');
            });


            it ('returns recursively included tags when not at top level', function () {
                var string = "<p>a string<p>my string</p>another string</p>",
                    sanitiser = new Sanitiser(string);


                sanitiser.setElementContent(el);
                expect(el.firstChild.tagName.toUpperCase()).toEqual('P');
                expect(el.firstChild.firstChild.data).toEqual('a string');
                expect(el.firstChild.childNodes[1].tagName.toUpperCase()).toEqual('P');
                expect(el.firstChild.childNodes[1].firstChild.data).toEqual('my string');
                expect(el.firstChild.childNodes[2].data).toEqual('another string');
            });
        });

        describe('Mixed Type Sanitzation', function() {

            var el = document.createElement('div');
            it ('returns mixed string with sanitsation implemented', function () {
                var string = "<div><h1>Title</h1><ul><li>list 1</li><li><script>nastiness</script>OK</li></ul></div>",
                    result = "<h1>Title</h1><ul><li>list 1</li><li>OK</li></ul>",
                    sanitiser = new Sanitiser(string);

                sanitiser.setElementContent(el);
                expect(el.firstChild.innerHTML).toEqual(result);
            });

        });
    }
);
