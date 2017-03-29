angular
  .module('carbonCalc')
  .factory('Service', function ($http, $q) {
    'use strict';

    var service = {};

    service.getOrg = function(_name){
      return $http({
        method:'GET',
        url:'/organisations',
        params: {name:_name}
      }).then(function success(res){
        service.orgId = res.data.id;
        handleSuccess();
      }, handleError);
    };

    service.getModel = function(_orgId,_modelId) {
      return $http({
        method:'GET',
        url:'/models',
        params: {
          orgId:_orgId,
          modelId:_modelId
        }
      }).then(function success(res){
        handleSuccess();
        service.model = res.data.model;
        service.type = res.data.type;
      }, handleError);
    };

    service.createModel = function(params) {
      return $http.post('/models',{
        orgId: params.orgId,
        content: params.content,
        type: params.type
      }).then(function success(res){
        handleSuccess();
        service.id = res.data.id;
      }, handleError);
    };

    service.updateModel = function(params) {
      return $http.put('/models',{
        orgId: params.orgId,
        modelId: params.modelId,
        content: params.content,
        type: params.type
      }).then(function success(res){
        service.id = res.data.id;
        handleSuccess();
      }, handleError);
    };

    service.deleteModel = function() {

    };

    service.parseModel = function(params) {
      return $http.post('/parse', params).then(function success(res){
        service.success = res.data.success;
        service.message = res.data.message;
      },handleError);
    };

    service.solveModel = function(params) {
      return $http.post('/solve',params).then(function success(res){
        service.res = res.data;
        handleSuccess();
      }, function error(res){
        service.message = res.message;
        handleError();
      });
    }

    return service;

    function handleSuccess() {
      return service.success = true;
    }

    function handleError(res) {
      service.success = false;
      return $q.reject(res.data);
    }

});
