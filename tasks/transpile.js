module.exports = function (grunt) {
    var rollup = require('rollup'),
        path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files');


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
        var files = grunt.file.expand({ cwd: dirs.unit }, '**/*.js');

        return Promise.all(files.map(function (file) {
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
                    dest: path.join(dirs.build, 'test', file),
                    globals: function (id) {
                        if (id.endsWith('multiplex')) {
                            return 'mx';
                        }
                    }
                });
            });
        }));
    }

    grunt.task.registerTask('transpile-code', 'builds all files/tests, compiles es6 modules', function () {
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


    grunt.task.registerTask('transpile', 'cleans build directory, builds all files, compiles es6 modules', function () {
        var tasks = [
            'clean:build',
            'transpile-code'
        ];
        grunt.task.run(tasks);
    });
};
