module.exports = function (grunt) {
    var rollup = require('rollup'),
        path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        version = {
            es5: 'es5',
            es6: 'es6'
        };


    // transpile es6 modules
    function transpile(ver) {
        return rollup.rollup({
            entry: path.join(dirs.source, ver, files.main)
        }).then(function (bundle) {
            return bundle.write({
                // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                format: 'umd',
                dest: path.join(dirs.build, ver, files.main),
                sourceMap: false,
                banner: grunt.config('banner'),
                outro: 'mx.version = \'' + grunt.config('pkg').version + '\';\n',
                footer: ' ',
                moduleName: 'mx'
            });
        });
    }

    // transpile unit tests
    function transpileTests(ver) {
        var files = grunt.file.expand({ cwd: dirs.test }, '**/*.js'),
            header = grunt.file.read(dirs.test + '/test-header');

        return Promise.all(files.map(function (file) {
            return rollup.rollup({
                entry: path.join(dirs.test, file)
            }).then(function (bundle) {
                var code = header + bundle.generate({
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: 'iife',
                    sourceMap: false,
                    useStrict: false
                }).code.split('\n').slice(1).join('\n');

                grunt.file.write(path.join(dirs.build, ver, 'test', file), code);
            });
        }));
    }

    grunt.task.registerTask('transpile-code', 'builds all files/tests, compiles es6 modules', function () {
        var done = this.async();

        Promise.resolve(null)
            .then(function () {
                return transpile(version.es5);
            })
            .then(function () {
                grunt.log.ok('transpile es5');
            })
            .then(function () {
                return transpileTests(version.es5);
            })
            .then(function () {
                grunt.log.ok('transpile es5 tests');
            })
            .then(function () {
                return transpile(version.es6);
            })
            .then(function () {
                grunt.log.ok('transpile es6');
            })
            .then(function () {
                return transpileTests(version.es6);
            })
            .then(function () {
                grunt.log.ok('transpile es6 tests');
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
