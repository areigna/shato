// Ionic Starter App

angular.module('shato', [
  'ionic',

  // Controllers
  'shato.controllers.home',

  // Services
  'shato.services.bt'
])

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner>',
  noBackdrop: true,
  hideOnStateChange: true
})

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Send init event
    $rootScope.$broadcast('init');
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // No transition effect
  $ionicConfigProvider.views.transition('none');

  $urlRouterProvider.otherwise('/')

  $stateProvider

  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller:  'HomeCtrl'
  })

})
