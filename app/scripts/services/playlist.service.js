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

    return playlistService;
  });
