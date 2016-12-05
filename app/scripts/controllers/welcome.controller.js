'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:WelcomeController
 * @description
 * # WelcomeController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('WelcomeController', function($rootScope, $scope, SearchService, TrackService, PlaylistService) {

    $rootScope.bodyClassName = 'page-layout';

    $scope.showMoreButton = true;
    $scope.buttonLoading = true;

    $scope.currentUserPlayLists = {
      items: []
    };

    var paramsCurrentUserPlaylists = {
      limit: 5,
      offset: -5
    };

    $scope.getCurrentUserPlaylists = function() {

      paramsCurrentUserPlaylists.offset += 5;
      $scope.buttonLoading = false;

      PlaylistService.getCurrentUserPlaylists(paramsCurrentUserPlaylists).success(function(res) {
        $scope.buttonLoading = true;

        $scope.currentUserPlayLists.href = res.href;
        $scope.currentUserPlayLists.next = res.next;
        $scope.currentUserPlayLists.offset = res.offset;
        $scope.currentUserPlayLists.previous = res.previous;
        $scope.currentUserPlayLists.total = res.total;

        for (var i = 0; i < res.items.length; i++) {
          $scope.currentUserPlayLists.items.push(res.items[i]);
        }

        if (res.total <= $scope.currentUserPlayLists.items.length) {
          $scope.showMoreButton = false;
        }

      });
    };

    $scope.getCurrentUserPlaylists();

  });
