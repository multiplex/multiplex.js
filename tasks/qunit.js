module.exports = function (grunt) {
    'use strict';

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

        qrunner.run({
            code: { path: path.join(dirs.build, files.main), namespace: 'mx' },
            tests: [path.join(dirs.build, dirs.test, files.testrunner)]
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
