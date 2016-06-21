module.exports = function (grunt) {
    'use strict';

    const dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

    // copy "typings" and "intellisense" files to the release directory
    // include "banner" in the beginning
    grunt.config.merge({
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: dirs.source,
                        dest: dirs.release,
                        src: [files.typings, files.intellisense],
                        filter: 'isFile'
                    }
                ],
                options: {
                    process: function (content) {
                        return banner + '\n' + content;
                    }
                }
            }
        }
    });

    return grunt;
};
