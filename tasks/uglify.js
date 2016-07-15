module.exports = function (grunt) {
    'use strict';

    var path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

    // minify es5 publish source (es6 minification is not supported)
    // include "banner" in the beginning
    grunt.config.merge({
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
                        'Iterable',
                        'Iterator',
                        'Collection',
                        'ReadOnlyCollection',
                        'List',
                        'SortedList',
                        'Dictionary',
                        'KeyValuePair',
                        'HashSet',
                        'HashTable',
                        'HashTableEntry',
                        'LinkedList',
                        'LinkedListNode',
                        'Queue',
                        'Stack',
                        'Lookup',
                        'Grouping',
                        'OrderedIterable',
                        'Comparer',
                        'EqualityComparer'
                    ]
                }
            },
            dist: {
                files: {
                    [path.join(dirs.build, files.minified)]: [path.join(dirs.build, files.main)]
                }
            }
        }
    });

    return grunt;
};
