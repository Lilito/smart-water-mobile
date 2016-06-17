app.controller('ValvesCtrl', function ($scope, DataService) {
  DataService.getAllValves().then(function(data) {
    $scope.data=data.body.rows;
  }, function(err) {
    $scope.data=err;
  });

});
