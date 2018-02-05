#!/usr/bin/env node
var LaunchpadCell = require('./launchpad-cell.js');
module.exports = exports = (function(){
  "use strict";
  function LaunchpadCellPage( launchpad ){
    this.launchpad = launchpad;
    this.initializeCells();
  }

  LaunchpadCellPage.prototype = {
    initializeCells : function(){
      this.__cells__ = {};
      for( var x = 0; x < 8; x ++ ){
        for( var y = 0; y < 8; y ++ ){
          this.setCell( x, y, new LaunchpadCell( this, x, y ) );
        }
      }
    },
    setCell : function( x, y, cell ){
      this.__cells__[ x+","+y ] = cell;
    },
    getCell : function( x, y ){
      return this.__cells__[ x+","+y ];
    },
    forEachCell : function( callback ){
      this.forNcells( 64, callback );
    },
    forNcells : function( n, callback ){
      var cells = [];
      for( var y = 0; y < 8; y ++ ){
        for( var x = 0; x < 8; x ++ ){
          cells.push( this.getCell( x, y ) );
        }
      }
      /*cells.sort( function(){
        return Math.random() - 0.5;
      } );*/
      for( var i = 0; i < n; i ++ ){
        callback( cells[ i ] );
      }
    }
  };

  return LaunchpadCellPage;
})();