module.exports = function (grunt) {
    'use strict';

    var dirs = grunt.config('dirs');

    grunt.config.merge({
        clean: {
            build: {
                src: [dirs.build + '/*']
            },
            release: {
                src: [dirs.release + '/*']
            },
            options: {
                force: true
            }
        }
    });

    return grunt;
};
