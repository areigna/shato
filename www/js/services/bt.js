angular.module('shato.services.bt', [])

.service('bt', function($q, $timeout){

  return {
    scan: function(services, sec) {
      const deferred = $q.defer();

      ble.scan(services, sec, deferred.resolve, deferred.reject);

      $timeout(function() {
        deferred.reject('Timeout');
      }, sec * 1000);

      return deferred.promise;
    },

    startScan: function(services) {
      const deferred = $q.defer();

      ble.startScan(services, deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    stopScan: function() {
      const deferred = $q.defer();

      ble.stopScan(deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    connect: function(id) {
      const deferred = $q.defer();

      ble.connect(id, deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    disconnect: function(id) {
      const deferred = $q.defer();

      ble.disconnect(id, deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    read: function(deviceId, serviceId, charId) {
      const deferred = $q.defer();

      ble.read(deviceId, serviceId, charId, function(data) {
        console.log('***************');
        console.log(typeof data);
        console.log(data);
        console.log(btos(data));
        deferred.resolve(btos(data));
      }, deferred.reject);

      return deferred.promise;

    },

    write: function(deviceId, serviceId, charId, data) {
      const deferred = $q.defer();

      data = stob(data);

      ble.write(deviceId, serviceId, charId, data, deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    isConnected: function(deviceId) {
      const deferred = $q.defer();

      ble.isConnected(deviceId, deferred.resolve, deferred.reject);

      return deferred.promise;
    },

    isEnabled: function() {
      const deferred = $q.defer();

      ble.isEnabled(deferred.resolve, deferred.reject);

      return deferred.promise;
    }


  };

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
