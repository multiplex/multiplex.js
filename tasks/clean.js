module.exports = function (grunt) {
    'use strict';

    const dirs = grunt.config('dirs');

    grunt.config.merge({
        clean: {
            build: {
                src: [dirs.release + '/*.*']
            },
            options: {
                force: true
            }
        }
    });

    return grunt;
};
