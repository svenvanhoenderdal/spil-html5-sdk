module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');

    var source_files = [
            "src/SpilSDK.js",
            "src/core_modules/CallbackQueue.js",
            "src/core_modules/Config.js",
            "src/core_modules/Events.js",
            "src/core_modules/ScriptLoader.js",
            "src/core_modules/Utils.js",
            "src/models/gameData/BundleItemModel.js",
            "src/models/gameData/BundleModel.js",
            "src/models/gameData/BundlePriceModel.js",
            "src/models/gameData/CurrencyModel.js",
            "src/models/gameData/EntryModel.js",
            "src/models/gameData/GameDataModel.js",
            "src/models/gameData/ItemModel.js",
            "src/models/gameData/PromotionModel.js",
            "src/models/gameData/TabModel.js",
            "src/models/playerData/InventoryModel.js",
            "src/models/playerData/PlayerCurrencyModel.js",
            "src/models/playerData/PlayerItemModel.js",
            "src/models/playerData/UserProfileModel.js",
            "src/models/playerData/WalletModel.js",
            "src/modules/Config.js",
            "src/modules/Event.js",
            "src/modules/GameData.js",
            "src/modules/Package.js",
            "src/modules/Payments.js",
            "src/modules/PlayerData.js"
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

        //concat: {
        //    options: {
        //        process: function(src, filepath) {
        //            src = '\n// --- Source: ' + filepath.replace('src/', '') + ' ---\n' + src;
        //            return src;
        //        }
        //    },
        //    build: {
        //        src: source_files,
        //        dest: 'dist/spil-sdk.js'
        //    }
        //},

        //uglify: {
        //    options: {
        //        compress: true
        //    },
        //    build: {
        //        files: {
        //            'dist/spil-sdk.min.js': ['dist/spil-sdk.js']
        //        }
        //    }
        //},

        watch: {
            files: ['src/*.js', 'src/*/*.js', 'src/*/*/*.js'],
            tasks: ['default']
            //minify: {
            //    files: ['src/*.js', 'src/models/*.js'],
            //    tasks: ['minify'],
            //    options: {
            //        livereload: true
            //    }
            //}
        },
        browserify: {
            main: {
                src: 'src/SpilSDK.js',
                dest: 'dist/spil-sdk.js'
            }
        }
    });

    //grunt.registerTask('lint', 'jshint:source');
    //grunt.registerTask('build', ['lint', 'minify']);
    //grunt.registerTask('minify', ['concat:build', 'uglify:build']);
    //grunt.registerTask('mw', 'watch:minify');
    grunt.registerTask('default', ['browserify', 'watch']);
};
