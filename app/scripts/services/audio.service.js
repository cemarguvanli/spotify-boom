'use strict';

angular.module('spotifyBoomApp')
  .factory('Audio', function($rootScope) {
    var audioService = {};
    var audio = new Audio();
    audioService.playlist = [];
    audioService.playing = false;
    audioService.index = null;

    audioService.makePlaylist = function(list) {
      audioService.playlist = list;
      console.log(list)
    };


    audioService.play = function(index) {
      if (audioService.index == index) {
        audio.play();
        return false;
      }
      audioService.index = index;
      $rootScope.$broadcast('trackIndex:updated', audioService.index);
      audio.src = audioService.getTrack(audioService.index);
      audio.play();
      audioService.listener();
    };

    audioService.listener = function() {
      audio.addEventListener('ended', function() {
        if ((audioService.index + 1) === audioService.playlist.length) {
          audioService.playing = false;
          audioService.index = null;
        } else {
          audioService.playing = true;
          audioService.next();
        }
        $rootScope.$broadcast('trackIndex:updated', audioService.index);
      }, false);

      audio.addEventListener('play', function() {
        audioService.playing = true;
      }, false);

      audio.addEventListener('pause', function() {
        audioService.playing = false;
      }, false);
    };

    audioService.pause = function() {
      audio.pause();
    };

    audioService.next = function() {
      audioService.index++;
      audioService.index = (audioService.index >= audioService.playlist.length ? 0 : audioService.index);
      audio.src = audioService.getTrack(audioService.index);
      audio.play();
      $rootScope.$broadcast('trackIndex:updated', audioService.index);
      return audio.src
    };

    audioService.getTrack = function(index) {
      if (audioService.playlist[index].track != null) {
        return audioService.playlist[index].track;
      } else {
        alert('There is a some problem with this song, returning null')
      }
    };

    audioService.getCurrentIndex = function() {
      return audioService.index;
    };

    return audioService;
  });
