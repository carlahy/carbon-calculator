var app = angular.module('carbonCalc', []);

app.controller('mainController', function($scope) {

  var eol = ';\n'

  // Keep track of variable names used to avoid duplicates
  var varNames = [];

  $scope.addModelName = function(name) {
    if(name) {
      // name = cleanVar(name);
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
      // name = cleanVar(name);
      if(!includes(varNames,name)) {
        $scope.objectives.push({
          minmax: minmax,
          name: name
        });
        varNames.push(name);
        console.log(varNames);
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

  $scope.saveParamVal = function (param, value) {
    if(value) {
      // TODO: Parse
      param.value = value;
      var pValue = getParams(value);
      for(p in pValue) {
        p = pValue[p];
        if(!includes(varNames,p)) {
          varNames.push(p);
          $scope.params.push({
            name:p
          });
        }
      }
    } else {
      console.log('Parameter value cannot be empty');
    }
  };

  // TODO: is probability distribution?

  $scope.delParamVal = function (param) {
    var index = $scope.params.indexOf(param,1);
    $scope.params.splice(index,1);
    index = varNames.indexOf(param.name);
    varNames.splice(index,1);
  };

///////////// Equations /////////////

  $scope.currentEq = '';
  $scope.newEq = '';
  $scope.params = [];

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
            name: p
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
          console.log(varNames);
          $scope.params.push({
            name: p
          });
        }
      }
      console.log(obj);
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
      policies: []
    });
  };

  $scope.savePolicy = function(decision, policy, policyValue) {
    if(policy && policyValue) {
      policy.value = policyValue;
      console.log(decision);
    }
  };

  $scope.addPolicy = function(decision,policyName,policyValue) {
    if(policyName) {
      // TODO: check for value here? Potentially add later?
      if(policyValue) {
        decision['policies'].push({
          name:policyName,
          value:policyValue
        });
      } else {
        decision['policies'].push({
          name:policyName
        });
      }
    } else {
      console.log('Policy cannot be empty');
    }

  };

  $scope.isParam = function(decision) {
    var index = $scope.decisions.indexOf(decision);
    $scope.decisions.splice(index,1);
    $scope.params.push({
      name:decision.name
    });
  };

  //Format model when submitting

  $scope.formatObj = function () {
    objs = $scope.objectives;
    result = '';
    for(i in objs) {
      obj = objs[i];
      result += 'Objective ' + obj.minmax + ' ENB'+obj.name+' = EV(NBenefit'+obj.name+')'+eol;
      result += 'NBenefit' + obj.name + ' = New'+obj.name+ ' - Current'+obj.name+eol
    }
    console.log(result);
  };

  // Send model to RADAR (server)
  $scope.submitModel = function() {
    console.log('Model Submission triggered');
    console.log(result);
  }

});

function includes(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

// Does array contain object with attribute equal to

function includesAttr(arr,attr,val) {
    for(a in arr) {
      a = arr[a];
      if(a[attr] == val) {
        return true;
      }
    }
    return false;
}

// function cleanVar(mvar) {
//   // Remove all white spaces
//   mvar = mvar.replace(/ /g,"");
//   // Replace all non alphanumeric characters with _
//   mvar = mvar.replace(/[^a-zA-Z 0-9]+/g,"_");
//   // Remove leading digits
//   mvar = mvar.replace(/^\d+/,"");
//   if(mvar == "") {
//     console.log('Variable name cannot be empty');
//   }
//   return mvar;
// }

function getParams(eq) {
  var params = eq.split(/\+|\-|\/|\*|\(|\)/);
  var p = params.length
  while(p--) {
    if(!isNaN(params[p])){
      params.splice(p,1);
    }
  }
  return params;
}

// function isDistribution(param) {
//   return True;
// }

// TODO: is a probability distribution
function isValidVar(mvar) {
  if ($.isNumeric(mvar) || mvar == "") {
    return false;
  }
  return true;
}
