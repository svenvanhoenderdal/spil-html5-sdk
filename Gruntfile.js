module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var source_files = [
            "src/Event.js",
            "src/Package.js",
            "src/Payments.js",
            "src/SpilSDK.js",
            "src/Statics.js",
            "src/Wallet.js"
        ];

    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                expr: true
            },
            source: ['src/*.js', 'Gruntfile.js']
        },

        concat: {
            options: {
                process: function(src, filepath) {
                    src = '\n// --- Source: ' + filepath.replace('src/', '') + ' ---\n' + src;
                    return src;
                }
            },
            build: {
                src: source_files,
                dest: 'dist/spil-sdk.js'
            }
        },

        uglify: {
            options: {
                compress: true
            },
            build: {
                files: {
                    'dist/spil-sdk.min.js': ['dist/spil-sdk.js']
                }
            }
        },

        watch: {
            minify: {
                files: ['src/*.js'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('lint', 'jshint:source');
    grunt.registerTask('build', ['lint', 'minify']);
    grunt.registerTask('minify', ['concat:build', 'uglify:build']);
    grunt.registerTask('mw', 'watch:minify');
    grunt.registerTask('default', 'build');
};
