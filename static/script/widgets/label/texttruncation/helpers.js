require.def('antie/widgets/label/texttruncation/helpers',
    ['antie/widgets/label/texttruncation/positiongenerator'],
    function (PositionGenerator) {
        "use strict";

        return {
            // returns true if the result of str sliced to slicePoint would end at a word boundary
            isAtWordBoundary: function(str, slicePoint) {
                return slicePoint >= str.length || str[slicePoint] === " ";
            },

            // returns the index of the last word boundary
            getLastWordBoundaryIndex: function(str) {
                return str.lastIndexOf(" ");
            },

            // returns a trimmed version of str to the end of the last word
            // this assumes that str is already finishing mid way through a word
            trimToWord: function(str) {
                var lastSpaceIndex = this.getLastWordBoundaryIndex(str);
                if (lastSpaceIndex !== -1) {
                    return str.slice(0, lastSpaceIndex);
                }
                return str;
            },

            // returns str with any trailing whitespace removed
            trimTrailingWhitespace: function(str) {
                while (str.length > 0 && str[str.length - 1] === " ") {
                    str = str.slice(0, str.length - 1);
                }
                return str;
            },

            // perform a binary chop until find number of characters that will fit
            getNumCharactersThatFit: function(workContainer, txt, txtEnd) {
                var positionGenerator = new PositionGenerator(txt.length);
                var position = txt.length;
                workContainer.setTxt(txt);
                while(positionGenerator.hasNext(workContainer.isOver())) {
                    position = positionGenerator.next(workContainer.isOver());
                    var txtWorkingOn = txt.slice(0, position);
                    // txtEnd should only be added on last line.
                    workContainer.setTxt(txtWorkingOn + txtEnd);
                }
                return position;
            }
        };
    }
);