module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        dirs = {
            test: 'test',
            source: 'src',
            release: 'dist',
            tasks: 'tasks',
            temp: 'dist/temp'
        },
        banner = [
            '/*!',
            '* ' + pkg.title + ' - ' + pkg.description,
            '* Ver ' + pkg.version + ' (' + grunt.template.today('mmmm dd, yyyy') + ')',
            '',
            '* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>',
            '* Licensed under Apache License Version 2.0',
            '* ' + pkg.homepage,
            '*/',
            ''
        ].join('\n');


    grunt.initConfig({
        pkg: pkg,
        dirs: dirs,
        banner: banner,
        clean: {
            build: {
                src: [dirs.release + '/*.*']
            },
            options: {
                force: true
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: dirs.source,
                        dest: dirs.release,
                        src: ['**/*.{intellisense.js,d.ts}'],
                        filter: 'isFile'
                    }
                ],
                options: {
                    process: function (content) {
                        return banner + '\n' + content;
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'Gruntfile.js',
                    dirs.source + '/**/*.js',
                    dirs.tasks + '/**/*.js',
                    dirs.test + '/**/*.js'
                ],
                tasks: ['lint'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },
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
        },
        jscs: {
            all: [
                'Gruntfile.js',
                dirs.source + '/**/*.js',
                dirs.tasks + '/**/*.js',
                dirs.test + '/**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                screwIE8: true,
                preserveComments: false,
                banner: banner,
                report: 'min',
                mangle: {
                    sort: true,
                    eval: true,
                    except: [
                        'mx',
                        'multiplex',
                        'Enumerable',
                        'Enumerator',
                        'Collection',
                        'ReadOnlyCollection',
                        'List',
                        'SortedList',
                        'Dictionary',
                        'KeyValuePair',
                        'HashSet',
                        'HashTable',
                        'LinkedList',
                        'LinkedListNode',
                        'Queue',
                        'Stack',
                        'Lookup',
                        'Grouping',
                        'OrderedEnumerable',
                        'Comparer',
                        'EqualityComparer'
                    ]
                }
            },
            dist: {
                files: {
                    '<%= dirs.release %>/multiplex.min.js': [dirs.release + '/multiplex.js']
                }
            }
        },
        qunit: {
            all: [dirs.test + '/mx.html']
        }
    });


    grunt.loadTasks(dirs.tasks);

    require('load-grunt-tasks')(grunt);


    // linting
    grunt.registerTask('lint', ['jshint', 'jscs']);

    // test tasks
    grunt.registerTask('test', ['transpile', 'qunit']);

    // default task
    grunt.registerTask('default', ['lint', 'test']);

    // releasing a new version
    grunt.registerTask('release', [
        'clean',
        'default',
        'copy',
        'uglify'
    ]);
};
