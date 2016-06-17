﻿app.controller('MapCtrl', function ($scope, DataService) {

  function loadValves(){
    var myloc = new google.maps.LatLng(20.3001358,-103.1895831);
    var mapOptions = {
        zoom: 15,
        center: myloc,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    var red = new google.maps.MarkerImage('img/manage_32_red.png',
      new google.maps.Size(50, 50),
      new google.maps.Point(0,0),
      new google.maps.Point(12, 16));

      var green = new google.maps.MarkerImage('img/manage_32_green.png',
        new google.maps.Size(50, 50),
        new google.maps.Point(0,0),
        new google.maps.Point(12, 16));

        var closed = new google.maps.MarkerImage('img/manage_32.png',
          new google.maps.Size(50, 50),
          new google.maps.Point(0,0),
          new google.maps.Point(12, 16));



  DataService.getAllValves().then(function(data) {
     $scope.valvesList = data.body.rows;

     $scope.valvesList.forEach(function(valve){
       var icon;
       if(valve.doc.active){
         icon=green;
       }
       if(!valve.doc.active){
         icon=closed;
       }
       if(valve.doc.issued){
         icon=red;
       }

        var marker = new google.maps.Marker({
           position: new google.maps.LatLng(valve.doc.latitude, valve.doc.longitude),
           map: $scope.map,
           icon: icon
       });

       var contentString = '<div id="content" style="dir:rtl; text-align:right;">'+
               valve.doc.deviceId+
               '</div>';
       var infowindow = new google.maps.InfoWindow({
           content: contentString,
           maxWidth: 250
       });

       google.maps.event.addListener(marker, 'click', function() {
           infowindow.open($scope.map,marker);
       });


     });


   }, function(err) {
     $scope.spinner.usersList = false;
   });
  }

  loadValves();


});
