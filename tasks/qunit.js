module.exports = function (grunt) {
    grunt.task.registerTask('qtest', 'run all unit tests', function () {
        var done = this.async(),
            dirs = grunt.config('dirs'),
            files = grunt.config('files'),
            qrunner = require('qunit'),
            path = require('path');


        // configure qrunner
        qrunner.options.log.assertions = false;
        qrunner.options.log.tests = false;
        qrunner.options.log.summary = false;
        qrunner.options.log.testing = false;
        qrunner.options.maxBlockDuration = 120000;

        console.log(grunt.file.read(grunt.file.expand(dirs.build + '/test/**/*.js')[0]));

        qrunner.run({
            code: path.join(dirs.build, files.main),
            tests: grunt.file.expand(dirs.build + '/test/**/*.js')
        }, function (err, report) {
            if (err) {
                console.log('Oops', err, report);
                done(err);
                return;
            }

            if (report.failed !== 0) {
                err = new Error(report.failed + ' tests failed');
            }
            done(err);
        });
    });
};
