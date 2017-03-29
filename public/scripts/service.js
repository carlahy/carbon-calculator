angular
  .module('carbonCalc')
  .factory('Service', function ($http, $q) {
    'use strict';

    var service = {};

    service.getModel = function(_id) {
      return $http({
        method:'GET',
        url:'/models',
        params: {id:_id}
      }).then(function success(res){
        handleSuccess();
        service.model = res.data.model;
        service.type = res.data.type;
      }, handleError);
    };

    service.createModel = function(params) {
      return $http.post('/models',{
        content: params.content,
        type: params.type
      }).then(function success(res){
        handleSuccess();
        service.id = res.data.id;
      }, handleError);
    };

    service.updateModel = function(params) {
      return $http.put('/models',{
        id: params.id,
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
