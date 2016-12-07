'use strict';

angular.module('spotifyBoomApp')
  .factory('Audio', function($rootScope) {
    var audioService = {};
    audioService.audio = new Audio();
    audioService.audio.volume = .5;
    audioService.playlist = [];
    audioService.playing = false;
    audioService.index = null;

    audioService.makePlaylist = function(list) {
      if (audioService.playlist.length === 0) {
        audioService.listener();
      }
      audioService.playlist = list;
    };


    audioService.play = function(index) {
      audioService.index = index;
      $rootScope.$broadcast('trackIndex:updated', audioService.index);
      audioService.audio.src = audioService.getTrack(audioService.index);
      audioService.audio.pause();
      setTimeout(function() {
        if (audioService.audio.paused) {
          audioService.audio.play();
        }
      }, 250);
    };

    audioService.listener = function() {
      audioService.audio.addEventListener('ended', function() {
        if ((audioService.index + 1) === audioService.playlist.length) {
          audioService.playing = false;
          audioService.index = null;
        } else {
          audioService.playing = true;
          audioService.next();
        }
        $rootScope.$broadcast('trackIndex:updated', audioService.index);
      }, false);

      audioService.audio.addEventListener('play', function() {
        audioService.playing = true;
      }, false);

      audioService.audio.addEventListener('pause', function() {
        audioService.playing = false;
      }, false);
    };

    audioService.pause = function() {
      audioService.audio.pause();
    };

    audioService.next = function() {
      audioService.index++;
      audioService.index = (audioService.index >= audioService.playlist.length ? 0 : audioService.index);
      audioService.audio.src = audioService.getTrack(audioService.index);
      audioService.audio.play();
      $rootScope.$broadcast('trackIndex:updated', audioService.index);
      return audioService.audio.src
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

    audioService.setVolume = function() {
      var volume = document.getElementById("volume");
      audioService.audio.volume = volume.value / 100
    };

    return audioService;
  });
