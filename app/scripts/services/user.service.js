'use strict';

angular.module('spotifyBoomApp')
  .factory('UserService', function($http, api) {
    var userService = {};

    userService.getCurrentUser = function() {
      return api.get('me');
    };

    return userService;
  });
