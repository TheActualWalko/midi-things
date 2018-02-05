#!/usr/bin/env node
var _ = require( 'underscore' );
var MIDIdevice = require( './midi-device.js' );
var LaunchpadCellPage = require( './launchpad-cell-page.js' );
module.exports = exports = (function(){
  "use strict";
  function Launchpad( portIndex ){
    console.log( "Created launchpad at port " + portIndex );
    MIDIdevice.call( this, portIndex );
    this.__messageFnQueue__ = [];
    this.isRunningUpdate = false;
    this.isRunningRepeater = false;
    this.onInput( function( message ){
      console.log("====Receiving Message: " + message);
    }.bind(this) );
    this.setNextPage( new LaunchpadCellPage( this ) );
    this.loadNextPage();
    this.runUpdate();
  }

  Launchpad.prototype = _.extend(_.clone( MIDIdevice.prototype ), {
    TIME_TO_REDRAW_ONE_CELL : 4,
    repeat : function( callback ){
      if( !this.isRunningUpdate ){
        this.open();
      }
      this.repeatInterval = setInterval( function(){
        callback();
        if( this.isRunningUpdate ){
          this.__runNextMessage__();
        }
      }.bind( this ), this.TIME_TO_REDRAW_ONE_CELL * 64 );
      this.isRunningRepeater = true;
    },

    endRepeat : function(){
      clearInterval( this.repeatInterval );
      if( !this.isRunningUpdate ){
        this.close();
      }
    },

    runUpdate : function( callback ){
      if( !this.isRunningRepeater ){
        if( !this.isRunningUpdate ){
          this.open();
        }
        this.isRunningUpdate = true;
        var messageInterval = setInterval( function(){
          if( this.__messageFnQueue__.length > 0 ){
            this.__runNextMessage__();
          }else{
            if( !this.isRunningRepeater ){
              this.close();
            }
            clearInterval( messageInterval );
            this.isRunningUpdate = false;
            if( callback != null ){
              callback();
            }
          }
        }.bind( this ), this.TIME_TO_REDRAW_ONE_CELL );
      }
    },
    __runNextMessage__ : function(){
        var messageRepeatCount = 2;
      if( this.__messageFnQueue__.length > 0 ){
        this.__messageFnQueue__[0]();
        for( var i = 1; i < messageRepeatCount; i ++ ){
          setTimeout( this.__messageFnQueue__[0].bind(this), this.TIME_TO_REDRAW_ONE_CELL * ( i / messageRepeatCount ) );
        }
        this.__messageFnQueue__.splice( 0, 1 );
      }
    },
    addToMessageQueue : function( callback ){
        this.__messageFnQueue__.push( callback );
    },
    open : function(){
      console.log("===>Opening");
      this.__output__.openPort( this.portIndex );
    },
    close : function(){
      console.log("<===Closing");
      this.__output__.closePort();
    },
    setNextPage : function( cellPage ){
      this.__nextPage__ = cellPage;
    },
    loadNextPage : function(){
      this.__currentPage__ = this.__nextPage__;
      this.__drawCurrentPage__();
    },
    getCurrentPage : function(){
      return this.__currentPage__;
    },
    getCell : function(){
      return this.__currentPage__.getCell.apply( this.__currentPage__, arguments );
    },
    forEachCell : function(){
      return this.__currentPage__.forEachCell.apply( this.__currentPage__, arguments );
    },
    forNcells : function(){
      return this.__currentPage__.forNcells.apply( this.__currentPage__, arguments );
    },
    __drawCurrentPage__ : function(){
      this.__currentPage__.forEachCell( function( currentCell ){
        this.addToMessageQueue( function(){
          currentCell.draw();
        }.bind( this ) );
      }.bind( this ) );
    }
  });
  return Launchpad;
})();