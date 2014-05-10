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