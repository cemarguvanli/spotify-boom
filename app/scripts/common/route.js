'use strict';

/**
 * @ngdoc overview
 * @name spotifyBoomApp
 * @description
 * # spotifyBoomApp
 *
 * Routes of the application.
 */
angular.module('spotifyBoomApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.view.html',
        controller: 'LoginController'
      })
      .when('/welcome', {
        templateUrl: 'views/welcome.view.html',
        controller: 'WelcomeController'
      })
      .when('/playlist/:userId/:playlistId', {
        templateUrl: 'views/playlist.view.html',
        controller: 'PlaylistController'
      })
      .when('/search/:q', {
        templateUrl: 'views/search.view.html',
        controller: 'SearchController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
