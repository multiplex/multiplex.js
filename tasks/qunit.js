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
    function testrunner() {
        qrunner.run({
            code: path.join(dirs.build, files.main),
            tests: grunt.file.expand(dirs.build + '/test/*.js')
        }, function (err, report) {
            if (err) {
                console.log('Oops', err, report);
                throw err;
            }
            if (report.failed !== 0) {
                throw new Error(report.failed + ' tests failed');
            }
        });
    }


    grunt.task.registerTask('qtest', 'run all unit tests', function () {
        var done = this.async();

        Promise.resolve(null)
            .then(function () {
                testrunner();
            })
            .then(done, function (e) {
                grunt.log.error('error running tests', e);
                done(e);
            });
    });
};

