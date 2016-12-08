'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:PlaylistController
 * @description
 * # PlaylistController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('PlaylistController', function($scope, $rootScope, $routeParams, $interval, PlaylistService, Audio) {
    $scope.volume = 50;
    $scope.helperIndex = null;

    $scope.showMoreButton = true;
    $scope.buttonLoading = false;

    $scope.playlistTracks = {
      items: []
    };

    $scope.$on('trackIndex:updated', function(event, index) {
      $rootScope.$evalAsync(function() {
        $scope.trackCurrentIndex = index;
        $scope.helperIndex = index;
      });
    });

    var params = {
      limit: 10,
      offset: -10
    };

    var playlistId = $routeParams.playlistId;
    var userId = $routeParams.userId;

    $scope.formatedPlaylist = [];
    var totalItems = 0;
    $scope.getPlaylistTracks = function() {
      $scope.buttonLoading = true;
      params.offset += 10;

      PlaylistService
        .getPlaylistTracks(userId, playlistId, params)
        .success(function(res) {

          $scope.buttonLoading = false;
          $scope.playlistTracks.href = res.href;
          $scope.playlistTracks.next = res.next;
          $scope.playlistTracks.offset = res.offset;
          $scope.playlistTracks.previous = res.previous;
          $scope.playlistTracks.total = res.total;

          for (var i = 0; i < res.items.length; i++) {
            totalItems += 1;
            if (res.items[i].track.preview_url !== null) {
              $scope.playlistTracks.items.push(res.items[i]);
              $scope.formatedPlaylist.push({
                track: res.items[i].track.preview_url,
                id: res.items[i].track.id
              });
            }
          }
          if (res.total <= totalItems) {
            $scope.showMoreButton = false;
          }
          Audio.makePlaylist($scope.formatedPlaylist);
        });
    };

    $scope.pause = function() {
      Audio.pause();
      $scope.trackCurrentIndex = null;
    };

    $scope.play = function(index) {
      if ($scope.helperIndex === index) {
        $scope.trackCurrentIndex = index;
        var index = null;
      }
      Audio.play(index);
      $scope.currentTime = Audio.audio.currentTime;
    };

    $scope.setVolume = function() {
      Audio.setVolume($scope.volume);
      $scope.listenToVolume($scope.volume);
    };

    $scope.listenToVolume = function(volume) {
      if (volume == 0) {
        return 'glyphicon-volume-off';
      } else if (volume < 50) {
        return 'glyphicon-volume-down';
      } else if (volume >= 50) {
        return 'glyphicon-volume-up';
      }
    }

    $scope.getPlaylistTracks();

    $scope.addTracksToAPlaylist = function(userId, playlistId, params) {
      PlaylistService.addTracksToAPlaylist(userId, playlistId, params).success(function(res) {

      });
    };

    $scope.removeTrackFromAPlaylist = function(track) {
      var body = {
        tracks: [{
          "positions": [track.index],
          "uri": track.uri
        }]
      };

      PlaylistService.removeTrackFromAPlaylist(userId, playlistId, body).success(function() {
        $scope.playlistTracks.items.splice(track.index, 1);
      }).error(function(err) {
        alert(err.error.message);
      });
    };

    // Context Menu
    $scope.menuOptions = [
      ['Remove from this Playlist', function($itemScope) {
        var track = {
          index: $itemScope.$index,
          uri: $itemScope.item.track.uri
        };

        $scope.removeTrackFromAPlaylist(track);
      }, function($itemScope) {
        return userId === $rootScope.currentUser.id;
      }],
      ['Copy URL', function($itemScope) {
        $scope.copyToClipboard($itemScope.item.track.external_urls.spotify);
      }],
      ['Open On Spotify', function($itemScope) {
        window.open($itemScope.item.track.external_urls.spotify, '_blank');
      }],

      null, ['Add to Playlist', [

      ]]
    ];

    $scope.listOfCurrentUserPlaylist = [];

    PlaylistService.getUserPlaylists($rootScope.currentUser.id).success(function(res) {
      $scope.listOfCurrentUserPlaylist = res;
      angular.forEach($scope.listOfCurrentUserPlaylist.items, function(value) {
        if (value.owner.id === $rootScope.currentUser.id) {
          $scope.menuOptions[$scope.menuOptions.length - 1][1].push([value.name, function($itemScope) {
            var params = {
              position: 0,
              uris: $itemScope.item.track.uri
            };
            $scope.addTracksToAPlaylist($rootScope.currentUser.id, value.id, params);
          }]);
        }
      });
    });

  });
