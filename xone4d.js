#!/usr/bin/env node
var _ = require( 'underscore' );
var MIDIdevice = require( './midi-device.js' );
module.exports = exports = (function(){
  "use strict";
  function Xone4D( portIndex ){
    console.log( "Created xone4d at port " + portIndex );
    MIDIdevice.call( this, portIndex );
  }

  Xone4D.prototype = _.extend(_.clone( MIDIdevice.prototype ), {
    
  });
  return Xone4D;
})();