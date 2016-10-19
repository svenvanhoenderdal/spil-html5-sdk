$(function(){

    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = this.hash;
        $('html,body').scrollTop(scrollmem);
    });

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
    var reloadGameConfig = function() {
        var gameConfig = SpilSDK.getConfigAll()
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
                entryTemplate.find('.buttonHolder').attr('onclick', "SpilSDK.consumeBundle(" + entry.getBundleId() + ", \"Item Bought\")")
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

    $('#getcurrencies').click(function(){

        var currencies = SpilSDK.getWallet().currencies;



        var tempFn = doT.template(''+
            '<div class="panel panel-default currency_panel_{{=it.currencyId}}">'+
            '<div class="panel-heading" role="tab" id="panel_{{=it.id}}">'+
            '<div class="panel-title" style="font-size:12px">'+
            '<a role="button" data-toggle="collapse" href="#body_{{=it.id}}">{{=it.name}}} (id:{{=it.currencyId}})</a>'+
            '<span class="badge pull-right" >{{=it.currentBalance}}</span>'+
            '</div>'+
            '</div>'+
            '<div id="body_{{=it.id}}" class="panel-collapse collapse">'+
            '<div class="panel-body">' +
            '<span>{{=it.currentBalance}}</span>' +
            '<div class="btn btn-primary decrement">-</div>' +
            '<input type="amount" class="inputfield" value="1">'+
            '<div class="btn btn-primary increment">+</div>' +
            '<div class="btn btn-primary savewallet" data-id="{{=it.currencyId}}" >save</div>' +
            '<div class="status_image hidden glyphicon glyphicon-ok" style="width:40px;"></div>' +
            '</div>'+
            '</div>'+
            '</div>');

        $('#accordion').on('click','.decrement',function(){

            var valueField = $(this).parent().find('.inputfield');

            $(valueField).val(parseInt(valueField.val())-1);
        });

        $('#accordion').on('click','.increment',function(){

            var valueField = $(this).parent().find('.inputfield');

            $(valueField).val(parseInt(valueField.val())+1);
        });

        $('#accordion').on('click','.savewallet',function(){
            var valueField = $(this).parent().find('.inputfield');
            //currencyId, delta, reason
            SpilSDK.addCurrencyToWallet(parseInt($(this).data('id')),valueField.val(),'ItemBought');
        });

        $('#accordion').html('');

        for(var i=0;i<currencies.length;i++){
            var currency = currencies[i];

            $('#accordion').append(tempFn({
                name:currency.name,
                currentBalance:currency.currentBalance,
                id:i,
                currencyId:currency.id
            }))

        }
    });

    $('#refreshInventoryButton').click(function(){

        var items = SpilSDK.getInventory().getItems();



        var tempFn = doT.template(''+
            '<div class="panel panel-default inventoryPanel{{=it.itemId}}">'+
                '<div class="panel-heading" role="tab" id="panel_{{=it.id}}">'+
                    '<div class="panel-title" style="font-size:12px">'+
                        '<a role="button" data-toggle="collapse" href="#inventoryBody{{=it.id}}">{{=it.name}} (id:{{=it.itemId}})</a>'+
                        '<span class="badge pull-right" >{{=it.amount}}</span>'+
                    '</div>'+
                '</div>'+
                '<div id="inventoryBody{{=it.id}}" class="panel-collapse collapse">'+
                    '<div class="panel-body">' +
                        '<div class="btn btn-primary decrement">-</div>' +
                        '<input type="amount" class="inputfield" value="1">'+
                        '<div class="btn btn-primary increment">+</div>' +
                        '<div class="btn btn-primary saveInventory" data-id="{{=it.itemId}}" >save</div>' +
                        '<div class="statusImage hidden glyphicon glyphicon-ok" style="width:40px;"></div>' +
                    '</div>'+
                '</div>'+
            '</div>');

        $('#inventoryAccordion').on('click','.decrement',function(){

            var valueField = $(this).parent().find('.inputfield');

            $(valueField).val(parseInt(valueField.val())-1);
        });

        $('#inventoryAccordion').on('click','.increment',function(){

            var valueField = $(this).parent().find('.inputfield');

            $(valueField).val(parseInt(valueField.val())+1);
        });

        $('#inventoryAccordion').on('click','.saveInventory',function(){
            var valueField = $(this).parent().find('.inputfield');
            //currencyId, delta, reason
            // SpilSDK.addCurrencyToWallet(parseInt($(this).data('id')),valueField.val(),'ItemBought');
        });

        $('#inventoryAccordion').html('');

        for(var i=0;i<items.length;i++){
            var item = items[i];

            $('#inventoryAccordion').append(tempFn({
                name:item.getName(),
                amount:item.getAmount(),
                id:i,
                itemId:item.id
            }))

        }


    });


    SpilSDK('com.spilgames.slot', '0.0.2', function(){
        console.log('sdk ready');
        SpilSDK.onPackagesUpdated(loadPackages);
        SpilSDK.setConfigDataCallbacks({
            configDataUpdated: reloadGameConfig
        });

        initgame();

        SpilSDK.setPlayerDataCallbacks({
            playerDataError:function(error){
                console.log(error);

            },
            playerDataUpdated:function(reason, updatedData){
                var currencies = updatedData.currencies;

                for(var i=0;i<currencies.length;i++){
                    var currency = currencies[i];
                    var panel = $('.currency_panel_'+currency.id);
                    var image = panel.find('.status_image')[0];

                    image.classList.remove('hidden');

                    panel.find('.badge').html(currency.currentBalance);
                }
                var items = updatedData.items;

                for(var i=0;i<items.length;i++){
                    var item = items[i];
                    var panel = $('.inventoryPanel' + item.id);
                    var image = panel.find('.statusImage')[0];

                    image.classList.remove('hidden');

                    panel.find('.badge').html(item.amount);
                }
            }
        });
    }, 'stg');
});