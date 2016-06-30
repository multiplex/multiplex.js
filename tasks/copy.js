module.exports = function (grunt) {
    var dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner'),
        path = require('path');

    // copy "typings" and "intellisense" files to the release directory
    // include "banner" in the beginning
    grunt.config.merge({
        copy: {
            // copy built files to the release directory
            main: {
                files: [
                    {
                        dest: path.join(dirs.release, files.main),
                        src: [path.join(dirs.build, files.main)]
                    }
                ]
            },

            // copy "typescript" files to the release directory
            // include "banner" in the beginning
            typings: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: dirs.typings,
                        dest: dirs.release,
                        src: [files.typings],
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
