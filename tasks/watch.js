module.exports = function (grunt) {
    'use strict';

    grunt.config.merge({
        watch: {
            scripts: {
                files: grunt.config('lint'),
                tasks: ['lint'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });

    return grunt;
};
