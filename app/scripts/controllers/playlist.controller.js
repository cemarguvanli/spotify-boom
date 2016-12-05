'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:PlaylistController
 * @description
 * # PlaylistController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('PlaylistController', function($scope, $rootScope, $routeParams, PlaylistService) {

    $scope.showMoreButton = true;
    $scope.playlistTracks = {
      items: []
    };

    var params = {
      limit: 10,
      offset: -10
    };

    var playlistId = $routeParams.playlistId;
    var userId = $routeParams.userId;

    $scope.getPlaylistTracks = function() {
      params.offset += 10;

      PlaylistService
        .getPlaylistTracks(userId, playlistId, params)
        .success(function(res) {

          $scope.playlistTracks.href = res.href;
          $scope.playlistTracks.next = res.next;
          $scope.playlistTracks.offset = res.offset;
          $scope.playlistTracks.previous = res.previous;
          $scope.playlistTracks.total = res.total;

          for (var i = 0; i < res.items.length; i++) {
            $scope.playlistTracks.items.push(res.items[i]);
          }

          if (res.total <= $scope.playlistTracks.items.length) {
            $scope.showMoreButton = false;
          }

        });
    };

    $scope.getPlaylistTracks();

  });
