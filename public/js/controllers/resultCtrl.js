angular.module('carbonCalc').controller('resultController', function($scope,$http){

  $scope.results = {
    template:'./views/results.html'
  }

  // Filter decisions in impact matrix
  $scope.filterResult = function() {
    $scope.csv = d3.csvParse($scope.matrix).filter(function(row) {
      for(s in $scope.filterSelect) {
        if($scope.filterSelect[s] != null && row[s] != $scope.filterSelect[s]) {
          return false;
        }
      }
      return true;
    });
  };

  // Add rows to compare matrix
  $scope.toCompare = [];
  $scope.isChecked = {};

  $scope.checkRow = function(row,index) {
    if($scope.isChecked[index]) {
      $scope.toCompare.push(row);
    } else {
      var index = $scope.toCompare.indexOf(row);
      $scope.toCompare.splice(index,1);
    }
    return;
  };
});
