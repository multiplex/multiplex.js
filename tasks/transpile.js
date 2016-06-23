module.exports = function (grunt) {
    var rollup = require('rollup'),
        path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files');


    // transpile es6 modules, include "banner" and "version"
    function transpile(task, entry, dest, format) {
        var done = task.async();

        rollup.rollup({
            entry: entry
        }).then(function (bundle) {
            bundle.write({
                // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                format: format,
                sourceMap: false,
                banner: grunt.config('banner'),
                footer: ' ',
                dest: dest,
                outro: 'Multiplex.version = \'' + grunt.config('pkg').version + '\';\n',
                moduleName: 'mx'
            });
        }).then(done, function (e) {
            grunt.log.error('error transpiling', e);
            done(e);
        });
    }


    // regsiter all unit tests in a single "testrunner" file to be use in browser
    function compileTestrunner() {
        var fs = require('fs'),
            testrunner = path.join(dirs.test, files.testrunner),
            units = grunt.file.expand(dirs.testunit + '/*.js');

        fs.writeFileSync(testrunner, 'require([' +
            units.map(file => '\n\'' + file.replace(dirs.test, '.') + '\'').join(',') + '\n]);\n');
    }


    grunt.task.registerTask('transpile', 'builds all files, compiles es6 modules and convert es5 to umd', function () {
        transpile(this,
            path.join(dirs.source, files.main),
            path.join(dirs.release, files.main),
            'umd'
        );

        transpile(this,
            path.join(dirs.source, files.es6),
            path.join(dirs.release, files.es6),
            'es6'
        );
    });


    grunt.task.registerTask('transpile-test', 'builds files for test, compiles es6 modules to umd', function () {
        compileTestrunner();

        transpile(this,
            path.join(dirs.source, files.main),
            path.join(dirs.testbuild, files.main),
            'umd'
        );

        transpile(this,
            path.join(dirs.source, files.es6),
            path.join(dirs.testbuild, files.es6),
            'umd'
        );
    });
};
