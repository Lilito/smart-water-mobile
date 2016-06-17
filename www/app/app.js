var app = angular.module('starter', [
  'ionic',
  'ionic-material',
  'ionMdInput',
  "ngCordova"
]);

app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
});

app.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/modules/common/view/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'app/modules/home/view/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.valves', {
        url: '/valves',
        views: {
            'menuContent': {
                templateUrl: 'app/modules/valves/view/valves.html',
                controller: 'ValvesCtrl'
            }
        },
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'app/modules/about/view/about.html',
                controller: 'AboutCtrl'
            }
        },
    })

    .state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'app/modules/map/view/map.html',
                controller: 'MapCtrl'
            }
        },
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'app/modules/login/view/login.html',
                controller: 'LoginCtrl'
            }
        }
    })
    ;

    //$urlRouterProvider.otherwise('/app/login');
    $urlRouterProvider.otherwise(function ($injector, $location) {
      var $state = $injector.get("$state");
      $state.go("app.login");
    });

});

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }

    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'app.login') {
        event.preventDefault();
        $state.go('app.login');
      }
    }
  });
});
