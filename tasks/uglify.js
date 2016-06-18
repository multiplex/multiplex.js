module.exports = function (grunt) {
    var dirs = grunt.config('dirs'),
        files = grunt.config('files'),
        banner = grunt.config('banner');

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
                    [dirs.release + '/' + files.minified]: [dirs.release + '/' + files.main]
                }
            }
        }
    });

    return grunt;
};
