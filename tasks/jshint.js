module.exports = function (grunt) {
    'use strict';

    grunt.config.merge({
        jshint: {
            files: grunt.config('lint'),
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    return grunt;
};
