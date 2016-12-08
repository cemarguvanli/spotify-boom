'use strict';

/**
 * @ngdoc overview
 * @name spotifyBoomApp
 * @description
 * # spotifyBoomApp
 *
 * Config of the application.
 */
angular.module('spotifyBoomApp')
  .config(['AuthenticationProvider', function(AuthenticationProvider) {
    AuthenticationProvider.setClientId('88f1dd4ca97a4f969a20f53e39db7493');
    AuthenticationProvider.setRedirectUri('http://cemarguvanli.com/callback.html');
    AuthenticationProvider.setScopes(['user-library-modify', 'playlist-modify-public', 'playlist-modify-private']);
    AuthenticationProvider.setResponseType('token');
  }]);
