'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:SearchController
 * @description
 * # SearchController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('SearchController', function($scope, $rootScope, $routeParams, SearchService, PlaylistService, Audio) {
    $scope.volume = 50;
    $scope.showMoreButton = true;
    $scope.buttonLoading = true;

    $scope.tracks = {
      items: []
    };

    $scope.$on('trackIndex:updated', function(event, index) {
      $rootScope.$evalAsync(function() {
        $scope.trackCurrentIndex = index;
      });
    });

    $scope.q = $routeParams.q;

    var params = {
      type: 'track',
      q: $scope.q,
      limit: 10,
      offset: -10
    };

    $scope.formatedPlaylist = [];

    $scope.search = function() {
      params.offset += 10;
      $scope.buttonLoading = false;

      SearchService.search(params).success(function(res) {
        $scope.buttonLoading = true;

        $scope.tracks.href = res.tracks.href;
        $scope.tracks.next = res.tracks.next;
        $scope.tracks.offset = res.tracks.offset;
        $scope.tracks.previous = res.tracks.previous;
        $scope.tracks.total = res.tracks.total;

        for (var i = 0; i < res.tracks.items.length; i++) {
          if (res.tracks.items[i].preview_url !== null) {
            $scope.tracks.items.push(res.tracks.items[i]);
            $scope.formatedPlaylist.push({
              track: res.tracks.items[i].preview_url,
              id: res.tracks.items[i].id
            });
          }
        }

        if (res.tracks.total <= $scope.tracks.items.length) {
          $scope.showMoreButton = false;
        }
        Audio.makePlaylist($scope.formatedPlaylist);
      });
    };

    $scope.search();

    $scope.pause = function() {
      Audio.audio.pause();
      $scope.trackCurrentIndex = null;
    };

    $scope.play = function(index) {
      if (index === undefined) {
        var index = 0;
      }
      Audio.play(index);
    };

    // Player Control
    $scope.setVolume = function() {
      Audio.setVolume($scope.volume);
      $scope.listenToVolume($scope.volume);
    };

    $scope.listenToVolume = function(volume) {
      if (volume == 0) {
        return 'glyphicon-volume-off';
      } else if (volume < 50) {
        return 'glyphicon-volume-down'
      } else if (volume >= 50) {
        return 'glyphicon-volume-up'
      }
    }

    $scope.addTracksToAPlaylist = function(userId, playlistId, params) {
      PlaylistService.addTracksToAPlaylist(userId, playlistId, params).success(function(res) {

      });
    }

    // Context Menu
    $scope.menuOptions = [
      ['Copy URL', function($itemScope) {
        $scope.copyToClipboard($itemScope.item.external_urls.spotify)
      }],
      ['Open On Spotify', function($itemScope) {
        window.open($itemScope.item.external_urls.spotify, '_blank');
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
              uris: $itemScope.item.uri
            };
            $scope.addTracksToAPlaylist($rootScope.currentUser.id, value.id, params);
          }]);
        }
      });
    });
  });
