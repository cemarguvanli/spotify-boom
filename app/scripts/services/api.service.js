'use strict';
angular.module('spotifyBoomApp')
  .factory('api', function($http) {

    var api = {};
    var apiUrl = 'https://api.spotify.com/v1/';

    api.post = function(uri, data) {
      data = data || {};
      return $http.post(apiUrl + uri, data);
    };

    api.get = function(uri, data) {
      data = data || {};
      return $http.get(apiUrl + uri, data);
    };

    api.put = function(uri, data) {
      data = data || {};
      return $http.put(apiUrl + uri, data);
    };

    api.delete = function(uri, data) {
      data = data || {};
      return $http.delete(apiUrl + uri, data);
    };

    return api;
  })

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
  }])

  .provider('myCSRF', [function() {
    var headerName = 'Authorization';

    this.$get = ['$injector', '$q', '$cookies', function($injector, $q, $cookies) {
      return {
        'request': function(config) {
          config.headers = config.headers || {};
          if ($cookies.get('token')) {
            config.headers[headerName] = 'Bearer ' + $cookies.get('token');
          }
          return config;
        },
        'response': function(response) {
          return response;
        },
        'responseError': function(response) {
          if (response.data) {

          }
          return $q.reject(response);
        }
      };
    }];
    
  }]).config(function($httpProvider) {
    $httpProvider.interceptors.push('myCSRF');
  });
