module.exports = function (grunt) {
    'use strict';

    var dirs = grunt.config('dirs');

    grunt.config.merge({
        jscs: {
            all: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js',
                dirs.test + '/**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        }
    });

    return grunt;
};
