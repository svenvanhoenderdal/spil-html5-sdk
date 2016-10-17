$(function(){

    //$('loadingscreen').show();

    var initgame = function(){
    }
    var loadPackages = function(packages)  {
       $('#package_list').empty();
            for (var key in packages) {
                package = packages[key];
                $('#package_list').append('<li><button onclick="SpilSDK.openPaymentsScreen(' + package.packageId + ')">' + package.packageId + '</button></li>');
            }
    }
    var reloadGameConfig = function(gameConfig) {
       $('#game_config_area').text(JSON.stringify(gameConfig));
    }
    //
    open_payments = function(package_id) {
       console.log('open payments for package: ' + package_id)
       SpilSDK.openPaymentsScreen(package_id)
    }
    send_custom_event = function() {
        try {
            data = JSON.parse($('#custom_event_data').val())
        } catch (Error){
            data = {}
        }
        event_name = $('#custom_event_name').val()
        SpilSDK.sendCustomEvent(event_name, data, function(response) {
            $('#custom_event_result').text(JSON.stringify(response));
        })
    }
    refreshShop = function() {
        $('#ingameshopTabList').empty();
        $('#ingameShopEntriesList').empty();

        shop = SpilSDK.getGameData().getShop()
        for(var i in shop) {
            var tab = shop[i];
            var tabTemplate = $("#ingameshopTabTemplate").clone();
            tabTemplate.removeAttr("id");
            var tabButton = tabTemplate.find('.ingameshopTabButton')
            tabButton.html(tab.getName());
            tabButton.attr('href', tabButton.attr('href').replace('Placeholder', tab.getName()))
            tabTemplate.appendTo("#ingameshopTabList")

            var entriesTemplate = $('#ingameshopTabPlaceholder').clone();
            entriesTemplate.attr('id', entriesTemplate.attr('id').replace('Placeholder', tab.getName()))
            entriesTemplate.appendTo('#ingameShopEntriesList');

            for(var j in tab.getEntries()) {
                var entry = tab.getEntries()[j];
                var entryTemplate = $("#ingameshopEntryTemplate").clone();
                entryTemplate.find('.bundleHolder').html(entry.getBundle().getName());
                entryTemplate.find('.labelHolder').html(entry.getLabel());
                entryTemplate.removeClass('hidden');
                entryTemplate.appendTo(entriesTemplate.find('.ingameshopEntryList'))
            }

            if(i == 0) {
                tabTemplate.addClass('active');
                entriesTemplate.addClass('in active');
            }
            tabTemplate.removeClass('hidden');
        }
    };

    SpilSDK('com.spilgames.slot', '0.0.2', function(){
        console.log('sdk ready');
        SpilSDK.onPackagesUpdated(loadPackages);
        SpilSDK.onConfigUpdated(reloadGameConfig);

        initgame();

        SpilSDK.setPlayerDataCallbacks({
            playerDataError:function(error){
                console.log(error);
            }
        });

        //SpilSDK.getWallet();

    }, 'prd');
});