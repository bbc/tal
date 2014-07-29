require.def('antie/widgets/label/texttruncation/positiongenerator',
    [
    ],
    function () {
        "use strict";

        function PositionGenerator(txtLength) {
            this._txtLength = txtLength;
            this._position = this._txtLength;
            this._pointer = 1;
            while (this._pointer < this._txtLength) {
                this._pointer = this._pointer << 1;
            }
        }

        // get the next position to slice the text at. (Second parameter of .slice)
        // a position of 2 means up to but not including the second character.
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

        PositionGenerator.prototype.next = function(isOver) {
            this._position = this.calculateNext(isOver);
            this._pointer = this._pointer >> 1;
            return this._position;
        };

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