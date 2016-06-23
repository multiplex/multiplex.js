module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    grunt.config.merge({
        benchmark: {
            all: {
                src: [dirs.benchmark + '/*.js'],
                dest: dirs.benchmark + '/_results.csv',
                options: {
                    format: 'csv'
                }
            }
        }
    });

    return grunt;
};
