module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    // clean release directory before publush
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
