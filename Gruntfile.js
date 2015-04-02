module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            test: 'test',
            source: 'src',
            release: 'build'
        },
        clean: {
            build: {
                src: ['<%= dirs.release %>']
            }
        },
        copy: {
            main: {
                files: [
                  { expand: true, flatten: true, cwd: '<%= dirs.source %>/', src: ['**/*.{js,d.ts}'], dest: '<%= dirs.release %>/', filter: 'isFile' }
                ],
            },
        },
        jshint: {
            files: ['Gruntfile.js', '<%= dirs.source %>/**/*.js', '<%= dirs.test %>/**/*.js'],
            options: {
                boss: true,
                browser: true,
                curly: true,
                eqeqeq: false,
                eqnull: true,
                evil: true,
                newcap: false,
                noarg: true,
                nocomma: true,
                notypeof: true,
                shadow: true,
                proto: false,
                undef: true,
                unused: true,
                globals: {
                    'window': true,
                    'define': true,
                    'module': true,
                    'intellisense': true,
                    'mx': true
                },
            }
        },
        watch: {
            scripts: {
                files: ['<%= dirs.source %>/**/*.{js,ts}'],
                tasks: ['default'],
                options: {
                    spawn: false,
                    interrupt: true,
                },
            },
        },
        uglify: {
            options: {
                sourceMap: true,
                screwIE8: true,
                preserveComments: false,
                report: "min",
                sourceMapName: '<%= dirs.release %>/<%= pkg.name %>.map',
                banner:
                    [
                        '/*--------------------------------------------------------------------------',
                        '',
                        '* <%= pkg.title %> - <%= pkg.description %>',
                        '* Ver <%= pkg.version %> (<%= grunt.template.today("mmmm dd, yyyy") %>)',
                        '',
                        '* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>',
                        '* Licensed under Apache License Version 2.0',
                        '* https://github.com/multiplex/multiplex.js',
                        '',
                        '*--------------------------------------------------------------------------*/',
                        ''
                    ].join('\n'),
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
                    '<%= dirs.release %>/<%= pkg.name %>.min.js': ['<%= dirs.source %>/javascript/multiplex.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['jshint']);
    grunt.registerTask('default', ['clean', 'copy', 'jshint', 'uglify']);
};