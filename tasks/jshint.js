module.exports = function (grunt) {
    'use strict';

    var dirs = grunt.config('dirs');

    grunt.config.merge({
        jshint: {
            files: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js',
                dirs.test + '/unit/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    return grunt;
};
