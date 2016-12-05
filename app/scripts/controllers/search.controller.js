'use strict';

/**
 * @ngdoc function
 * @name spotifyBoomApp.controller:SearchController
 * @description
 * # SearchController
 * Controller of the spotifyBoomApp
 */
angular.module('spotifyBoomApp')
  .controller('SearchController', function($scope, $routeParams, SearchService) {

    $scope.showMoreButton = true;
    $scope.buttonLoading = true;

    $scope.tracks = {
      items: []
    };

    $scope.q = $routeParams.q;

    var params = {
      type: 'track',
      q: $scope.q,
      limit: 10,
      offset: -10
    };

    $scope.search = function(){
      params.offset += 10;
      $scope.buttonLoading = false;

      SearchService.search(params).success(function(res){
        $scope.buttonLoading = true;

        $scope.tracks.href = res.tracks.href;
        $scope.tracks.next = res.tracks.next;
        $scope.tracks.offset = res.tracks.offset;
        $scope.tracks.previous = res.tracks.previous;
        $scope.tracks.total = res.tracks.total;

        for (var i = 0; i < res.tracks.items.length; i++) {
          $scope.tracks.items.push(res.tracks.items[i]);
        }

        if (res.tracks.total <= $scope.tracks.items.length) {
          $scope.showMoreButton = false;
        }
      });
    };

    $scope.search();

  });
