'use strict';

angular.module('spotifyBoomApp')
  .factory('PlaylistService', function($http, api) {
    var playlistService = {};

    playlistService.getCurrentUserPlaylists = function(params) {
      return api.get('me/playlists', {
        params: params
      });
    };

    playlistService.getUserPlaylists = function(userId, params) {
      return api.get('users/' + userId + '/playlists', {
        params: params
      });
    };

    playlistService.getPlaylist = function(userId, playlistId) {
      return api.get('users/' + userId + '/playlists/' + playlistId);
    };

    playlistService.getPlaylistTracks = function(userId, playlistId, params) {
      return api.get('users/' + userId + '/playlists/' + playlistId + '/tracks', {
        params: params
      });
    };

    playlistService.createPlayList = function(userId, playlist) {
      return api.post('users/' + userId + '/playlists', playlist);
    };

    playlistService.removeTrackFromAPlaylist = function(userId, playlistId, track) {
      console.log(userId, playlistId, track)
      return api.delete('users/' + userId + '/playlists/' + playlistId + '/tracks', track);
    };

    playlistService.addTracksToAPlaylist = function(userId, playlistId, params) {
      var uri = api.url+'users/' + userId + '/playlists/' + playlistId + '/tracks';
      return $http({
        method: 'POST',
        url: uri,
        params: params
      });
    };

    return playlistService;
  });
