module.exports = function (grunt) {
    'use strict';

    var path = require('path'),
        dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner'),
        minfiles = {};

    minfiles[path.join(dirs.build, files.minified)] = [path.join(dirs.build, files.main)];

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
                        'ArrayIterable',
                        'ArrayIterator',
                        'ObjectIterable',
                        'ObjectIterator',
                        'EmptyIterable',
                        'EmptyIterator',
                        'IterableIterator',
                        'EnumerableIterator',
                        'Collection',
                        'ReadOnlyCollection',
                        'List',
                        'SortedList',
                        'Dictionary',
                        'KeyValueIterator',
                        'KeyValuePair',
                        'HashSet',
                        'HashSetIterator',
                        'HashTable',
                        'HashTableIterator',
                        'LinkedList',
                        'LinkedListNode',
                        'Map',
                        'MapIterator',
                        'Set',
                        'SetIterator',
                        'Queue',
                        'Stack',
                        'Lookup',
                        'LookupTable',
                        'LookupTableIterator',
                        'Grouping',
                        'OrderedIterable',
                        'Comparer',
                        'EqualityComparer'
                    ]
                }
            },
            dist: {
                files: minfiles
            }
        }
    });

    return grunt;
};
