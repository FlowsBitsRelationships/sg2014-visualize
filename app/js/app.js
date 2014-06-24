'use strict';


// Declare app level module which depends on filters, and services
angular.module('visualizeApp', [
  'ngRoute',
  'ngAnimate',
  'ngResource',
  'visualizeApp.filters',
  'visualizeApp.services',
  'visualizeApp.directives',
  'visualizeApp.controllers',
  'visualizeApp.animations',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/interaction.html', controller: 'InteractionCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/temporal.html', controller: 'TemporalCtrl'});
  $routeProvider.when('/view3', {templateUrl: 'partials/spatial.html', controller: 'SpatialCtrl'});
  $routeProvider.otherwise({redirectTo: '/view3'});
}]);
