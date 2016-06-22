module.exports = function (grunt) {
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
                        [path.join(dirs.release, files.minified)]: [path.join(dirs.release, files.main)]
                    }
                }
            }
        });

    return grunt;
};
