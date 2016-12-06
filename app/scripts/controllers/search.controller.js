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

    $scope.formatedPlayList = [];

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
          $scope.tracks.items.push(res.tracks.items[i]);
          $scope.formatedPlayList.push({
            track: $scope.tracks.items[i].preview_url,
            id: $scope.tracks.items[i].id
          });
        }

        if (res.tracks.total <= $scope.tracks.items.length) {
          $scope.showMoreButton = false;
        }
        Audio.makePlaylist($scope.formatedPlayList)
      });
    };

    $scope.search();

    $scope.pause = function() {
      $scope.trackCurrentIndex = null;
      Audio.pause();
    };

    $scope.playPause = function(index) {
      $scope.trackCurrentIndex !== index ? Audio.play(index) : $scope.pause();
    };

    $scope.addTracksToAPlaylist = function(userId, playlistId, params) {
      PlaylistService.addTracksToAPlaylist(userId, playlistId, params).success(function(res) {

      });
    }

    function copyToClipboard(text) {
      var aux = document.createElement("input");
      aux.setAttribute("value", text);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    };

    // Context Menu
    $scope.menuOptions = [
      ['Copy URL', function($itemScope) {
        copyToClipboard($itemScope.item.track.external_urls.spotify)
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
