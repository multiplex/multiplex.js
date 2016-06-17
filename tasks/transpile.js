module.exports = function (grunt) {
    var rollup = require('rollup');
    var dirs = grunt.config.get('dirs');
    var banner = grunt.config.get('banner');

    function transpileFactory(name) {
        return function () {
            var done = this.async();

            rollup.rollup({
                entry: dirs.source + '/' + name
            }).then(function (bundle) {
                bundle.write({
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: 'umd',
                    sourceMap: false,
                    banner: banner,
                    footer: ' ',
                    dest: dirs.release + '/' + name,
                    moduleName: 'mx'
                });
            }).then(done, function (e) {
                grunt.log.error('error transpiling-custom', e);
                done(e);
            });
        };
    }

    grunt.task.registerTask('transpile-es5', 'convert es5 to umd', transpileFactory('multiplex.js'));
    grunt.task.registerTask('transpile-es6', 'convert es6 to umd', transpileFactory('multiplex-es6.js'));

    grunt.task.registerTask('transpile', 'builds all files, converts es6 modules to umd', function () {
        var tasks = [
            'transpile-es5',
            'transpile-es6'
        ];

        grunt.task.run(tasks);
    });
};
