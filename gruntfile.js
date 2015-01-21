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
        },
        replace: {
            'jsdoc-tidy': {
                src: ['jsdoc/**/*.html'],
                overwrite: true,
                replacements: [{
                    from: '../symbols/',
                    to: ''
                },
                {
                    from: "</body>",
                    to: grunt.file.read('jsdoc/footer.txt').trim() + "</body>"
                }]
            }
        }
    });

    grunt.registerTask('generate-jsdoc', 'Generate JsDoc for TAL', function() {
        var path = require('path');
        var execSync = require('exec-sync');

        if (grunt.file.exists('jsdoc/symbols')) {
            grunt.file.delete('jsdoc/symbols');
        }
        grunt.file.recurse('static/script', function(absPath, rootDir, subDir, fileName) {
            subDir = subDir || '';
            grunt.file.copy(absPath, path.join('antie', 'static', 'script', subDir, fileName));
        });

        execSync('node_modules/jsdoc-toolkit/app/run.js -r=10 -t=node_modules/jsdoc-toolkit/templates/jsdoc -d=jsdoc antie/static/script');
        grunt.file.delete('antie');
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.registerTask('default', 'complexity');
    grunt.registerTask('jsdoc', ['generate-jsdoc', 'replace:jsdoc-tidy']);
};
