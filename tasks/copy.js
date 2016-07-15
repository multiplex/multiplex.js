module.exports = function (grunt) {
    'use strict';

    var dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

    grunt.config.merge({
        copy: {
            // copy "typescript" files to the build directory
            // include "banner" in the beginning
            build: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: dirs.typings,
                        dest: dirs.build,
                        src: [files.typings],
                        filter: 'isFile'
                    }
                ],
                options: {
                    process: function (content) {
                        return banner + '\n' + content;
                    }
                }
            },

            // copy "build" files to the release directory
            release: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        cwd: dirs.build,
                        dest: dirs.release,
                        src: ['*.{js,js.map,d.ts}'],
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    return grunt;
};
