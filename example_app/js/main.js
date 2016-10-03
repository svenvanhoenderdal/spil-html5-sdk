$(function(){
    SpilSDK('com.spilgames.slot', '0.0.2', function(){
        console.log('sdk ready')
        initgame();
        SpilSDK.onPackagesUpdated(loadPackages)
    }, 'stg')

    $('loadingscreen').show();

    var initgame = function(){
        packages = SpilSDK.getAllPackages();
        for (var key in packages) {
            package = packages[key]
            $('#package_list').append('<li><button onclick="open_payments(' + package.packageId + ')">' + package.packageId + '</button></li>')
        }

    }
    var loadPackages = function(packages)  {
        $('#package_list').empty();
        for (var key in packages) {
            package = packages[key]
            $('#package_list').append('<li><button onclick="open_payments(' + package.packageId + ')">' + package.packageId + '</button></li>')
        }
    }

    var game = new SnakeGame();

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
        SpilSDK.sendCustomEvent(event_name, data)
    }
});