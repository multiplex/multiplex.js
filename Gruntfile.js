module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        dirs = {
            source: 'src',
            release: 'dist',
            tasks: 'tasks',
            test: 'test',
            testbuild: 'test/build',
            testunit: 'test/unit'
        },
        files = {
            main: 'multiplex.js',
            es6: 'multiplex.es6.js',
            minified: 'multiplex.min.js',
            typings: 'multiplex.d.ts',
            intellisense: 'multiplex.intellisense.js',
            testrunner: 'testrunner.js'
        },
        banner = [
            '/*!',
            '* ' + pkg.title + ' - ' + pkg.description,
            '* Version ' + pkg.version + ' (' + grunt.template.today('mmmm dd, yyyy') + ')',
            '',
            '* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>',
            '* Licensed under Apache License Version 2.0',
            '* ' + pkg.homepage,
            '*/',
            ''
        ].join('\n');


    grunt.initConfig({
        pkg: pkg,
        dirs: dirs,
        files: files,
        banner: banner
    });


    // load grunt tasks
    grunt.loadTasks(dirs.tasks);

    // load grunt tasks from NPM packages
    require('load-grunt-tasks')(grunt);

    // linting
    grunt.registerTask('lint', ['jshint', 'jscs']);

    // test tasks
    grunt.registerTask('test', ['transpile', 'qtest']);

    // default task
    grunt.registerTask('default', ['lint', 'test']);

    // releasing a new version
    grunt.registerTask('release', [
        'clean',
        'default',
        'copy',
        'uglify'
    ]);
};
