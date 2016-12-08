'use strict';

angular.module('spotifyBoomApp')
  .provider('Authentication', function() {

    this.authToken = null;
    this.clientId = null;
    this.responseType = null;
    this.redirectUri = null;
    this.scopes = null;

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

    this.setScopes = function(scopes) {
      this.scopes = scopes;
    };

    this.$get = function($q) {
      var self = this;
      var authToken = this.authToken;
      var clientId = this.clientId;
      var responseType = this.responseType;
      var redirectUri = this.redirectUri;
      var scopes = this.scopes;

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

          function openWindow(url, name, options, callback){
            var win = window.open(url, name, options);
            var interval = window.setInterval(function () {
              try {
                if (!win || win.closed) {
                  window.clearInterval(interval);
                  callback(win);
                }
              } catch (e) {}
            }, 1000);
          }

          var deferred = $q.defer();
          var authCompleted = false;
          var width = 450,
              height = 730,
              left = (screen.width / 2) - (width / 2),
              top = (screen.height / 2) - (height / 2);
          function getLoginURL() {
            return 'https://accounts.spotify.com/authorize?client_id=' + clientId +
              '&redirect_uri=' + encodeURIComponent(redirectUri) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=' + responseType;
          }

          var url = getLoginURL();

          window.addEventListener('message', function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type === 'access_token') {
              self.setAuthToken(hash.access_token);
              deferred.resolve(hash);
              authCompleted = true;
            }
          }, false);

          openWindow(url,
            'Spotify',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left,
            function () {
              if (!authCompleted) {
                deferred.reject();
              }
            }
          );

          return deferred.promise;
        }

      };
    };
  });
