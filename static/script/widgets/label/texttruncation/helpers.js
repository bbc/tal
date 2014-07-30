require.def('antie/widgets/label/texttruncation/helpers',
    [],
    function () {
        "use strict";

        return {
            /**
             * Determine whether the result of str sliced to slicePoint would end at a word boundary.
             * @param {String} str The string that will be sliced.
             * @param {String} slicePoint The point that this string would be sliced at. (Second param of slice)
             * @returns true or false
             */
            isAtWordBoundary: function(str, slicePoint) {
                return slicePoint >= str.length || str[slicePoint] === " ";
            },

            /**
             * Get the index of the start of the last word boundary in a string.
             * @param {String} str The string to check.
             * @returns The index or -1 if no word boundary could be found.
             */
            getLastWordBoundaryIndex: function(str) {
                return str.lastIndexOf(" ");
            },

            /**
             * Trim a string so that it ends after a complete word.
             * @param {String} str The string to trim.
             * @returns A trimmed version of the string.
             */
            trimToWord: function(str) {
                var lastSpaceIndex = this.getLastWordBoundaryIndex(str);
                if (lastSpaceIndex !== -1) {
                    return str.slice(0, lastSpaceIndex);
                }
                return "";
            },

            /**
             * Removes whitespace from the end of a string.
             * @param {String} str The string to remove whitespace from.
             * @returns The new string with trailing whitespace removed.
             */
            trimTrailingWhitespace: function(str) {
                while (str.length > 0 && str[str.length - 1] === " ") {
                    str = str.slice(0, str.length - 1);
                }
                return str;
            }
        };
    }
);