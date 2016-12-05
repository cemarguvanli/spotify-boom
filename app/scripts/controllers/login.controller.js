'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('LoginController', function($scope, $rootScope, $cookies, $location, Authentication, UserService) {

    $rootScope.bodyClassName = 'login-layout';
    $scope.loginLoadingButton = false;

    $scope.login = function() {
      $scope.loginLoadingButton = true;
      Authentication.login().then(function(res) {
        $cookies.put('token', res.access_token);
        UserService.getCurrentUser().success(function(res) {
          $rootScope.currentUser = res;
          $cookies.putObject('me', res);
          $scope.loginLoadingButton = false;
          $location.path('/welcome');
        });
      });
    };
  });
