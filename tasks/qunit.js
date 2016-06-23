module.exports = function (grunt) {
    var dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        qrunner = require('qunit'),
        path = require('path');


    // configure qrunner
    qrunner.options.log.assertions = false;
    qrunner.options.log.tests = false;
    qrunner.options.log.summary = false;
    qrunner.options.log.testing = false;
    qrunner.options.maxBlockDuration = 120000;


    // testrunner function to run tests
    function testrunner(task, code) {
        var done = task.async();

        qrunner.run({
            code: code,
            tests: grunt.file.expand(dirs.test + '/unit/*.js')
        }, function (err, report) {
            if (err) {
                console.log('Oops', err, report);
                done(err);
                return;
            }
            err = null;
            if (report.failed !== 0) {
                err = new Error(report.failed + ' tests failed');
            }
            done(err);
        });
    }


    grunt.task.registerTask('qtest', 'run all unit tests', function () {
        testrunner(this, path.join(dirs.testbuild, files.main));
        testrunner(this, path.join(dirs.testbuild, files.es6));
    });
};

