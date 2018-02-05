#!/usr/bin/env node
module.exports = (function(){
  "use strict";  function LaunchpadCell( cellPage, x, y ){
    this.cellPage = cellPage;
    this.x = x;
    this.y = y;
    this.pitch = this.getPitchForCoords( x, y );
    this.setColor( [0,0] );
    this.__isPressed__ = false;
    this.__pressCallbacks__ = [];
    this.__releaseCallbacks__ = [];
  }

  LaunchpadCell.prototype = {
    getCoordsForPitch : function( pitch ){
      var x = pitch % 16;
      var y = ( pitch - x ) / 16;
      return [ x, y ];
    },
    getPitch : function(){
        return this.getPitchForCoords.call( this, this.x, this.y );
    },
    getPitchForCoords : function( x, y ){
        return x + ( y*16 );
    },
    setColor : function( rg ){
      var r = rg[0];
      var g = rg[1];
      var colorCode = ( 16 * g ) + r + 12;
      this.colorCode = colorCode;
    },
    draw : function(){
      this.cellPage.launchpad.sendMessage( [ 144, this.pitch, this.colorCode ] );
    },
    press : function(){
        console.log("Cell " + this.x + ", " + this.y + " pressed.");
      this.__isPressed__ = true;
      this.__runPressCallbacks__();
    },
    release : function(){
        console.log("Cell " + this.x + ", " + this.y + " released.");
      this.__isPressed__ = false;
      this.__runReleaseCallbacks__();
    },
    __runPressCallbacks__ : function(){
        for( var i = 0; i < this.__pressCallbacks__.length; i ++ ){
        this.__pressCallbacks__[ i ]();
      }
    },
    __runReleaseCallbacks__ : function(){
        for( var i = 0; i < this.__releaseCallbacks__.length; i ++ ){
        this.__releaseCallbacks__[ i ]();
      }
    }
  };

  return LaunchpadCell;
})()