module.exports = function (grunt) {
    var rollup = require('rollup');

    function transpileFactory(name) {
        return function (params) {
            var done = this.async();

            rollup.rollup({
                entry: 'src/' + name
            }).then(function (bundle) {
                bundle.write({
                    format: 'umd',
                    sourceMap: true,
                    //banner: '/* banner */',
                    //footer: '/* footer */',
                    dest: 'dist/' + name,
                    moduleName: 'mx'
                });
            }).catch(function (ex) {
                console.log('error: ' + ex);
            });
        };
    };

    grunt.task.registerTask('transpile-es5', 'convert es5 to umd', transpileFactory('multiplex.js'));
    grunt.task.registerTask('transpile-es6', 'convert es6 to umd', transpileFactory('multiplex-es6.js'));

    grunt.task.registerTask('transpile', 'builds all files, converts es6 modules to umd', function (locales) {
        var tasks = [
            'transpile-es5',
            'transpile-es6'
        ];

        grunt.task.run(tasks);
    });
};
