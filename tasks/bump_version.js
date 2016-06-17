module.exports = function (grunt) {
    var pkg = grunt.config.get('pkg');
    var banner = grunt.config.get('banner');

    grunt.registerTask('bump_version', function (version) {
        if (version === undefined) {
            var parts = pkg.version.split('.');
            parts[2]++;
            version = parts.join('.');
        }
        else if (!version || version.split('.').length !== 3) {
            grunt.fail.fatal('malformed version. Use\n\n    grunt bump_version:1.2.3');
        }

        banner = banner.replace(/(Version )(\d*\.\d*\.\d*)/gi, '$1' + version);
        pkg.version = version;

        grunt.config.set('pkg', pkg);
        grunt.config.get('banner', banner);
    });
};
