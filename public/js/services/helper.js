angular
  .module('carbonCalc')
  .factory('Helper', function() {
    'use strict';

    var helper = {};

    // Is object in array
    helper.includes = function(arr,obj) {
        return (arr.indexOf(obj) != -1);
    }

    // Is object with attribute in array
    helper.indexOfAttribute = function(array,attrName, attrValue) {
      for(o in array) {
        var obj = array[o];
        if (obj[attrName] == attrValue) {
          return o;
        }
      }
      return -1;
    }

    // Parse an expression and find new variables
    helper.getVars = function(eq) {
      var vars = eq.split(/\+|\-|\/|\*|\(|\)|,|<|>/);
      var i = vars.length
      while(i--) {
        var v = vars[i].trim();
        // Is numerical, probability distribution, empty
        if($.isNumeric(v[0]) || $.isNumeric(v) ||
            v == 'triangular' || v == 'normalCI' || v == 'uniform' ||
            v == 'deterministic' || v == ""){
              vars.splice(i,1);
        }
        else {
          vars[i] = v;
        }
      }
      return vars;
    }

    // Set parameters for HTTP call
    helper.getParams = function(_viewType,_modelName) {
      var params = {};
      var content = '';

      if(_viewType == 'formView') {
        content = this.formatModel(); //TODO
        params = {
          modelName:_modelName,
          modelContent: content,
        };
      } else {
        content = ace.edit('editor').getValue();
        // Seach for model name
        var lines = content.split('\n');
        for(var l in lines) {
          var line = lines[l].split(' ');
          if(line[0].trim() == 'Model') {
            _modelName = line[1].trim().split(';')[0];
            break;
          }
        }
        params = {
          modelName: _modelName,
          modelContent: content,
        };
      }
      return params;
    }


    /////////////////// Formatting ///////////////////

    helper.formatModel = function(){
      var eol = ';\n';
      var result = '';

      // Format model name
      result += 'Model '+ $scope.modelName + eol;

      // Format objectives
      result += '\n//Objectives\n\n';
      for(i in $scope.objectives) {
        var obj = $scope.objectives[i];
        result += 'Objective '+obj.mode+' '+obj.name+' = '+obj.statistic+'('+obj.expression+')'+eol;
      }

      // Format parameters
      result += '\n//Parameters\n\n';
      for(i in $scope.parameters) {
        var param = $scope.parameters[i];
        result +=  param.name+' = '+param.distribution+'('+param.value+')'+eol;
      }

      // Format equations
      result += '\n//Equations\n\n';
      for(i in $scope.equations) {
        var eq = $scope.equations[i];
        result += eq.name + ' = ' + eq.value + eol;
      }

      // Format decisions
      result += '\n//Decisions\n\n';
      for(d in $scope.decisions) {
        var d = $scope.decisions[d];
        for(v in d.variables) {
          v = d.variables[v];
          result += v.name+' = decision("'+v.decision+'") {\n';
          for(o in v.options) {
            result += '\t"'+o+'": '+v.options[o]+eol;
          }
          result += '}\n\n';
        }
      }
      return result;
    }


    helper.formatDGraph = function(dgraph) {
      return $('#dgraph').empty().append(Viz(dgraph, { format: "png-image-element" }));
    }

    helper.formatVGraph = function(vgraph) {
      return $('#vgraph').empty().append(Viz(vgraph, { format: "png-image-element" }));
    }

    return helper;

  });
