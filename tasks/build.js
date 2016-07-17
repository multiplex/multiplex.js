module.exports = function (grunt) {
    'use strict';

    var rollup = require('rollup'),
        path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        Promise = typeof (Promise) === 'function' ? Promise : require('es6-promise').Promise;


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
                outro: 'mx.version = \'' + grunt.config('pkg').version + '\';\n',
                footer: '\n',
                moduleName: 'mx'
            });
        });
    }

    // transpile unit tests
    function transpileTests() {
        var units = grunt.file.expand({ cwd: dirs.unit }, '**/*.js');
        console.log(units.map);
        console.log(Promise.all);
        return Promise.all(units.map(function (file) {
            return rollup.rollup({
                entry: path.join(dirs.unit, file),
                external: function (id) {
                    if (id.endsWith('multiplex')) {
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
                    globals: function (id) {
                        if (id.endsWith('multiplex')) {
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


    grunt.task.registerTask('build-testrunner', 'creates testrunner html file to run unit-tests', function () {
        var testrunner = 'testrunner',
            units = grunt.file.expand({ cwd: dirs.unit }, '**/*.js').map(function (file) {
                return '\n    \'' + file + '\'';
            }),
            script = 'require([' + units.join(',') + '\n]);\n';

        grunt.file.write(
            path.join(dirs.build, dirs.test, testrunner + '.js'),
            script
        );

        grunt.file.copy(
            path.join(dirs.unit, testrunner),
            path.join(dirs.build, dirs.test, testrunner + '.html')
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
