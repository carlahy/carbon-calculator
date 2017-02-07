var app = angular.module('carbonCalc', []);

app.controller('mainController', function($scope,$http) {

///////////// Model Upload /////////////

  $scope.uploadModel = function(event) {
    var input = document.getElementById('fileinput');
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var content = event.target.result;

      // Set code editor
      var editor = ace.edit("editor");
      editor.setValue(content);

      // Seach for model name
      var lines = content.split('\n');
      for(l in lines) {
        var line = lines[l].split(' ');
        if(line[0].trim() == 'Model') {
          $scope.modelName = line[1].trim().split(';')[0];
          break;
        }
      }
    }
    reader.readAsText(file);
  };

  // Keep track of variable names used to avoid duplicates
  var varNames = [];

  // Init scope variables
  $scope.uploadedModel = '';

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

  $scope.outputdecisions = [];
  $scope.filterSelect = {};
  $scope.csvresult = '';

  $scope.submitOnInvalid = true;
  // Send model to RADAR (server)
  $scope.submitModel = function(isValid, modelType) {

    if(!isValid) {
        $scope.submitOnInvalid = false;
        return;
    }
    // Reset validation
    $scope.submitOnInvalid = true;
    var data = {};
    var content = '';

    if(modelType == 'build') {
      // Format model data to send
      content = formatModel();
      data = {
        modelName: $scope.modelName,
        modelBody: content,
        modelCommand: 'solve'
      };

    } else if(modelType == 'upload') {
        content = ace.edit("editor").getValue();
        data = {
          modelName: $scope.modelName,
          modelBody: content,
          modelCommand: 'solve'
        };
    }

    // Send to server
    $http({
      method: 'POST',
      url:'/submit',
      data:data
    }).then(function successCallback(res){
      var output = res.data;
      if(output.type == 'csvresult') {
        $scope.csvresult = output.body;
        $scope.outputdecisions = output.decisions;
        var csv = d3.csvParse(output.body);
        $('#model_result').empty().append(formatTable(csv));
      } else if(output.type == 'error'){
        $('#model_result').empty().append(formatError(output.body));
      }
    }, function errorCallback(res){
      alert('Error in model response');
    });

    return content;
  }

  $scope.saveModel = function(modelType) {
    var content = '';
    if(modelType == 'build') {
      content = formatModel();
    } else if (modelType == 'upload') {
      content = ace.edit("editor").getValue();
    }

    var fileName = $scope.modelName+'.rdr';

    var data = {
      fileName: fileName,
      content: content
    };

    $http({
      method: 'POST',
      url:'/save',
      data:data
    }).then(function successCallback(res){

    }, function errorCallback(res){

    });

    return content;
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

  ///////////// Handle Output /////////////

  $scope.filterOutput = function() {
    console.log($scope.filterSelect);

    // Update table
    var data = d3.csvParse($scope.csvresult).filter(function(row) {
      for(s in $scope.filterSelect) {
        if($scope.filterSelect[s] != null && row[s] != $scope.filterSelect[s]) {
          return false;
        }
      }
      return true;
    });
    console.log('Filtered = ', data);
    // Update table in view
    $('#model_result').empty().append(formatTable(data));

    // TODO: Update graph in view
    // formatGraph(data);
  };

});
