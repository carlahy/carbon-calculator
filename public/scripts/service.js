angular
  .module('carbonCalc')
  .factory('dbService', function ($http, $q) {
    'use strict';

    var service = {};

    service.getModel = function(_id) {
      return $http({
        method:'GET',
        url:'/models',
        params: {id:_id}
      }).then(function success(res){
        handleSuccess();
        service.model = JSON.parse(res.data.model);
      }, handleError);
    };

    service.createModel = function(_model) {
      return $http.post('/models',{model:_model}).then(function success(res){
        handleSuccess();
        service.id = res.data.id;
      }, handleError);
    };

    service.updateModel = function(_id,_model) {
      return $http.put('/models',{id:_id,model:_model}).then(function success(res){
        service.id = res.data.id;
        handleSuccess();
      }, handleError);
    };

    service.deleteModel = function() {

    };

    return service;

    function handleSuccess() {
      return service.success = true;
    }

    function handleError(res) {
      service.success = false;
      return $q.reject(res.data);
    }

});
