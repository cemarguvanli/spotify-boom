'use strict';

angular.module('spotifyBoomApp')
  .provider('Authentication', function() {

    this.authToken = null;
    this.clientId = null;
    this.responseType = null;
    this.redirectUri = null;

    this.setAuthToken = function(authToken) {
      this.authToken = authToken;
    };

    this.setClientId = function(clientId) {
      this.clientId = clientId;
    };

    this.setResponseType = function(responseType) {
      this.responseType = responseType;
    };

    this.setRedirectUri = function(redirectUri) {
      this.redirectUri = redirectUri;
    };

    this.$get = function($q) {
      var self = this;
      var authToken = this.authToken;
      var clientId = this.clientId;
      var responseType = this.responseType;
      var redirectUri = this.redirectUri;

      return {

        getAuthToken: function() {
          return 'Bearer ' + authToken;
        },

        getClientId: function() {
          return clientId;
        },

        getResponseType: function() {
          return responseType;
        },

        getRedirectUri: function() {
          return redirectUri;
        },

        login: function() {
          var deferred = $q.defer();
          var width = 450,
              height = 730,
              left = (screen.width / 2) - (width / 2),
              top = (screen.height / 2) - (height / 2);

          function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + clientId +
              '&redirect_uri=' + encodeURIComponent(redirectUri) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=' + responseType;
          }

          var url = getLoginURL(['']);

          window.addEventListener('message', function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type === 'access_token') {
              self.setAuthToken(hash.access_token);
              deferred.resolve(hash);
            }
          }, false);

          window.open(url,
            'Spotify',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
          );

          return deferred.promise;
        }

      };
    };
  });
