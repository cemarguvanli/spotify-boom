'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:PlaylistController
 * @description
 * # PlaylistController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('PlaylistController', function($scope, $rootScope, $routeParams, PlaylistService, Audio) {

    $scope.showMoreButton = true;
    $scope.playlistTracks = {
      items: []
    };

    $scope.$on('trackIndex:updated', function(event, index) {
      $rootScope.$evalAsync(function() {
        $scope.trackCurrentIndex = index;
      });
    });


    var params = {
      limit: 10,
      offset: -10
    };

    var playlistId = $routeParams.playlistId;
    var userId = $routeParams.userId;

    $scope.formatedPlayList = [];

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
            $scope.formatedPlayList.push({
              track: $scope.playlistTracks.items[i].track.preview_url,
              id: $scope.playlistTracks.items[i].track.id
            });
          }

          if (res.total <= $scope.playlistTracks.items.length) {
            $scope.showMoreButton = false;
          }
          Audio.makePlaylist($scope.formatedPlayList);
        });
    };

    $scope.pause = function() {
      $scope.trackCurrentIndex = null;
      Audio.pause();
    };

    $scope.playPause = function(index) {
      $scope.trackCurrentIndex !== index ? Audio.play(index) : $scope.pause()
    };

    $scope.getPlaylistTracks();

    $scope.addTracksToAPlaylist = function(userId, playlistId, params) {
      PlaylistService.addTracksToAPlaylist(userId, playlistId, params).success(function(res) {

      });
    };

    function copyToClipboard(text) {
      var aux = document.createElement("input");
      aux.setAttribute("value", text);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
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
          index: 0,
          uri: $itemScope.item.track.uri
        };
        $scope.removeTrackFromAPlaylist(track);
      }, function($itemScope) {
        return userId === $rootScope.currentUser.id;
      }],
      ['Copy URL', function($itemScope) {
        copyToClipboard($itemScope.item.track.external_urls.spotify);
      }],
      ['Open On Spotify', function($itemScope) {
        window.open($itemScope.item.track.external_urls.spotify, '_blank');
        copyToClipboard($itemScope.item.track.external_urls.spotify);
      }],

      null, ['Add to Playlist', [

      ]]
    ];

    $scope.listOfCurrentUserPlaylist = [];

    PlaylistService.getUserPlaylists($rootScope.currentUser.id).success(function(res) {
      $scope.listOfCurrentUserPlaylist = res;
      angular.forEach($scope.listOfCurrentUserPlaylist.items, function(value, key) {
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
