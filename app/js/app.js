'use strict';


// Declare app level module which depends on filters, and services
angular.module('visualizeApp', [
  'ngRoute',
  'ngAnimate',
  'visualizeApp.filters',
  'visualizeApp.services',
  'visualizeApp.directives',
  'visualizeApp.controllers',
  'visualizeApp.animations',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'InteractionCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'TemporalCtrl'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'SpatialCtrl'});
  $routeProvider.otherwise({redirectTo: '/view3'});
}]);
