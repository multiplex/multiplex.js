module.exports = function (grunt) {
    'use strict';

    const rollup = require('rollup'),
        path = require('path'),
        pkg = grunt.config('pkg'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner'),
        es5source = path.join(dirs.source, files.main),
        es6source = path.join(dirs.source, files.es6),
        es5release = path.join(dirs.release, files.main),
        es6release = path.join(dirs.release, files.es6),
        es5test = path.join(dirs.testbuild, files.main),
        es6test = path.join(dirs.testbuild, files.es6);


    // transpile es6 modules to umd
    // include "banner" in the beginning
    function transpileFactory(entry, dest, format) {
        return function () {
            let done = this.async();

            rollup.rollup({
                entry: entry
            }).then(function (bundle) {
                bundle.write({
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: format,
                    sourceMap: false,
                    banner: banner,
                    footer: ' ',
                    dest: dest,
                    outro: 'Multiplex.version = \'' + pkg.version + '\';\n',
                    moduleName: 'mx'
                });
            }).then(done, function (e) {
                grunt.log.error('error transpiling-custom', e);
                done(e);
            });
        };
    }

    grunt.task.registerTask('transpile-es5', 'convert es5 to umd', transpileFactory(es5source, es5release, 'umd'));
    grunt.task.registerTask('transpile-es6', 'compiles es6', transpileFactory(es6source, es6release, 'es6'));

    grunt.task.registerTask('transpile-es5-test', 'convert es5 to umd for test', transpileFactory(es5source, es5test, 'umd'));
    grunt.task.registerTask('transpile-es6-test', 'convert es6 to umd for test', transpileFactory(es6source, es6test, 'umd'));

    grunt.task.registerTask('transpile', 'builds all files, compiles es6 modules and convert es5 to umd', function () {
        let tasks = [
            'transpile-es5',
            'transpile-es6',
            'transpile-es5-test',
            'transpile-es6-test'
        ];

        grunt.task.run(tasks);
    });
};
