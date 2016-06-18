module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    grunt.config.merge({
        jshint: {
            files: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js',
                dirs.test + '/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    return grunt;
};
