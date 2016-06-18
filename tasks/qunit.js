module.exports = function (grunt) {
    var dirs = grunt.config('dirs');

    grunt.config.merge({
        qunit: {
            all: [dirs.test + '/mx.html']
        }
    });

    return grunt;
};
