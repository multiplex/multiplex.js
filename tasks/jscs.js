module.exports = function (grunt) {
    'use strict';

    const dirs = grunt.config('dirs');

    grunt.config.merge({
        jscs: {
            all: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js',
                dirs.test + '/unit/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        }
    });

    return grunt;
};
