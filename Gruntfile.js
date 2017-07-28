module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        dirs = {
            build: 'build',
            release: 'dist',
            tasks: 'tasks',
            source: 'src',
            test: 'test',
            unit: 'test/unit',
            typings: 'src/typings',
            benchmark: 'benchmark'
        },
        files = {
            main: 'multiplex.js',
            minified: 'multiplex.min.js',
            typings: 'multiplex.d.ts',
            testrunner: 'testrunner'
        },
        lint = [
            'Gruntfile.js',
            dirs.source + '/**/*.js',
            dirs.tasks + '/**/*.js',
            dirs.test + '/**/*.js'
        ],
        banner = [
            '/*!',
            '* ' + pkg.title + ' - ' + pkg.description,
            '* Version ' + pkg.version + ' (' + grunt.template.today('mmmm dd, yyyy') + ')',
            '',
            '* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>',
            '* Licensed under MIT License',
            '* ' + pkg.homepage,
            '*/',
            ''
        ].join('\n');


    grunt.initConfig({
        pkg: pkg,
        dirs: dirs,
        files: files,
        lint: lint,
        banner: banner
    });


    // load grunt tasks
    grunt.loadTasks(dirs.tasks);

    // load grunt tasks from NPM packages
    require('load-grunt-tasks')(grunt);

    // linting
    grunt.registerTask('lint', ['jshint', 'jscs']);

    // test tasks
    grunt.registerTask('test', ['build', 'qtest']);

    // default task
    grunt.registerTask('default', ['lint', 'test']);

    // travis build task
    grunt.registerTask('build:travis', ['default']);

    // releasing a new version
    grunt.registerTask('release', [
        'clean:release',
        'default',
        'copy:release'
    ]);
};
