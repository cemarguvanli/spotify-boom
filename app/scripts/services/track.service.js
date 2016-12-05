'use strict';

angular.module('spotifyBoomApp')
  .factory('TrackService', function($http, api) {
    var trackService = {};

    trackService.getTrack = function(trackId) {
      return api.get('tracks/' + trackId);
    };

    trackService.getTracks = function() {
      return api.get('tracks');
    };

    trackService.getAudioFeaturesForTrack = function(trackId) {
      return api.get('audio-features/' + trackId);
    };

    trackService.getAudioFeaturesForTracks = function() {
      return api.get('audio-features');
    };

    trackService.getAudioAnalysisForTrack = function(trackId) {
      return api.get('audio-analysis/' + trackId);
    };

    return trackService;
  });
