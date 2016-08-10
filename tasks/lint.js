module.exports = function (grunt) {
    'use strict';

    var files = grunt.config('lint');

    grunt.config.merge({
        jshint: {
            files: files,
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jscs: {
            all: files,
            options: {
                config: '.jscsrc'
            }
        }
    });

    return grunt;
};
