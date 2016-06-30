module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    grunt.config.merge({
        jscs: {
            all: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        }
    });

    return grunt;
};
