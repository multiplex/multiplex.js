module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    grunt.config.merge({
        watch: {
            scripts: {
                files: [
                    'Gruntfile.js',
                    dirs.source + '/**/*.js',
                    dirs.tasks + '/**/*.js',
                    dirs.test + '/**/*.js'
                ],
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
