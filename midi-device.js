#!/usr/bin/env node
var MIDI = require('midi');
module.exports = (function(){
  "use strict";

  function MIDIdevice( portIndex ){
    this.__input__ = new MIDI.input();
    this.__input__.openPort( portIndex );
    this.__output__ = new MIDI.output();
    this.portIndex = portIndex;
  }

  MIDIdevice.prototype = {
    onInput : function( callback ){
      this.__input__.on("message", function( deltaTime, message ){
        callback( message );
      });
    },
    sendMessage : function( message ){
        console.log("====Sending Message " + message);
      try{
        this.__output__.sendMessage( message );
      }catch( e ){
        console.log( e );
      }
    }
  };

  return MIDIdevice;
})();