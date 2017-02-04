var app = angular.module('carbonCalc', []);

app.controller('mainController', function($scope,$http) {

///////////// Model Upload /////////////

$scope.modelUpload = function(event) {
  var input = document.getElementById('fileinput');
  var file = input.files[0];
  var reader = new FileReader();

  reader.onload = function(event) {
    var content = event.target.result;
    console.log(content);

    document.getElementById('modeluploadtext').value = content;

    // var lines = content.split('\n');
    // lines.forEach(function(line) {
    //   var args = line.split(' ');
    //
    //   if(args[0] == 'Objective') {
    //     $scope.addObj(args[1],args[2]);
    //
    //   } else if (args[0].substring(0,7) == 'Current') {
    //     var name = args[0].substring(7);
    //     var obj = objWithAttr($scope.objectives,'name',name);
    //     obj.currentEq = line.split('=')[1];
    //     console.log($scope.objectives);
    //   } else if (args[0].substring(0,3) == 'New') {
    //
    //   } else if (args[1] == '=') {
    //
    //   }
    //   $scope.$apply();
    // });


  }
  reader.readAsText(file);
}

  // Keep track of variable names used to avoid duplicates
  var varNames = [];

///////////// Model Name /////////////

  $scope.addModelName = function(name) {
    if(name) {
      if(!includes(varNames,name)) {
          varNames.push(name);
      } else {
        // TODO: warning
      }
    } else {
      console.log('Model Name cannot be empty');
    }
  };

///////////// Objectives /////////////

  $scope.objectives = [];
  $scope.objOption = ['Min', 'Max'];

  $scope.addObj = function(minmax, name) {
    if(name) {
      if(name.substring(0,3) != 'ENB') {
        var oname = 'ENB'+name;
      } else {
        var oname = name;
        name = name.substring(3);
      }
      if(!includes(varNames,name)) {
        $scope.objectives.push({
          minmax: minmax,
          name: name,
          oname: oname
        });
        varNames.push(name);
      } else {
        // TODO: Alert warning, duplicate names
      }
    } else {
      console.log('Input cannot be empty');
    }
  };

  $scope.delObj = function(obj) {
    var index = $scope.objectives.indexOf(obj);
    $scope.objectives.splice(index,1);
    index = varNames.indexOf(obj.name);
    varNames.splice(index,1);
  };

///////////// Parameters /////////////

  $scope.params = [];

  $scope.saveParamVal = function (param, value) {
    if(value) {
      param.value = value;
      // Add new parameters if any
      var pValue = getParams(value);
      for(p in pValue) {
        p = pValue[p];
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name:p,
            value:''
          });
        }
      }
    } else {
      console.log('Parameter value cannot be empty');
    }
  };

  // TODO: is probability distribution?

  $scope.delParamVal = function (param) {
    var index = $scope.params.indexOf(param);
    $scope.params.splice(index,1);
    index = varNames.indexOf(param.name);
    varNames.splice(index,1);
  };

///////////// Equations /////////////

  $scope.saveCurrentEq = function(obj,eq) {
    if(eq) {
      //TODO: update eq with correct param names (split, join)
      obj['currentEq'] = eq;
      var params = getParams(eq);
      for(p in params) {
        p = params[p];
        // p = cleanVar(p);
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name: p,
            value:''
          });
        }
      }
    } else {
      console.log('Current eq cannot be empty');
    }
  };

  $scope.saveNewEq = function(obj,eq) {
    if(eq) {
      //TODO: update eq with correct param names (split, join)
      obj['newEq'] = eq;
      var params = getParams(eq);
      for(p in params) {
        p = params[p];
        // p = cleanVar(p);
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name: p,
            value:''
          });
        }
      }
    } else {
      console.log('New eq cannot be empty');
    }

  };

  ///////////// Decisions /////////////

  $scope.decisions = [];

  $scope.isDecision = function(param) {
    var index = $scope.params.indexOf(param);
    $scope.params.splice(index,1);
    $scope.decisions.push({
      name: param.name,
      label: '',
      policies: []
    });
  };

  $scope.saveDecLabel = function(decision, label) {
    decision.label = label;
    console.log(decision);
  }

  $scope.savePolicy = function(decision, policy, policyValue) {
    if(policy && policyValue) {
      policy.value = policyValue;
      // TODO: in getParams, have a special case for probabilities
      var params = getParams(policyValue);
      for(p in params) {
        p = params[p];
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name:p
          });
        }
      }
    } else {
      console.log('Policy name and value cannot be empty');
    }
  };

  $scope.addPolicy = function(decision,policyName,policyValue) {
    if(policyName) {
      // Parse parameters of value, check for new variables
      var params = getParams(policyValue);
      for(p in params) {
        p = params[p];
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name: p
          });
        }
      }
      // Set new policy object {name,value}
      var found = false;
      for(p in decision.policies) {
        // Policy already created
        if (decision.policies[p].name == policyName) {
          found = true;
          decision.policies[p].value = policyValue;
          break;
        }
      }
      if(found == false) {
        decision.policies.push({
          name:policyName,
          value:policyValue
        });
      }
    } else {
      console.log('Policy cannot be empty');
    }

  };

  $scope.delPolicy = function(decision,policy) {
    var index = decision.policies.indexOf(policy);
    decision.policies.splice(index,1);
  }

  $scope.isParam = function(decision) {
    var index = $scope.decisions.indexOf(decision);
    $scope.decisions.splice(index,1);
    $scope.params.push({
      name:decision.name,
      value:decision.value
    });
  };

  ///////////// Submit Model /////////////

  $scope.submitOnInvalid = true;
  // Send model to RADAR (server)
  $scope.submitModel = function(isValid, modelCommand) {

    if(!isValid) {
        $scope.submitOnInvalid = false;
        return;
    }
    $scope.submitOnInvalid = true;

    var result = formatModel();

    console.log(result);

    var data = {
      modelName: $scope.modelName,
      modelBody: result
    };

    if(modelCommand == 'solve') {
      data.modelCommand = 'solve';
    } else if (modelCommand == 'parse') {
      data.modelCommand = 'parse';
    }

    $http({
      method: 'POST',
      url:'/submitModel',
      data:data
    }).then(function successCallback(res){
      var output = res.data;
      if(output.type == 'csvresult') {
        $('#model_result').empty().append(formatResult(output.body,output.type));
      } else if(output.type == 'error'){
        $('#model_result').empty().append(formatResult(output.body,output.type));
      }
    }, function errorCallback(res){
      alert('Error in model response');
    });

    return result;
  }

  $scope.saveModel = function() {
    var result = formatModel();
    console.log(result);
    return result;
  }

  function formatModel(){
    var eol = ';\n';
    var result = '';

    // Format model name
    result += 'Model '+ $scope.modelName + eol;

    // Format objectives
    result += '\n//Objectives\n\n';
    for(i in $scope.objectives) {
      var obj = $scope.objectives[i];
      result += 'Objective ' + obj.minmax + ' ENB'+obj.name+' = EV(NBenefit'+obj.name+')'+eol;
      result += 'NBenefit' + obj.name + ' = New'+obj.name+ ' - Current'+obj.name+eol
    }

    // Format parameters
    result += '\n//Parameters\n\n';
    for(i in $scope.params) {
      var param = $scope.params[i];
      result +=  param.name + ' = ' + param.value + eol;
    }

    // Format equations
    result += '\n//Equations\n\n';
    for(i in $scope.objectives) {
      var obj = $scope.objectives[i];
      result += 'Current'+ obj.name + ' = ' + obj.currentEq + eol;
      result += 'New'+ obj.name + ' = ' + obj.newEq + eol;
    }

    // Format decisions
    result += '\n//Decisions\n\n';
    for(i in $scope.decisions) {
      var dec = $scope.decisions[i];
      result += dec.name + ' = decision("Policy type") {\n';
      for(j in dec.policies) {
        p = dec.policies[j];
        result += '\t"'+ p.name +'": ' + p.value + eol;
      }
      result += '}\n\n'
    }
    return result;
  }

});

function formatResult(result,type) {
  switch (type) {
    case 'csvresult':
      var table = '<table class="table">';
      // Split lines
      var rows = result.split('\n');
      // Split cells
      rows.forEach(function getValues(row){
        table += '<tr>';
        var columns = row.split(',');
        columns.forEach(function getValue(column){
          table += '<td>'+column+'</td>';
        });
        table += '</tr>';
      });
      table += '</table>';
      return table;

    case 'error':
      var errmsg = '';
      var rows = result.split('\n');
      rows.forEach(function getValues(row) {
        errmsg += '<p>'+row+'</p>';
      });
      return errmsg;
    default: break;

  }

}

function includes(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function objWithAttr(array,attrName, attrValue) {
  for(o in array) {
    var obj = array[o];
    if (obj[attrName] == attrValue) {
      return obj;
    }
  }
  return;
}

function getParams(eq) {
  var params = eq.split(/\+|\-|\/|\*|\(|\)|,/);
  var p = params.length
  while(p--) {
    param = params[p].trim();
    // Is numerical, probability distribution, empty
    if($.isNumeric(param[0]) || $.isNumeric(param) ||
        param == 'triangular' || param == 'normalCI' || param == 'uniform' ||
        param == 'deterministic' || param == ""){
          params.splice(p,1);
    }
    else {
      params[p] = param;
    }
  }
  return params;
}
