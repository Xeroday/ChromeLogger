var app = angular.module('app', ['filters', 'ngQuickDate']);

app.controller("ViewerCtrl", function($scope) {

    /* Load logs, startDate should be a JS timestamp */
    $scope.load = function(startDate) {
        $scope.logs = [];
        chrome.storage.local.get(function(logs) {
            for (var key in logs) {
                if (key > startDate)
                    $scope.logs.push([key, logs[key].split('^~^')]);
            }
            $scope.$apply();
        });
    }
    
    /* Called when new date is picked */ 
    $scope.date = function() {
        $scope.load(new Date($scope.aDatepicker).getTime());
    }

    /* Delete old logs */
    $scope.delete = function() {
        var endDate = new Date($scope.deleteDatepicker).getTime();
        chrome.storage.local.get(function(logs) {
            var toDelete = [];
            for (var key in logs) {
                if (key < endDate || isNaN(key) || key < 10000) { // Restrict by time and remove invalid chars 
                  toDelete.push(key);
                }
            }
            chrome.storage.local.remove(toDelete, function() {
                alert(toDelete.length + " entries deleted");
                $scope.aDatepicker = 0;
                $scope.load(0);
            });
            $scope.$apply();
        });
    }

    /* Save settings */
    $scope.updateSettings = function() {
        var allKeys = document.getElementById("allKeys").checked;
        var formGrabber = document.getElementById("formGrabber").checked;
        chrome.storage.sync.set({allKeys: allKeys, formGrabber: formGrabber}, function() { alert("Settings saved"); });
    }

    /* Load settings */
    chrome.storage.sync.get(function(settings) {
        document.getElementById("allKeys").checked = settings.allKeys;
        document.getElementById("formGrabber").checked = settings.formGrabber;
    });

    $scope.load(0);

});

/**
 * Truncate Filter
 * @Param text
 * @Param length, default is 10
 * @Param end, default is "..."
 * @return string
 */
angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;
            if (end === undefined)
                end = "...";
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });