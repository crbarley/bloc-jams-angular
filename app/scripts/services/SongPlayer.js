(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(SongPlayer.currentSong);
            }
            
        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
            
        currentBuzzObject.bind('timeupdate', function() {
            $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
            });
        });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Plays the current Buzz object(song) and sets property of song object to true
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }
    /**
    * @function getSongIndex
    * @desc Gets the index of a song
    * @param {Object} song
    */
    var getSongIndex = function(song) {
        return currentAlbum.songs.indexOf(song);
    };
        
     /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;
    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;
    
    /**
    * @function play
    * @ desc Play current or new song
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;  if(SongPlayer.currentSong !== song) {
 
        setSong(song);
        playSong(song);
            
        } else if (SongPlayer.currentSong === song) {
            if (currentBuzzObject.isPaused()) {
                currentBuzzObject.play();
            }
        }
     };
        
    /**
    * @function pause
    * @desc pause current song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;  currentBuzzObject.pause();
        song.playing = false;
    };

    /**
    * @function previous
    * @desc navigates to previous song
    * @param {Object} song
    */
    SongPlayer.previous = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex--;
        
        if(currentSongIndex < 0) {
            stopSong(SongPlayer.currentSong);
        } else {
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
        }
    };
    /**
    * @function next
    * @desc navigates to next song
    * @param {Object} song
    */
    SongPlayer.next = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex++;
        
        if (currentSongIndex > currentAlbum.songs.length) {
            stopSong(SongPlayer.currentSong);
        } else {
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
        }
    };
        
    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
        if (currentBuzzObject) {
            currentBuzzObject.setTime(time);
        }
    };
        
    /**
    * @function stopSong
    * @desc Stops current song
    * @ param {Object} song
    */
    var stopSong = function(song) {
        currentBuzzObject.stop();
        song.playing = null;
    };
        
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', [ '$rootScope', 'Fixtures', SongPlayer]);
})();