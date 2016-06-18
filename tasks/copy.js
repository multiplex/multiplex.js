module.exports = function (grunt) {
    var dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

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
