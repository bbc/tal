define('antie/lib/date.format', function() {

// Simulates PHP's date function
// From: http://jacwright.com/projects/javascript/date_format
// MIT Licensed!

Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") { 
			returnStr += curChar;
		}
		else if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else if (curChar != "\\"){
			returnStr += curChar;
		}
	}
	return returnStr;
};
 
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	// Day
	d: function d () { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function D () { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function j () { return this.getDate(); },
	l: function l () { return Date.replaceChars.longDays[this.getDay()]; },
	N: function N () { return this.getDay() + 1; },
	S: function S () { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function w () { return this.getDay(); },
	z: function z () { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
	// Week
	W: function W () { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
	// Month
	F: function F () { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function m () { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function M () { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function n () { return this.getMonth() + 1; },
	t: function t () { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate(); }, // Fixed now, gets #days of date
	// Year
	L: function L () { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },	// Fixed now
	o: function o () { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
	Y: function Y () { return this.getFullYear(); },
	y: function y () { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function a () { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function A () { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function B () { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
	g: function g () { return this.getHours() % 12 || 12; },
	G: function G () { return this.getHours(); },
	h: function h () { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function H () { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function i () { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function s () { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	u: function u () { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
'0' : '')) + m; },
	// Timezone
	e: function e () { return "Not Yet Supported"; },
	I: function I () { return "Not Yet Supported"; },
	O: function O () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function P () { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
	T: function T () { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function Z () { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function c () { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
	B: function B () { return this.format("Y-m-d\\TH:i:sO"); }, // e.g. "2010-10-15T01:30:27+0000" (Antie addition)
	r: function r () { return this.toString(); },
	U: function U () { return this.getTime() / 1000; }
};

});
