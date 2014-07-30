require.def('antie/widgets/label/texttruncation/positiongenerator',
    [
    ],
    function () {
        "use strict";

        /**
         * Generates the index in the string that the algorithm should look up to (but not include) to determine the
         * amount of text that will fit.
         * Starts with a value of 2^n which is just over or equal to the text length. This value is then halved on each
         * request and either added or subtracted from the current position that is being looked at in the string depending
         * on whether the amount of text is over or under the amount that will fit. A negative value converted to 0 and a
         * value higher than the text length is converted to the text length.
         * @name antie.widgets.label.texttruncation.positiongenerator
         * @class
         * @param {String} [txtLength] The length of the source string.
         */
        function PositionGenerator(txtLength) {
            this._txtLength = txtLength;
            this._position = this._txtLength;
            this._pointer = 1;
            while (this._pointer < this._txtLength) {
                this._pointer = this._pointer << 1;
            }
        }

        /**
         * Returns the position that the source text should be sliced up to next.
         * @param {Boolean} [isOver] True if the source string currently takes up more space than the container when
         *                           sliced to the last position retrieved from 'next'.
         * @returns The position that the source text should be sliced up to next.
         */
        PositionGenerator.prototype.calculateNext = function(isOver) {
            var nextPos;
            var amount = this._pointer === 0 && isOver ? 1 : this._pointer;
            nextPos = isOver ? this._position - amount : this._position + amount;

            if (nextPos < 0) {
                nextPos = 0;
            }
            else if (nextPos > this._txtLength) {
                nextPos = this._txtLength;
            }
            return nextPos;
        };

        /**
         * Returns the position that the source text should be sliced up to next and also registers that this position
         * has been used so the next call of this or 'calculateNext' would be the next position to check.
         * @param {Boolean} [isOver] True if the source string currently takes up more space than the container when
         *                           sliced to the last position retrieved from 'next'.
         * @returns The position that the source text should be sliced up to next.
         */
        PositionGenerator.prototype.next = function(isOver) {
            this._position = this.calculateNext(isOver);
            this._pointer = this._pointer >> 1;
            return this._position;
        };

        /**
         * Returns the position that the source text should be sliced up to next and also registers that this position
         * has been used so the next call of this or 'calculateNext' would be the next position to check.
         * @param {Boolean} [isOver] True if the source string currently takes up more space than the container when
         *                           sliced to the last position retrieved from 'next'.
         * @returns The true if there is another position to check.
         */
        PositionGenerator.prototype.hasNext = function(isOver) {
            if (this._position === this._txtLength && !isOver) {
                return false;
            }
            else if (this._position === 0 && isOver) {
                return false;
            }
            return this._pointer > 0 || isOver;
        };

        return PositionGenerator;
    }
);