module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            src: [
                'static/script/**/*.js',
                'static/script-tests/**/*.js'
            ],
            options: {
                quiet: true
            }
        },
        jasmine: {
            src: 'static/script/**/*.js',
            options: {
                specs: ['static/script-tests/tests/**/*.js'],
                vendor: [
                    'static/script-tests/lib/sinon.js',
                    'static/script-tests/lib/ondevicetestconfigvalidate.js',
                    'static/script-tests/lib/require.js',
                    'static/script-tests/jasmine/jstestdriver-adapter.js',
                    'static/script-tests/lib/mockapplication.js',
                    'static/script-tests/lib/phantompolyfills.js',
                    'static/script-tests/mocks/mockelement.js',
                    'static/script-tests/tests/devices/mediaplayer/commontests.js',
                    'static/script-tests/tests/devices/mediaplayer/html5commontests.js',
                    'static/script-tests/tests/devices/mediaplayer/cehtmlcommontests.js'
                ],
                styles: [
                    'static/script-tests/lib/carousels.css',
                    'static/script-tests/lib/css3transitions.css'
                ],
                template: 'static/script-tests/jasmine/SpecRunner.html',
                outfile: 'static/script-tests/jasmine/WebRunner.html',
                keepRunner: true,
                display: 'full',
                templateOptions: {
                    scriptRoot: '../..'
                },
                summary: true
            }
        },
        watch: {
            eslint: {
                files: ['static/script/**/*.js'],
                tasks: ['eslint']
            }
        },
        complexity: {
            generic: {
                src: ['static/script/**/*.js'],
                exclude: ['static/script/targets/core.js'],
                expand: true,
                options: {
                    breakOnErrors: false,
                    jsLintXML: 'report.xml', // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: [3, 7, 12], // or optionally a single value, like 3
                    halstead: [8, 13, 20], // [difficulty, volume, effort] or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false, // only display maintainability
                    broadcast: false // broadcast data over event-bus
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
                }, {
                    from: '</body>',
                    to: grunt.file.read('jsdoc/footer.txt').trim() + '</body>'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%' + (grunt.option('m') ? ' - ' + grunt.option('m') : ''),
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%' + (grunt.option('m') ? ' - ' + grunt.option('m') : ''),
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        jsdoc: {
            dist: {
                src: ['static/script/*/**.js'],
                options: {
                    destination: 'jsdoc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['jasmine', 'eslint']);
    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('full', ['eslint', 'jasmine']);
    grunt.registerTask('default', 'full');
    grunt.registerTask('spec', ['jasmine:src:build', 'openspec']);

    grunt.registerTask('openspec', 'Open the generated Jasmine spec file', function() {
        var childProcess = require('child_process');
        var outfile = grunt.config('jasmine.options.outfile');
        grunt.log.writeln('Opening ' + outfile + '...');
        childProcess.exec('open ' + outfile);
    });
};
