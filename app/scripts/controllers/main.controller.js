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
      } else{
        alert('Type a word');
      }
      return false;
    };

    $scope.copyToClipboard = function(text) {
      var aux = document.createElement("input");
      aux.setAttribute("value", text);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    };

  });
