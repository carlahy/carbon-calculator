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
          lp: 'Pr(NB'+name+' < 0)',
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

  $scope.deleteObj = function(o) {
    var index = $scope.objectives.indexOf(o);
    $scope.objectives.splice(index,1);
    index = varnames.indexOf(o.name);
    varnames.splice(index,1);
    index = varnames.indexOf('ENB'+o.name);
    varnames.splice(index,1);
    index = varnames.indexOf('LP'+o.name);
    varnames.splice(index,1);
    index = varnames.indexOf('NB'+o.name);
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
          $scope.variables.push({
            name:v
          });
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
  $scope.varselect;

  $scope.assignVariable = function(v,option) {
    reassignVariable(v);
    switch (option) {
      case 'Parameter': $scope.parameters.push(v);
        break;
      case 'Equation': $scope.equations.push(v);
        break;
      case 'Decision': $scope.decisions.push({
          name:v.name,
          decision:'',
          options:[]
        });
        break;
      default:
        break;
    }
  }

  // Remove variable from inappropriate type assignment so it is not duplicated
  function reassignVariable(v) {
    var index = $scope.parameters.indexOf(v);
    if(index != -1) {
      $scope.parameters.splice(index,1);
      return;
    }
    index = $scope.equations.indexOf(v);
    if(index != -1) {
      $scope.equations.splice(index,1);
      return;
    }
    index = indexOfAttribute($scope.decisions, 'name', v.name);
    if(index != -1) {
      $scope.decisions.splice(index,1);
      return;
    }
    return;
  }

  // Remove variable from its type
  $scope.deleteVariable = function (v) {
    var index = $scope.variables.indexOf(v);
    $scope.variables.splice(index,1);
    index = varnames.indexOf(v.name);
    varnames.splice(index,1);

    if(v.type == 'Parameter') {
      index = $scope.parameters.indexOf(v);
      $scope.parameters.splice(index,1);
    } else if (v.type == 'Equation'){
      index = $scope.equations.indexOf(v);
      $scope.equations.splice(index,1);
    } else if (v.type == 'Decision') {
      index = $scope.decisions.indexOf(v);
      $scope.decisions.splice(index,1);
    }
    // Else, variabel was unassigned
    return;
  }

///////////// Parameters /////////////

  $scope.parameters = [];

  $scope.saveParameter = function(p,value) {
    if(value) {
      p.value = value;
      var vars = getVars(value);
      for(v in vars) {
        v = vars[v];
        if(!includes(varnames,v)) {
          varnames.push(v);
          $scope.variables.push({
            name:v
          });
        }
      }
    } else {
      console.log('Parameter value cannot be empty');
    }
  };

  $scope.deleteParameter = function(p) {
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
        console.log(v);
        if(!includes(varnames,v)) {
          console.log('not includes');
          varnames.push(v);
          $scope.variables.push({
            name:v
          });
        }
      }
    } else {
      console.log('Equation cannot be empty');
    }
  };

  $scope.deleteEquation = function(e) {
    var index = $scope.equations.indexOf(e);
    $scope.equations.splice(index,1);
    index = varnames.indexOf(e.name);
    varnames.splice(index,1);
  };

  ///////////// Decisions /////////////

  $scope.decisions = [];
// Decision {name,decision,options:{option:value}}

  $scope.saveOption = function(d,oname) {
    if(oname) {
      d.options.push({
        name:oname,
        value:''
      });
    }
    // Reset variable values
    $scope.oname = null;
    $scope.ovalue = null;
  };

  $scope.saveOptionValue = function(d, option, value) {
    if(!option) {
      console.log('Option must have a name');
    } else if(option && value) {
      // Find the option
      var index = indexOfAttribute(d.options,'name',option);
      // Set the value
      d.options[index].value = value;
      // TODO: in getVars, have a special case for probabilities
      var params = getVars(value);
      for(p in params) {
        p = params[p];
        if(!includes(varnames,p)) {
          varnames.push(p);
          $scope.variables.push({
            name:p
          });
        }
      }
    } else {
      console.log('Option name and value cannot be empty');
    }
    // Reset variable values
    $scope.oname = null;
    $scope.ovalue = null;
  };

  $scope.deleteOption = function(d,o) {
    var index = d.options.indexOf(o);
    d.options.splice(index,1);
  }

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

    if(modelType == 'formView') {
      // Format model data to send
      content = formatModel();
      data = {
        modelName: $scope.modelName,
        modelBody: content,
        command: cmdType
      };
    } else if(modelType == 'codeView') {
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
      result += 'Objective Max ENB'+obj.name+' = '+ obj.enb +eol;
      result += 'Objective Min LP'+obj.name+' = '+ obj.lp +eol;
      result += 'NB' + obj.name + ' = '+ obj.nb +eol;
    }

    // Format parameters
    result += '\n//Parameters\n\n';
    for(i in $scope.parameters) {
      var param = $scope.parameters[i];
      result +=  param.name + ' = ' + param.value + eol;
    }

    // Format equations
    result += '\n//Equations\n\n';
    for(i in $scope.equations) {
      var eq = $scope.equations[i];
      result += eq.name + ' = ' + eq.value + eol;
    }

    // Format decisions
    result += '\n//Decisions\n\n';
    for(i in $scope.decisions) {
      var d = $scope.decisions[i];
      result += d.name + ' = decision("' + d.decision + '") {\n';
      for(j in d.options) {
        o = d.options[j];
        result += '\t"'+ o.name +'": ' + o.value + eol;
      }
      result += '}\n\n'
    }
    console.log(result);
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
