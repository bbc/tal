var str = '{"ola":"pedro"}';
var fs = require('fs');

var file ="testconfig/deviceconfig/generic-tv1.json";

var f = JSON.parse(fs.readFileSync([process.cwd(), "/", file].join("")).toString());

console.log(f);
