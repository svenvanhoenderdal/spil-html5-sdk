module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jscs');

    var sources = ['src/**/*.js'];

    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                expr: true,
                camelcase: true
            },
            source: sources
        },
        jscs: {
            src: sources,
            options: {
                preset: "crockford", // see: https://github.com/jscs-dev/node-jscs/blob/master/presets/crockford.json
                fix: true, // Autofix code style violations when possible.

                /*
                 * overrides of preset
                 * information on available rules and effects: http://jscs.info/rules
                 */
                 "disallowKeywords": [
                    "with"
                ],
                requireVarDeclFirst: false,
                requireMultipleVarDecl: {allExcept: ['require']},
                requireCamelCaseOrUpperCaseIdentifiers: true,
                disallowDanglingUnderscores: false,
                validateQuoteMarks: "\"",
                validateParameterSeparator: ", ",
                maximumLineLength: 120
            }
        },
        watch: {
            files: sources,
            tasks: ['default']
        },
        browserify: {
            main: {
                src: 'src/SpilSDK.js',
                dest: 'dist/spil-sdk.js'
            }
        }
    });

    grunt.registerTask('lint', 'jshint:source');
    grunt.registerTask('style', ['jshint:source', 'jscs']);
    grunt.registerTask('default', ['browserify', 'watch']);
};
