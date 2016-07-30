module.exports = function (grunt) {
    'use strict';

    grunt.config.merge({
        jscs: {
            all: grunt.config('lint'),
            options: {
                config: '.jscsrc'
            }
        }
    });

    return grunt;
};
