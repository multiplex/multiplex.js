module.exports = function (grunt) {
    'use strict';

    var rollup = require('rollup'),
        path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files');

    // polyfill es6 Promise
    if (typeof Promise === 'undefined') {
        global.Promise = require('es6-promise').Promise;
    }

    // polyfill es6 Map (used in rollup)
    if (typeof Map === 'undefined') {
        global.Map = require('es6-map');
    }


    // transpile es6 modules
    function transpile() {
        return rollup.rollup({
            entry: path.join(dirs.source, files.main)
        }).then(function (bundle) {
            return bundle.write({
                // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                format: 'umd',
                dest: path.join(dirs.build, files.main),
                sourceMap: false,
                banner: grunt.config('banner'),
                intro: 'mx.version = \'' + grunt.config('pkg').version + '\';\n',
                footer: '\n',
                moduleName: 'mx'
            });
        });
    }

    // transpile unit tests
    function transpileTests() {
        var units = grunt.file.expand({
            cwd: dirs.unit
        }, '**/[^_]*.js');
        var pattern = /^.*multiplex$/;

        return Promise.all(units.map(function (file) {
            return rollup.rollup({
                entry: path.join(dirs.unit, file),
                external: function (id) {
                    if (pattern.test(id)) {
                        return true;
                    }
                }
            }).then(function (bundle) {
                return bundle.write({
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: 'umd',
                    footer: '\n',
                    sourceMap: false,
                    dest: path.join(dirs.build, dirs.test, file),
                    moduleName: 'mx',
                    globals: function (id) {
                        if (pattern.test(id)) {
                            return 'mx';
                        }
                    }
                });
            });
        }));
    }

    grunt.task.registerTask('transpile', 'builds all files/tests, compiles es6 modules', function () {
        var done = this.async();

        Promise.resolve(null)
            .then(function () {
                return transpile();
            })
            .then(function () {
                grunt.log.ok('transpile code');
            })
            .then(function () {
                return transpileTests();
            })
            .then(function () {
                grunt.log.ok('transpile tests');
            })
            .then(done, function (e) {
                grunt.log.error('error transpiling', e);
                done(e);
            });
    });


    grunt.task.registerTask('build-testrunner', 'creates testrunner html/js file to run unit-tests', function () {
        var testrunner = grunt.file.read(path.join(dirs.test, files.testrunner + '.js')),
            units = grunt.file.expand({
                cwd: dirs.unit
            }, '**/[^_]*.js').map(function (file) {
                return '\n    \'./' + file + '\'';
            }),
            modules = 'var modules = [' + units.join(',') + '\n];\n';

        // create js testrunner to run tests in Node
        // read the address location for js testrunner
        // add modules to the first line of the template
        grunt.file.write(
            path.join(dirs.build, dirs.test, files.testrunner + '.js'),
            modules + testrunner.split('\n').slice(1).join('\n')
        );

        // copy html testrunner to run tests from browser
        grunt.file.copy(
            path.join(dirs.test, files.testrunner + '.html'),
            path.join(dirs.build, dirs.test, files.testrunner + '.html')
        );
    });


    grunt.task.registerTask('build', 'cleans build directory, transpiles es6 modules, builds tests', function () {
        var tasks = [
            'clean:build',
            'transpile',
            'build-testrunner',
            'copy:build',
            'uglify'
        ];
        grunt.task.run(tasks);
    });
};