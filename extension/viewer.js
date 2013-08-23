var app = angular.module('app', ['truncate', 'ui.bootstrap']);

function MainCtrl($scope) {
  
  $scope.datepicker = new Date(new Date().setHours(0, 0, 0));
  $scope.maxDate = new Date();

  $scope.load = function() {
    $(".well").mask("Loading...");
    $scope.logs = [];
    var start = Date.parse($scope.datepicker); // Convert to unix time
    var end = new Date(Date.parse($scope.datepicker) + 86400000).getTime(); // Convert to unix time and add a day
    var min = new Date().getTime(); // Will be used to get min date
    chrome.storage.local.get(function(x) {
      for (var key in x) {
        if (key < min) { // Get earliest log
          min = key;
        }
        if (key > start && key < end) { 
          $scope.logs.push([key, x[key].split('^~^')]);
        }
      }
      $scope.minDate = new Date(parseInt(min)); // Convert min to Date object
      $scope.$apply();
      $(".well").unmask();
    });
  }
  $scope.load();

  chrome.storage.local.getBytesInUse(function(x) {
    $scope.usageMB = (x / 1048576 + '').substring(0, 5);
    $scope.$apply();
  });
}