var Bleno = require('bleno');
var Gpio = require('onoff').Gpio;

/* Define pins */
var A012 = new Gpio(12, 'out');
var D011 = new Gpio(16, 'out');
var D010 = new Gpio(21, 'out');

var SUCCESS = Bleno.Characteristic.RESULT_SUCCESS;

/* Characteristic */
var light = new Bleno.Characteristic({
  uuid: 'A012',
  properties: ['read', 'write'],
  onWriteRequest: function(data, o, w, callback) {
    data = btos(data);
    A012.writeSync(data === 't' ? 1 : 0);
    callback(SUCCESS);
  }
});

var doorOpen = new Bleno.Characteristic({
  uuid: 'D011',
  properties: ['read', 'write'],
  onWriteRequest: function(data, o, w, callback) {
    data = btos(data);
    D011.writeSync(data === 't' ? 1 : 0);
    callback(SUCCESS);
  }
});

var doorClose = new Bleno.Characteristic({
  uuid: 'D010',
  properties: ['read', 'write'],
  onWriteRequest: function(data, o, w, callback) {
    data = btos(data);
    D010.writeSync(data === 't' ? 1 : 0);
    callback(SUCCESS);
  }
});


/* Create service */
var service = new Bleno.PrimaryService({
    uuid: 'AAAA',
    characteristics: [ light, doorOpen, doorClose ]
});


/* Start advertising on powered on */
Bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    /* Advertising */
    Bleno.startAdvertising('SHATO', ['AAAA']);
    Bleno.setServices([service]);
  }
});



// ASCII only
function stob(string) {
  var array = new Uint8Array(string.length);
  for (var i = 0, l = string.length; i < l; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array.buffer;
}

// ASCII only
function btos(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}
