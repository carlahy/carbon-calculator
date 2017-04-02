angular.module('carbonCalc').controller('dbController', function($scope, Service,Helper){


    $scope.orgName = Service.orgName;
    $scope.orgId = Service.orgId;

    $scope.orgLogin = function() {
      if($scope.orgName) {
        Service.getOrg($scope.orgName).then(function(){
          if(Service.success) {
            $scope.orgId = Service.orgId;
            displaySuccess('Successfully logged in to '+ $scope.orgName);
          } else {
            $scope.orgId = null;
            displayWarning('Could not log in to ', $scope.orgName);
          }
        });
      }
    }

  // Database ID
  $scope.modelId = Service.id;

  $scope.uploadWithId = function() {
    if(!$scope.orgId){
      return Helper.displayWarning("Please log in to organisation");
    }
    if($scope.modelId) {
      Service.getModel($scope.orgId,$scope.modelId).then(function(){
        if(Service.success) {
          var content = Service.model;
          if (Service.type == 'form') {
            content = JSON.parse(content);
            for(s in saveScope) {
              $scope[saveScope[s]] = content[saveScope[s]];
            }
          } else {
            var editor = ace.edit('editor');
            editor.setValue(content);
          }
        } else {
          displayWarning("Could not upload with id");
        }
      });
    }
    return;
  };

  var saveScope = ['varnames', 'modelName', 'objectives', 'variables', 'parameters', 'equations', 'unassignedDecisions','decisions'];

  $scope.uploadFile = function(event) {
    var input = document.getElementById('file-to-upload');
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var content = event.target.result;
      if($scope.view.type == 'formView') {
        content = JSON.parse(content);
        for(s in saveScope) {
          $scope[saveScope[s]] = content[saveScope[s]];
        }
      } else {
        var editor = ace.edit('editor');
        editor.setValue(content);
      }
    }
    return reader.readAsText(file);
  };

  function displayWarning(message) {
    $scope.dialog.success = false;
    $scope.dialog.warning = true;
    $scope.dialog.message = message;
    return;
  }

  function displaySuccess(message) {
    $scope.dialog.warning = false;
    $scope.dialog.success = true;
    $scope.dialog.message = message;
    return;
  }


});
