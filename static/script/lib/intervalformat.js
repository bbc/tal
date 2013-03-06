require.def('antie/lib/intervalformat', function() {
	var _unitOrder = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
	var _divisors = {
		'years': 60 * 60 * 24 * 365,
		'months': 60 * 60 * 24 * 30.436875,
		'weeks': 60 * 60 * 24 * 7,
		'days': 60 * 60 * 24,
		'hours': 60 * 60,
		'minutes': 60,
		'seconds': 1
	};

	/**
	 * Method to wrap Array.prototype.indexOf and add support for pre-JS1.5 browsers
	 * @private
	 */
	function _indexOf(arr, obj, start) {
		if(typeof(Array.prototype.indexOf) === 'function') {
			return arr.indexOf(obj, start);
		} else {
			for (var i = (start || 0); i < arr.length; i++) {
				if (arr[i] == obj) {
					return i;
				}
			}
			return -1;
		}
	}

	/**
	 * Formats a time interval, e.g. 3850 seconds as "1 hour, 4 minutes and 10 seconds",
	 * or "1 hour and 4 minutes" or "64 minutes and 10 seconds", etc.
	 *
	 * @param {Integer} seconds Number of seconds to format.
	 * @param {Array} [units] An array of which may be used in the output. One of: years,
	 *			  months, weeks, days, hours, minutes or seconds.
	 * @param {Integer} [maxParts] The maximum number of units to output.
	 * @param {Object} [unitMinimums] An object specifying the minimum number of each unit
	 *				 required before those units are included in the output.
	 * @param {String} [andString] The string to include between the final 2 units. If not
	 * 				specified " and " is used.	
	 */
	return function(seconds, units, maxParts, unitMinimums, andString) {
		if(!units) {
			units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
		}
		if(!andString) {
			andString = " and ";
		}

		var stringParts = [];
		for(var i = 0; i < _unitOrder.length; i++) {
			var unit = _unitOrder[i];
			if(_indexOf(units, unit) !== -1) {
				var count = Math.floor(seconds / _divisors[unit]);
				if(!unitMinimums || !unitMinimums[unit] || count >= unitMinimums[unit]) {
					seconds %= _divisors[unit];
					if(count > 1) {
						stringParts.push(count + " " + unit);
					} else if(count == 1) {
						stringParts.push(count + " " + unit.substring(0, unit.length - 1));
					}
					if(maxParts && (stringParts.length === maxParts)) {
						break;
					}
				}
			}
		}

		if(stringParts.length > 1) {
			var	smallestUnit = stringParts.pop(),
				secondSmallestUnit = stringParts.pop();

			stringParts.splice(stringParts.length - 2, 2, [secondSmallestUnit + andString + smallestUnit]);
		}

		return stringParts.join(', ');
	};
});
