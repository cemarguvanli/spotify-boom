'use strict';

angular.module('spotifyBoomApp')
  .factory('SearchService', function($http, api) {
    var searchService = {};

    searchService.search = function(params) {
      return api.get('search/', {
        params: params
      });
    };

    return searchService;
  });
