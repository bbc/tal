/* jshint node: true */
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ['static/script/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
                // options here to override JSHint defaults
                ignores: [
                    'static/script/lib/*',
                    'static/script/devices/googletv.js',
                    'static/script/devices/data/json2.js',
                    'static/script/widgets/horizontalcarousel.js'

                ]
            }
        },
        watch: {
            jshint: {
                files: ["static/script/**/*.js"],
                tasks: ["jshint"]
            }
        },
        complexity: {
            generic: {
                src: ['static/script/**/*.js'],
                exclude: ['static/script/targets/core.js'],
                expand: true,
                options: {
                    breakOnErrors: false,
                    jsLintXML: 'report.xml',         // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false,               // show only maintainability errors
                    cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
                    halstead: [8, 13, 20],           // [difficulty, volume, effort] or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false,     // only display maintainability
                    broadcast: false                 // broadcast data over event-bus
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-complexity');
    grunt.registerTask('default', 'complexity');
};
