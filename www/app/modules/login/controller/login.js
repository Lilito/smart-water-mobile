app.controller('LoginCtrl', function ($scope, $state, $stateParams, $ionicPlatform, ionicMaterialMotion, ionicMaterialInk, $ionicHistory, $ionicNavBarDelegate, $ionicPopup, AuthService) {
  $scope.credentials = {};

  $ionicHistory.nextViewOptions({
    disableBack: true,
    disableAnimate: false,
    historyRoot: true
  });

  $ionicHistory.clearHistory();

  ionicMaterialInk.displayEffect();

  $ionicPlatform.registerBackButtonAction(function (event) {
          event.preventDefault();
  }, 100);

  $scope.login = function(){
    console.log("login");

    AuthService.login($scope.credentials.username, $scope.credentials.password).then(function(authenticated) {
      $state.go('app.home', {}, {reload: true});
      $scope.setCurrentUsername($scope.credentials.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });

  };


});
