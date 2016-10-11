$(function(){
    SpilSDK('com.spilgames.slot', '0.0.2', function(){
        console.log('sdk ready');
        console.log(SpilSDK)

        //SpilSDK.a();

        SpilSDK.onPackagesUpdated(function(packages){
            $('#package_list').empty();
            for (var key in packages) {
                package = packages[key];
                $('#package_list').append('<li><button onclick="SpilSDK.openPaymentsScreen(' + package.packageId + ')">' + package.packageId + '</button></li>');
            }
        });

        SpilSDK.requestPackages();

        //console.log(SpilSDK);

        //initgame();
        //SpilSDK.onPackagesUpdated(loadPackages);
        //SpilSDK.onConfigUpdated(reloadGameConfig);
    }, 'stg');


    //$('loadingscreen').show();

    //var initgame = function(){
    //    packages = SpilSDK.getAllPackages();
    //    for (var key in packages) {
    //        package = packages[key]
    //        $('#package_list').append('<li><button onclick="open_payments(' + package.packageId + ')">' + package.packageId + '</button></li>')
    //    }
    //
    //}
    //var loadPackages = function(packages)  {
    //    $('#package_list').empty();
    //    for (var key in packages) {
    //        package = packages[key]
    //        $('#package_list').append('<li><button onclick="open_payments(' + package.packageId + ')">' + package.packageId + '</button></li>')
    //    }
    //}
    //var reloadGameConfig = function(gameConfig) {
    //    $('#game_config_area').text(JSON.stringify(gameConfig));
    //}
    //
    //open_payments = function(package_id) {
    //    console.log('open payments for package: ' + package_id)
    //    SpilSDK.openPaymentsScreen(package_id)
    //}
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
});