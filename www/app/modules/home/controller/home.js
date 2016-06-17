app.controller('HomeCtrl', function ($scope, $timeout, $stateParams, ionicMaterialMotion, ionicMaterialInk, $ionicHistory, $cordovaDevice, DataService) {
    //ionic.material.ink.displayEffect();

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.blinds({
            startVelocity: 3000
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    try {
      $scope.device = $cordovaDevice.getDevice();

    } catch (e) {
      console.log(e);
    } finally {

    }




});
