angular.module('shato.controllers.home', [])

.controller('HomeCtrl', function($scope, bt, $ionicLoading, $ionicPlatform, $timeout) {

  // Loading indicator
  $scope.loading = {
    show: $ionicLoading.show,
    hide: $ionicLoading.hide
  }

  // Define UUID
  $scope.service = 'AAAA';
  $scope.char = {
    light: 'A012',
    door: {
      open:  'D011',
      close: 'D010'
    }
  };
  $scope.timeout = {};

  // Scan and connect to Shato
  $scope.connect = function() {
    $scope.loading.show();
    bt
      .isEnabled()

      // See if already connected
      .then(function() {
        if (!$scope.device) { return; }
        return bt
          .isConnected($scope.device.id)
          .then(function() {
            throw 'Already Connected';
          }, function() {});
      })

      // Scan for remote device
      .then(function() {
        return bt.scan([$scope.service], 5);
      })

      // Connect to device
      .then(function(device) {
        return bt.connect(device.id);
      })

      // Bind with Scope.device
      .then(function(data) {
        $scope.device = data;
      })

      // Error Handling
      .catch(function(err) {
        if (err == 'Already Connected') { return; }
        if (err == '4') { err = 'Please enable bluetooth'; }
        alert(err);
        $scope.device = null;
      })

      .finally(function() {
        // bt.stopScan();
        $scope.loading.hide();
      });
  }

  // Turn on and off a char
  $scope.toggle = function(char, on, cutoff) {
    // console.log(char, on, cutoff);

    // Clear the previous timeout
    $timeout.cancel($scope.timeout[char]);

    // Automatically turn off after sec to protect the device
    if (cutoff) {
      $scope.timeout[char] = $timeout(function() {
        $scope.toggle(char, 0);
      }, cutoff * 1000);
    }

    // Send command to device
    return bt
      .write($scope.device.id, $scope.service, char, on ? 't' : 'f')
      .then(function(data) { })
      .catch(alert);
  };

  // Auto Connect on startup
  $scope.$on('init', $scope.connect);

  // Auco check connection and auto reconnect on resume
  $ionicPlatform.on('resume', $scope.connect);

  $scope.test = function() {
    console.log('released');
  };

});
