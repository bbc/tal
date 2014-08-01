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

require.def('antie/widgets/label/texttruncation/positiongenerator',
    [
        "antie/class"
    ],
    function (Class) {
        "use strict";

        /**
         * Generates the index in the string that the algorithm should look up to (but not include) to determine the
         * amount of text that will fit.
         * Starts with a value of 2^n which is just over or equal to the text length. Then halves this value. This value
         * is then halved on each request and either added or subtracted from the current position that is being looked
         * at in the string depending on whether the amount of text is over or under the amount that will fit. A negative
         * value converted to 0.
         * @name antie.widgets.label.texttruncation.PositionGenerator
         * @class
         * @param {Number} txtLength The length of the source string.
         */
        var PositionGenerator = Class.extend(/** @lends antie.widgets.label.texttruncation.positiongenerator.prototype */ {

            /**
             * @constructor
             * @ignore
             */
            init: function(txtLength) {
                this._txtLength = txtLength;
                this._position = this._txtLength;
                this._pointer = 1;
                while (this._pointer < this._txtLength) {
                    this._pointer = this._pointer << 1;
                }
                this._pointer = this._pointer >> 1;
            },

            _calculateNext: function(isOver) {
                var nextPos;

               // get next pointer val or one if over and pointer is zero
                var amount = this._pointer === 0 && isOver ? 1 : this._pointer;
                nextPos = isOver ? this._position - amount : this._position + amount;

                if (nextPos < 0) {
                    nextPos = 0;
                }
                return nextPos;
            },

            /**
             * Returns the position that the source text should be sliced up to next and also registers that this position
             * has been used so the next call of this or 'calculateNext' would be the next position to check.
             * @param {Boolean} isOver True if the source string currently takes up more space than the container when
             *                         sliced to the last position retrieved from 'next'.
             * @returns The position that the source text should be sliced up to next.
             */
            next: function(isOver) {
               this._position = this._calculateNext(isOver);
               this._pointer = this._pointer >> 1;
               return this._position;
            },

            /**
             * Returns the position that the source text should be sliced up to next and also registers that this position
             * has been used so the next call of this or 'calculateNext' would be the next position to check.
             * @param {Boolean} isOver True if the source string currently takes up more space than the container when
             *                         sliced to the last position retrieved from 'next'.
             * @returns The true if there is another position to check.
             */
            hasNext: function(isOver) {
                if (this._position === this._txtLength && !isOver) {
                    return false;
                }
                else if (this._position === 0 && isOver) {
                    return false;
                }
                return this._pointer > 0 || isOver;
            }

        });

        return PositionGenerator;
    }
);