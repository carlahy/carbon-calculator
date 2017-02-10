var app = angular.module('carbonCalc', []);

app.controller('mainController', function($scope,$http) {

  // Keep track of variable names used to avoid duplicates
  var varnames = [];

///////////// Model Name /////////////

$scope.modelName = '';

  $scope.addModelName = function(name) {
    if(name) {
      if(!includes(varnames,name)) {
          varnames.push(name);
      } else {
        // TODO: warning, duplicate
      }
    } else {
      console.log('Model Name cannot be empty');
    }
  };

///////////// Objectives /////////////

  $scope.objectives = [];

  $scope.addObj = function(name) {
    if(name) {
      if(!includes(varnames,name)) {
        $scope.objectives.push({
          name: name,
          enb: 'EV(NB'+name+')',
          lp: 'Pr(NB'+name+'<0)',
          nb: ''
        });
        varnames.push(name,'ENB'+name, 'LP'+name, 'NB'+name);
      } else {
        // TODO: Alert warning, duplicate names
      }
    } else {
      console.log('Input cannot be empty');
    }
    $scope.inputobj = '';
  };

  $scope.delObj = function(o) {
    var index = $scope.objectives.indexOf(o);
    $scope.objectives.splice(index,1);
    index = varnames.indexOf(o.name);
    varnames.splice(index,1);
    index = varnames.indexOf('ENB'+obj.name);
    varnames.splice(index,1);
    index = varnames.indexOf('LP'+obj.name);
    varnames.splice(index,1);
    index = varnames.indexOf('NB'+obj.name);
    varnames.splice(index,1);
  };

  $scope.addNB = function(o,value) {
    if(value) {
      o.nb = value;
      var vars = getVars(value);
      for(v in vars) {
        v = vars[v];
        if(!includes(varnames,v)) {
          varnames.push(v);
          $scope.variables.push(v);
        }
      }
    } else {
      console.log('NB Value cannot be empty');
    }
  }

///////////// Variables /////////////

  // The uninitialised vars that are yet to be defined as parameters or decisions
  $scope.variables = [];
  $scope.varoptions = ['Parameter','Equation','Decision'];

  $scope.varSelect = function(v,option) {
    var index = $scope.variables.indexOf(v);
    $scope.variables.splice(index,1);
    $scope[option].push({
      name:v
    });

  }

///////////// Parameters /////////////

  $scope.parameters = [];

  $scope.saveParameter = function(p,value) {
    if(value) {
      p.value = value;
      var vars = getVars(value);
      for(v in vars) {
        p = pValue[p];
        if(!includes(varnames,v)) {
          varnames.push(p);
          $scope.varnames.push(v);
        }
      }
    } else {
      console.log('Parameter value cannot be empty');
    }
  };

  $scope.delParameter = function(p) {
    var index = $scope.parameters.indexOf(p);
    $scope.parameters.splice(index,1);
    index = varnames.indexOf(p.name);
    varnames.splice(index,1);
  };

///////////// Equations /////////////

  $scope.equations = [];

  $scope.saveEquation = function(e,value) {
    if(value) {
      e.value = value;
      var vars = getVars(value);
      for(v in vars) {
        v = vars[v];
        if(!includes(varnames,v)) {
          varnames.push(v);
          $scope.variables.push(v);
        }
      }
    } else {
      console.log('Equation cannot be empty');
    }
  };

  $scope.delEquation = function(e) {
    var index = $scope.equations.indexOf(e);
    $scope.equations.splice(index,1);
    index = varnames.indexOf(e.name);
    varnames.splice(index,1);
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
      // TODO: in getVars, have a special case for probabilities
      var params = getVars(policyValue);
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
      var params = getVars(policyValue);
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
    $scope.newPolicyName = '';
    $scope.newPolicyValue = '';

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
      }
      reader.readAsText(file);
    };

  ///////////// Submit Model /////////////
  $scope.uploadedModel = '';

  $scope.filterable = [];
  $scope.filterSelect = {};
  $scope.csvresult = '';

  $scope.submitOnInvalid = true;
  $scope.successParse = false;
  // Send model to RADAR (server)
  $scope.submitModel = function(isValid, modelType, cmdType) {

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
        command: cmdType
      };
    } else if(modelType == 'upload') {
      content = ace.edit("editor").getValue();
      // Seach for model name
      var lines = content.split('\n');
      for(l in lines) {
        var line = lines[l].split(' ');
        if(line[0].trim() == 'Model') {
          $scope.modelName = line[1].trim().split(';')[0];
          break;
        }
      }
      data = {
        modelName: $scope.modelName,
        modelBody: content,
        command: cmdType
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
        $scope.filterable = output.decisions;
        // $scope.filterable.push.apply($scope.filterable, output.objectives);
        var csv = d3.csvParse(output.body);
        $('#model_result').empty().append(formatTable(csv));

      } else if(output.type == 'error'){
        $scope.filterable = [];
        $('#model_result').empty().append(formatError(output.body));
      } else if(output.type == 'success'){
        $scope.successParse = true;
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
    // Update table
    var data = d3.csvParse($scope.csvresult).filter(function(row) {
      for(s in $scope.filterSelect) {
        if($scope.filterSelect[s] != null && row[s] != $scope.filterSelect[s]) {
          return false;
        }
      }
      return true;
    });
    // Update table in view
    $('#model_result').empty().append(formatTable(data));

    // TODO: Update graph in view
    // formatGraph(data);
  };

});
