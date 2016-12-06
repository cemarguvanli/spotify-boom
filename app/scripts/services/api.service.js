'use strict';
angular.module('spotifyBoomApp')
  .factory('api', function($http) {

    var api = {
      url: 'https://api.spotify.com/v1/'
    };

    api.post = function(uri, data) {
      data = data || {};
      return $http.post(api.url + uri, data);
    };

    api.get = function(uri, data) {
      data = data || {};
      return $http.get(api.url + uri, data);
    };

    api.put = function(uri, data) {
      data = data || {};
      return $http.put(api.url + uri, data);
    };

    api.delete = function(uri, data) {
      data = data || {};
      // return $http.delete(api.url + uri, data);
      return $http({
        method: 'DELETE',
        url: api.url + uri,
        data: data
      });
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
          console.log(response, 'error');
          if (response.data) {
            if (response.status === 401) {
                alert(response.data.error.message);
                window.location.href = '#/';
            }
          }
          return $q.reject(response);
        }
      };
    }];

  }]).config(function($httpProvider) {
    $httpProvider.interceptors.push('myCSRF');
  })
