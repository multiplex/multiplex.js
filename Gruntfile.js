module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            test: 'test',
            source: 'src',
            release: 'dist'
        }
    });


    grunt.loadTasks('tasks');

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('dev', []);
    grunt.registerTask('test', []);
    grunt.registerTask('default', []);
    grunt.registerTask('release', []);
};
