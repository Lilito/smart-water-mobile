angular.module('starter')

.service('DataService',function($state, $http, $log, $q, $cordovaDialogs, $cordovaPush, $cordovaDevice ){

		var app = {
			path: "http://smart-water.mybluemix.net"
			//path: "http://172.20.10.3:3000"
		};


				var getAllValves= function(){
					return $q(function(resolve, reject) {
						$http.get(app.path +'/api/valves/').success(function(data, status, headers, config) {
								resolve(data);
						}).error(function(data, status, headers, config) {
							reject( data);
						});

					});
				};

			var setStatusValve = function(value){

					//subscribe device
					var post= {
									  "deviceId": "f61e1e059ae75ffa1c2a2715a113beee1ae90153",
									  "tagName": "SampleTag"
									};

					$http.post(app.path +'/api/subscriptions/', post).success(function(data,status,headers,config){
						deferred.resolve(data);
					}).error(function(err,status,headers, config){
						deferred.reject(err);
					});
					return deferred.promise;
				};


		var currentUser = {};


		return {
			getAllValves: getAllValves,
			setStatusValve: setStatusValve
		};
});
