var app = angular.module('app', []);

function MainCtrl($scope) {
  $scope.logs = [];
  chrome.storage.local.get(function(x) {
    for (var key in x) {
      $scope.logs.push([key, x[key].split('^~^')]);
    }
    $scope.$apply();
  });

  chrome.storage.local.getBytesInUse(function(x) {
    $scope.usageMB = (x / 1048576 + '').substring(0, 5);
  });
}

function get() {
  chrome.storage.local.get(function(x) {
    console.log('popup', x);
    for (var key in x) {
      var val = x[key];
      var textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.value = val;
      document.body.appendChild(textbox);
    }
  })
}

