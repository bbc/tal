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
        jasmine: {
            src: 'static/script/**/*.js',
            options: {
                specs: ['static/script-tests/tests/**/*.js'],
                vendor: [
                    "static/script-tests/lib/sinon.js",
                    "static/script-tests/lib/ondevicetestconfigvalidate.js",
                    "static/script-tests/lib/require.js",
                    "static/script-tests/jasmine/jstestdriver-adapter.js",
                    "static/script-tests/lib/mockapplication.js",
                    "static/script-tests/lib/phantompolyfills.js",
                    "static/script-tests/mocks/mockelement.js",
                    "static/script-tests/tests/devices/mediaplayer/commontests.js",
                    "static/script-tests/tests/devices/mediaplayer/html5commontests.js",
                    "static/script-tests/tests/devices/mediaplayer/cehtmlcommontests.js"
                ],
                styles: [
                    "static/script-tests/lib/carousels.css",
                    "static/script-tests/lib/css3transitions.css"
                ],
                template: "static/script-tests/jasmine/SpecRunner.html",
                outfile: 'static/script-tests/jasmine/WebRunner.html',
                keepRunner: true,
                display: "full",
                templateOptions: {
                    scriptRoot: "../..",
                    frameworkVersion: "2.1.0"
                }
            }
        },
        watch: {
            jshint: {
                files: ["static/script/**/*.js"],
                tasks: ["jshint"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask("hint", ["jshint"]);
    grunt.registerTask("test", ["jasmine"]);

    grunt.registerTask("full", ["jshint", "jasmine"]);

    grunt.registerTask("spec", ["jasmine:src:build", "openspec"]);
    grunt.registerTask("openspec", "Open the generated Jasmine spec file", function() {
        var childProcess = require('child_process');
        var outfile = grunt.config("jasmine.options.outfile");
        grunt.log.writeln('Opening ' + outfile + '...');
        childProcess.exec("open " + outfile);
    });

    // Default task(s).
    grunt.registerTask('default', 'test');
};
