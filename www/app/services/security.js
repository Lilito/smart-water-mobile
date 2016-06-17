
angular.module('starter')

.service('AuthService', function($q, $http, USER_ROLES) {
  var app = {
    path: "http://smart-water.mybluemix.net"
    //path: "http://172.20.10.3:3000"
  };

  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var NAME = 'yourNAME';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var name='';
  var isApproved=false;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    var employee = window.localStorage.getItem(NAME);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(data) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, data);
    window.localStorage.setItem(NAME, data.name);
    useCredentials(data);
  }

  function useCredentials(data) {
    username = data.user;
    userAccess = data.role;
    isAuthenticated = true;
    authToken = data;
    name=data.name;

    if (userAccess == 'Administrator') {
      role = USER_ROLES.admin;
    }
    if (userAccess === undefined) {
      role='';
    }


    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = data;
  }


  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(username, password) {
    return $q(function(resolve, reject) {

      var post= {
        username: username,
        password: password
      };

      $http.post(app.path+'/api/auth/login', post).success(function(data, status, headers, config) {

        if(data && data.hasAccess){
          storeUserCredentials(data);
          resolve('Login success.');
        }
        else {
          reject('Acces Denied: Wrong username or password.');
        }

      }).error(function(data, status, headers, config) {
        reject( data);
      });

    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
