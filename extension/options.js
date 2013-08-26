var app = angular.module('app', []);

function OptionsCtrl($scope, $route) {

  chrome.storage.local.getBytesInUse(function(x) {
    $scope.usageMB = (x / 1048576 + '').substring(0, 5);
    $scope.$apply();
  });

  // Page load functions
  chrome.storage.sync.get(function(results) {
  	$scope.saveType = results.saveType;
    $scope.saveAll = results.saveAll;
  	$scope.allKeys = results.allKeys;
    if (!results.saveType) {
      $scope.saveType = "detailed";
      $scope.saveAll = false;
      $scope.allKeys = false;
      $scope.save();
    }
  	$scope.$apply();
  });

  $scope.save = function() { // Handle option changes
		console.log($scope.saveType, $scope.saveAll, $scope.allKeys);
		chrome.storage.sync.set({saveType: $scope.saveType, saveAll: $scope.saveAll, allKeys: $scope.allKeys}, $scope.saved);
	}

  $scope.saved = function() {
    console.log('Saved');
  }

	$scope.clear = function() {
    var clearLimit = new Date(Date.now() - (86400000 * $scope.daysToClear)).getTime();
    chrome.storage.local.get(function(x) {
      var trash = []; // Create array of keys to delete
      for (var key in x) {
        if (key < clearLimit || isNaN(key) || key < 10000) { // Restrict by time and remove invalid chars 
          trash.push(key);
        }
      }
      chrome.storage.local.remove(trash, function() {
      	$scope.$apply();
        $route.reload();
      });
    });
	}
}