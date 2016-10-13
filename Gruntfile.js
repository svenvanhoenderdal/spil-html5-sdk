module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jscs');

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
    var sources = ['src/*.js', 'src/*/*.js', 'src/*/*/*.js'];

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
            source: ['src/*.js','src/*/*.js','src/*/*/*.js']
        },
        jscs: {
            src: ['src/*.js','src/*/*.js','src/*/*/*.js'],
            options: {
                preset: "crockford", // see: https://github.com/jscs-dev/node-jscs/blob/master/presets/crockford.json
                fix: true, // Autofix code style violations when possible.

                /*
                 * overrides of preset
                 * information on available rules and effects: http://jscs.info/rules
                 */
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
            files: ['src/*.js','src/*/*.js','src/*/*/*.js'],
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
    grunt.registerTask('default', ['jshint:source', 'jscs', 'browserify', 'watch']);
};
