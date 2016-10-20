$(function(){

    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = this.hash;
        $('html,body').scrollTop(scrollmem);
    });

    var initgame = function(){}

    var loadPackages = function()  {
        var packages = SpilSDK.getAllPackages();
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
    var send_custom_event = function() {
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
    var refreshShop = function() {
        $('#ingameshopTabList').empty();
        $('#ingameShopEntriesList').empty();

        var tabs = SpilSDK.getGameData().getShop().getTabs();
        for(var i in tabs) {
            var tab = tabs[i];
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
                entryTemplate.removeAttr("id");
                entryTemplate.find('.bundleHolder').html(entry.getBundle().getName());
                entryTemplate.find('.labelHolder').html(entry.getLabel());
                for (var k = 0; k < entry.getBundle().getPrices().length; k++) {
                    var price = entry.getBundle().getPrices()[k];
                    entryTemplate.find('.priceHolder').append(price.getValue() + ' ' + price.getCurrency().getName() + '<br>');
                }

                for (var k = 0; k < entry.getBundle().getItems().length; k++) {
                    var item = entry.getBundle().getItems()[k];
                    entryTemplate.find('.itemHolder').append(item.getAmount() + ' ' + item.getItem().getName() + '<br>');
                }
                entryTemplate.find('.buttonHolder').attr('onclick', "SpilSDK.consumeBundle(" + entry.getBundleId() + ", \"Item Bought\", true)")


                var promotion = entry.getPromotion();
                if (promotion) {
                    entryTemplate.find('.priceHolder').css('text-decoration', 'line-through');
                    for (var l = 0; l < promotion.getPrices().length; l++) {
                        var price = promotion.getPrices()[l];
                        entryTemplate.find('.promotionPriceHolder').append(price.getValue() + ' ' + price.getCurrency().getName() + '<br>');
                    }
                    entryTemplate.find('.itemHolder').css('text-decoration', 'line-through');
                    for (var k = 0; k < promotion.getBundle().getItems().length; k++) {
                        var item = entry.getBundle().getItems()[k];
                        entryTemplate.find('.promotionItemHolder').append((item.getAmount() * promotion.getAmount()) + ' ' + item.getItem().getName() + '<br>');
                    }
                }


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
        var value = valueField.val();
        if (value > 0) {
            SpilSDK.addItemToInventory(parseInt($(this).data('id')), value,'Level Complete');
        } else if (value < 0) {
            SpilSDK.subtractItemFromInventory(parseInt($(this).data('id')), -value,'Powerup used');
        }
    });

    $('#inventoryAddButton').click(function(){
        SpilSDK.addItemToInventory(parseInt($('#inventoryAddList').find(":selected").val()), 1, 'Item Pickup');
    });

    var inventoryItemPanelTemplate = doT.template(''+
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

    function refreshInventory() {
        var items = SpilSDK.getInventory().getItems();
        $('#inventoryAccordion').html('');

        for(var i=0;i<items.length;i++){
            var item = items[i];
            $('#inventoryAccordion').append(inventoryItemPanelTemplate({
                name:item.getName(),
                amount:item.getAmount(),
                id:i,
                itemId:item.id
            }))
        }
        items = SpilSDK.getGameData().getItems();
        for (var i = 0; i< items.length; i++) {
            var item = items[i];
            $('#inventoryAddList').append($("<option></option>").attr("value",item.getId()).text(item.getName()));
        }
    }


    var walletCurrencyPanelTemplate = doT.template(''+
        '<div class="panel panel-default currencyPanel{{=it.currencyId}}">'+
        '<div class="panel-heading" role="tab" id="panel_{{=it.id}}">'+
        '<div class="panel-title" style="font-size:12px">'+
        '<a role="button" data-toggle="collapse" href="#body_{{=it.id}}">{{=it.name}}} (id:{{=it.currencyId}})</a>'+
        '<span class="badge pull-right" >{{=it.currentBalance}}</span>'+
        '</div>'+
        '</div>'+
        '<div id="body_{{=it.id}}" class="panel-collapse collapse">'+
        '<div class="panel-body">' +
        '<div class="btn btn-primary decrement">-</div>' +
        '<input type="amount" class="inputfield" value="1">'+
        '<div class="btn btn-primary increment">+</div>' +
        '<div class="btn btn-primary saveWallet" data-id="{{=it.currencyId}}" >save</div>' +
        '<div class="statusImage hidden glyphicon glyphicon-ok" style="width:40px;"></div>' +
        '</div>'+
        '</div>'+
        '</div>');

    $('#WalletAccordion').on('click','.decrement',function(){

        var valueField = $(this).parent().find('.inputfield');

        $(valueField).val(parseInt(valueField.val())-1);
    });

    $('#WalletAccordion').on('click','.increment',function(){

        var valueField = $(this).parent().find('.inputfield');

        $(valueField).val(parseInt(valueField.val())+1);
    });

    $('#WalletAccordion').on('click','.saveWallet',function(){
        var valueField = $(this).parent().find('.inputfield');
        var value = valueField.val();
        if (value > 0) {
            SpilSDK.addCurrencyToWallet(parseInt($(this).data('id')), value,'Level Complete');
        } else if (value < 0) {
            SpilSDK.subtractCurrencyFromWallet(parseInt($(this).data('id')), -value,'Player Dies');
        }
    });

    function refreshWallet() {
        var currencies = SpilSDK.getWallet().currencies;
        $('#WalletAccordion').html('');

        for(var i=0;i<currencies.length;i++){
            var currency = currencies[i];

            $('#WalletAccordion').append(walletCurrencyPanelTemplate({
                name:currency.name,
                currentBalance:currency.currentBalance,
                id:i,
                currencyId:currency.id
            }))
        }
    }

    $('#refreshWalletButton').click(function(){
        refreshWallet();
    });

    $('#refreshInventoryButton').click(function(){
        refreshInventory();
    });

    $('#custom_evend_send').click(function(){
        send_custom_event();
    });

    $('#game_config_refresh').click(function(){
        SpilSDK.refreshConfig();
    });

    $('#requestPackages').click(function(){
        SpilSDK.requestPackages();
    });

    $('#loadPackages').click(function(){
        loadPackages();
    });

    $('#ingameshopButton').click(function(){
        refreshShop();
    });


    SpilSDK('com.spilgames.slot', '0.0.2', function(){
        console.log('sdk ready');
        initgame();
    }, 'stg');

    SpilSDK.setConfigDataCallbacks({
        configDataUpdated: reloadGameConfig
    });

    SpilSDK.setPlayerDataCallbacks({
        playerDataError:function(error){
            console.log(error);

        },
        playerDataUpdated:function(reason, updatedData){
            var currencies = updatedData.currencies;
            for (var i = 0; i < currencies.length; i++) {
                var currency = currencies[i];
                var panel = $('.currencyPanel'+currency.id);
                if (panel.length) {
                    var image = panel.find('.statusImage')[0];

                    image.classList.remove('hidden');

                    panel.find('.badge').html(currency.currentBalance);
                } else {
                    $('#walletAccordion').append(walletCurrencyPanelTemplate({
                        name:currency.getName(),
                        currentBalance:currency.getCurrentBalance(),
                        id:0,
                        currencyId:currency.getId()
                    }));
                }
            }

            var items = updatedData.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var panel = $('.inventoryPanel' + item.id);
                if (panel.length) {
                    var image = panel.find('.statusImage')[0];
                    image.classList.remove('hidden');
                    panel.find('.badge').html(item.amount);
                } else {
                    $('#inventoryAccordion').append(inventoryItemPanelTemplate({
                        name:item.getName(),
                        amount:item.getAmount(),
                        id:0,
                        itemId:item.getId()
                    }));
                }

            }
        },
        playerDataAvailable: function() {
            refreshWallet();
            refreshInventory();
        }
    });

    SpilSDK.setGameDataCallbacks({
        gameDataError: function (error) {
            console.log(error)
        },
        gameDataAvailable: function() {
            refreshShop();
        }
    })
});