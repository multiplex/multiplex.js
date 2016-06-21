module.exports = function (grunt) {
    'use strict';

    const dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        qrunner = require('qunit'),
        path = require('path'),
        fs = require('fs'),
        es5source = path.join(dirs.testbuild, files.main),
        es6source = path.join(dirs.testbuild, files.es6),
        testrunner = path.join(dirs.test, files.testrunner),
        units = grunt.file.expand(dirs.testunit + '/*.js');

    qrunner.options.log.assertions = false;
    qrunner.options.log.tests = false;
    qrunner.options.log.summary = false;
    qrunner.options.log.testing = false;
    qrunner.options.maxBlockDuration = 120000;

    fs.writeFileSync(testrunner, 'require([' + units.map(t => '\n\'' + t.replace(dirs.test, '.') + '\'') + '\n]);\n');

    function testrunnerFactory(code) {
        return function () {
            let done = this.async();

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
        };
    }

    grunt.task.registerTask('qtest-es5', 'run all es5 unit tests', testrunnerFactory(es5source));
    grunt.task.registerTask('qtest-es6', 'run all es6 unit tests', testrunnerFactory(es6source));

    grunt.task.registerTask('qtest', 'run all unit tests', function () {
        let tasks = [
            'qtest-es5',
            'qtest-es6'
        ];

        grunt.task.run(tasks);
    });
};

