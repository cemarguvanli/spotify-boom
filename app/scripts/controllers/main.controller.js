'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('MainController', function($scope, $rootScope, $cookies, $location) {

    $rootScope.bodyClassName = 'page-layout';
    $rootScope.currentUser = $cookies.getObject('me') || null;

    $scope.q = '';

    $scope.goToSearch = function() {
      if ($scope.q.length) {
        $location.path('/search/' + $scope.q);
      }

      return false;
    };

  });
