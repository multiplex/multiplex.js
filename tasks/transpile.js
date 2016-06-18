module.exports = function (grunt) {
    var rollup = require('rollup'),
        pkg = grunt.config('pkg'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

    function transpileFactory(name, format) {
        return function () {
            var done = this.async();

            rollup.rollup({
                entry: dirs.source + '/' + name
            }).then(function (bundle) {
                bundle.write({
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: format,
                    sourceMap: false,
                    banner: banner,
                    footer: ' ',
                    dest: dirs.release + '/' + name,
                    intro: 'Multiplex.version = \'' + pkg.version + '\';\n',
                    moduleName: 'mx'
                });
            }).then(done, function (e) {
                grunt.log.error('error transpiling-custom', e);
                done(e);
            });
        };
    }

    grunt.task.registerTask('transpile-es5', 'convert es5 to umd', transpileFactory(files.main, 'umd'));
    grunt.task.registerTask('transpile-es6', 'compiles es6', transpileFactory(files.es6, 'es6'));

    grunt.task.registerTask('transpile', 'builds all files, compiles es6 modules and convert es5 to umd', function () {
        var tasks = [
            'transpile-es5',
            'transpile-es6'
        ];

        grunt.task.run(tasks);
    });
};
