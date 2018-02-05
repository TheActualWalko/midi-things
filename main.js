#!/usr/bin/env node
var _ = require('underscore');
var MIDI = require('midi');
var Launchpad = require('./launchpad.js');
var LaunchpadCellPage = require('./launchpad-cell-page.js');

(function(){
  "use strict";

  var portAnalysisInput = new MIDI.input();
  var portCount = portAnalysisInput.getPortCount();

  var launchpadPortIndex;

  for( var i = 0; i < portCount; i ++ ){
    if( portAnalysisInput.getPortName( i ) === "Launchpad" ){
      launchpadPortIndex = i;
    }
    console.log( portAnalysisInput.getPortName( i ) );
  }

  portAnalysisInput.closePort();
  
  var runCount = 0;
  var launchpad = new Launchpad( launchpadPortIndex );
  
  function setLaunchpadColor( rg ){
    var nextPage = new LaunchpadCellPage( launchpad );
    nextPage.forEachCell( function( currentCell ){
      currentCell.setColor( rg );
    });
    launchpad.setNextPage( nextPage );
    launchpad.loadNextPage();
  }
  /*
  function loopChangeColor(){
    var nextColor = [ Math.floor( Math.random() * 3 ), Math.floor( Math.random() * 3 ) ];
    setLaunchpadColor( nextColor );
    launchpad.runUpdate( function(){
      runCount ++;
      console.log("Ran " + runCount + " times");
      setTimeout( loopChangeColor, 50 );
    });
  }

  loopChangeColor();*/
  var launchpadLightContents = [
    [ 0,0,1,1,1,1,0,0,    0,1,0,0,0,0,0,1,   0,0,0,1,1,0,0,0,    0,0,1,1,1,1,0,0 ],
    [ 0,1,0,0,0,0,1,0,    0,1,0,0,1,0,0,1,   0,0,1,0,0,1,0,0,    0,1,0,0,0,0,1,0 ],
    [ 0,1,0,0,0,0,0,0,    0,1,0,0,1,0,0,1,   0,0,1,0,0,1,0,0,    0,1,0,0,0,0,0,0 ],
    [ 0,0,1,1,1,1,0,0,    0,0,1,0,1,0,1,0,   0,0,1,1,1,1,0,0,    0,1,0,0,0,0,0,0 ],
    [ 0,0,0,0,0,0,1,0,    0,0,1,0,1,0,1,0,   0,1,0,0,0,0,1,0,    0,1,0,0,0,0,0,0 ],
    [ 0,0,0,0,0,0,1,0,    0,0,0,1,0,1,0,0,   0,1,0,0,0,0,1,0,    0,1,0,0,1,1,1,0 ],
    [ 0,1,1,1,1,1,0,0,    0,0,0,1,0,1,0,0,   0,1,0,0,0,0,1,0,    0,0,1,1,1,0,0,0 ],
    [ 0,0,0,0,0,0,0,0,    0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0,    0,0,0,0,0,0,0,0 ]
  ];

  var currentOffset = 0;
  function scroll(){
    var nextPage = new LaunchpadCellPage( launchpad );
    nextPage.forEachCell( function( currentCell ){
      if( launchpadLightContents[ currentCell.y ][ currentOffset + currentCell.x ] === 1 ){
        currentCell.setColor( [ 0, 1 ] );
      }else{
        currentCell.setColor( [ 0, 0 ] );
      }
    });
    launchpad.setNextPage( nextPage );
    launchpad.loadNextPage();
    currentOffset += 1;
  }

  setInterval( function(){
    scroll();
  }, 50 );

})();