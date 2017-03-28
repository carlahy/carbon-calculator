var app = angular.module('carbonCalc', ['ui.sortable']);

app.controller('mainController', function(dbService,$scope,$http) {

  $scope.results = {
    template:'./views/results.html'
  }
  // Form view or Code view, init as Form
  $scope.view = {
    type: 'formView',
    template: './views/form-view.html'
  };

  // Keep track of variable names used to avoid duplicates
  $scope.varnames = [];

  // ngModels for input fields
  $scope.input = {
    objective:{},
    decision:'',
    option:''
  };

///////////// Model Name /////////////

  $scope.modelName = '';

  $scope.addModelName = function(name) {
    if(name) {
      if(!includes($scope.varnames,name)) {
          $scope.varnames.push(name);
      }
    }
  };

///////////// Objectives /////////////

  $scope.mode = ['Min','Max']
  $scope.statistics = ['EV', 'Pr','percentile']
  $scope.objectives = [];
  // Objectives[objective]
  // objective = {name,mode,statistic,expression}

  $scope.addObj = function() {
    var o = $scope.input.objective;
    if(o.name) {
      if(!includes($scope.varnames,name)) {
        $scope.objectives.push({
          mode: o.mode,
          name: o.name,
          statistic: o.statistic,
          expression: o.expression
        });
        $scope.varnames.push(o.name);
        if(o.expression) {
          var vars = getVars(o.expression);
          addNewVariables(vars);
        }
      }
    }
    $scope.input.objective = {};
  };

  $scope.deleteObj = function(o) {
    // Remove from objectives
    var index = $scope.objectives.indexOf(o);
    $scope.objectives.splice(index,1);
    // Remove from variables
    index = $scope.varnames.indexOf(o.name);
    $scope.varnames.splice(index,1);
    return;
  };

  $scope.addExpression = function(expression) {
    if(expression) {
      // Parse expression for new variables
      var vars = getVars(expression);
      addNewVariables(vars);
    }
  }

///////////// Variables /////////////

  $scope.variables = [];
  $scope.varoptions = ['Parameter','Equation','Decision'];

  $scope.assignVariable = function(v,option) {
    reassignVariable(v);
    switch (option) {
      case 'Parameter': $scope.parameters.push(v);
        break;
      case 'Equation': $scope.equations.push(v);
        break;
      case 'Decision': $scope.unassignedDecisions.push(v);
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
    // If variable is assigned to a decision
    if (v.decision) {
      // Find decision
      var d = indexOfAttribute($scope.decisions, 'name', v.decision);
      if(d != -1) {
        // Find variable
        index = indexOfAttribute($scope.decisions[d].variables,'name',v.name);
        $scope.decisions[d].variables.splice(index,1);
      }
      delete v.decision;
    }
    // If variable is a decision, but unassigned
    else if ($scope.unassignedDecisions.indexOf(v) != -1) {
      index = $scope.unassignedDecisions.indexOf(v);
      $scope.unassignedDecisions.splice(index,1);
    }
    return;
  }

  $scope.deleteVariable = function (v) {
    // Remove variable from variable list
    var index = $scope.variables.indexOf(v);
    $scope.variables.splice(index,1);
    index = $scope.varnames.indexOf(v.name);
    $scope.varnames.splice(index,1);

    // If assigned to a type, then remove from type list
    if(v.type == 'Parameter') {
      index = $scope.parameters.indexOf(v);
      $scope.parameters.splice(index,1);
    } else if (v.type == 'Equation'){
      index = $scope.equations.indexOf(v);
      $scope.equations.splice(index,1);
    } else if (v.type == 'Decision') {
      if(v.decision) {
        var d = indexOfAttribute($scope.decisions,'name',v.decision);
        index = $scope.decisions[d].variables.indexOf(v);
        $scope.decisions[d].variables.splice(index,1);
      } else {
        var index = $scope.unassignedDecisions.indexOf(v);
        $scope.unassignedDecisions.splice(index,1);
      }
    }
    return;
  }

  // Add new variables to variable list and as variable names
  function addNewVariables(vars){
    for(v in vars) {
      v = vars[v];
      if(!includes($scope.varnames,v)) {
        // Add variable to list
        $scope.varnames.push(v);
        $scope.variables.push({
          name:v
        });
      }
    }
  }

///////////// Parameters /////////////

  $scope.parameters = [];
  $scope.distributions = ['uniform','triangular','normalCI','deterministic'];

  $scope.saveParameter = function(p,value) {
    if(value) {
      p.value = value;
      var vars = getVars(value);
      addNewVariables(vars);
    }
  };

  $scope.deleteParameter = function(p) {
    var index = $scope.parameters.indexOf(p);
    $scope.parameters.splice(index,1);
    index = $scope.varnames.indexOf(p.name);
    $scope.varnames.splice(index,1);
  };

///////////// Equations /////////////

  $scope.equations = [];

  $scope.saveEquation = function(e,expression) {
    if(expression) {
      e.value = expression;
      var vars = getVars(expression);
      addNewVariables(vars);
    }
  };

  $scope.deleteEquation = function(e) {
    var index = $scope.equations.indexOf(e);
    $scope.equations.splice(index,1);
    index = $scope.varnames.indexOf(e.name);
    $scope.varnames.splice(index,1);
  };

  ///////////// Decisions /////////////

  $scope.unassignedDecisions = [];
  $scope.decisions = [];
  // Decisions = [Decision]
  // Decision = {name,options[option],variables[variable]} ]
  // Option = 'option name'
  // Variable {decision,name,options[{name:value}]}

  $scope.addDecision = function(d) {
    if(d) {
      if(indexOfAttribute($scope.decisions,'name',d) == -1) {
        $scope.decisions.push({
          name:d,
          options:[],
          variables:[]
        });
      }
    }
    $scope.input.decision = '';
    return;
  }

  $scope.assignDecision = function (v) {
    // Remove variable from unassigned
    var index = $scope.unassignedDecisions.indexOf(v);
    $scope.unassignedDecisions.splice(index,1);

    // Add variable to decision
    index = indexOfAttribute($scope.decisions,'name',v.decision);
    var decision = $scope.decisions[index];

    // Push variable to decision variables
    v.options = [];
    decision.variables.push(v);

    return;
  };

  // Change the decision name for an existing decision
  $scope.reassignDecision = function(d,name) {
    for(v in d.variables) {
      v = d.variables[v];
      v.decision = name;
    }
    return;
  }

  $scope.deleteDecision = function(d) {
    // Push decision variables to unassigned decisions list
    for(v in d.variables) {
      delete d.variables[v].decision;
      $scope.unassignedDecisions.push(d.variables[v]);
    }
    var index = $scope.decisions.indexOf(d);
    $scope.decisions.splice(index,1);

    return;
  }

  // Add new option for a decision
  $scope.addOption = function(d,option) {
    if(option && d.options.indexOf(option) == -1) {
      d.options.push(option);
    }
    $scope.input.option = '';
  };

  // Parse expression for a decision variable's option assignment
  $scope.saveOptionExpression = function(v,o) {
    if(o == '') {
      var index = v.options.indexOf[o];
      v.options.splice(index,1);
    } else {
      // Parse expression
      var vars = getVars(v.options[o]);
      addNewVariables(vars);
    }
  };

  $scope.deleteOption = function(d,o) {
    var index = d.options.indexOf(o);
    d.options.splice(index,1);
  }

  ///////////// Database /////////////

  // Database ID
  $scope.modelId = dbService.id;

  $scope.uploadWithId = function() {
    if($scope.modelId) {
      dbService.getModel($scope.modelId).then(function(){
        if(dbService.success) {
          var content = dbService.model;
          if (dbService.type == 'form') {
            content = JSON.parse(content);
            for(s in saveScope) {
              $scope[saveScope[s]] = content[saveScope[s]];
            }
          } else {
            var editor = ace.edit('editor');
            editor.setValue(content);
          }
        } else {
          displayError("Could not upload with id");
        }
        return;
      });
    }
    return;
  };

  $scope.idSuccess = false;

  $scope.saveModel = function() {
    var params = {};
    if($scope.view.type == 'formView') {
      params.content = JSON.stringify(getState(saveScope));
      params.type = 'form';
    } else {
      params.content = ace.edit('editor').getValue();
      params.type = 'code';
    }

    if($scope.modelId) {
      // Model already exists in database, update it
      params.id = $scope.modelId;
      dbService.updateModel(params).then(function(){
        $scope.modelId = dbService.id;
        if(!dbService.success){
          displayError("Could update model");
        } else {
          $scope.idSuccess = true;
        }
      });
    } else {
      // Create new entry in database

      dbService.createModel(params).then(function(){
        $scope.modelId = dbService.id;
        if(!dbService.success){
          displayError("Could not retrieve id");
        } else {
          $scope.idSuccess = true;
        }
      });
    }


  };

  ///////////// Code View /////////////

  // Upload the 'Form view' data to editor
  $scope.switchToCode = function() {
    $scope.view = {
      type: 'codeView',
      template: './views/code-view.html'
    }
    return;
  }

  $scope.switchToForm = function () {
    $scope.view = {
      type: 'formView',
      template: './views/form-view.html'
    }
    return;
  }

  $scope.formToCode = function() {
    var content = formatModel();
    var editor = ace.edit('editor');
    editor.setValue(content);
    return;
  }

  ///////////// Model Upload /////////////

  $scope.uploadCode = function(event) {
    var input = document.getElementById('fileinput');
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var content = event.target.result;

      // Set code editor
      var editor = ace.edit('editor');
      editor.setValue(content);
    }
    reader.readAsText(file);
  };

  ///////////////// Form Upload and Restore /////////////////

  // All of the $scope variables needed to save and restore a form view
  var saveScope = ['varnames', 'modelName', 'objectives', 'variables', 'parameters', 'equations', 'decisions'];

  $scope.uploadForm = function(event) {
    var input = document.getElementById('form-to-upload');
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var content = event.target.result;
      content = JSON.parse(content);

      for(s in saveScope) {
        $scope[saveScope[s]] = content[saveScope[s]];
      }
    }
    reader.readAsText(file);
  };

  ///////////// Download Model /////////////

  $scope.downloadModel = function(){

    var dlbtn = document.getElementById("download-btn");
    var content;
    var type;
    var ext;

    if($scope.view.type == 'formView') {

      content = getState(saveScope);
      content = JSON.stringify(content);
      type = 'application/json';
      ext = '.json';

    } else {
      content = ace.edit('editor').getValue();
      type = 'text/plain';
      ext = '.rdr';
    }

    var fileName;

    if($scope.modelName) {
      fileName = $scope.modelName+ext;
    } else {
      fileName = 'undefined'+ext;
    }

    var file = new Blob([content], {type:type});
    dlbtn.href = URL.createObjectURL(file);
    dlbtn.download = fileName;

  };

  // Save state of $scope variables
  function getState(variables) {
    content = {};
    for(v in variables) {
      var name = saveScope[v]
      content[name] = $scope[name];
    }
    return content;
  }

  ///////////// Submit Model /////////////

  $scope.uploadedModel = '';

  $scope.filterable = [];
  $scope.filterSelect = [];
  $scope.csvresult = '';

  $scope.submitOnInvalid = false;
  $scope.submitSuccess = false;

  // Send model to RADAR (server)
  $scope.submitModel = function(isValid, cmdType) {
    if(!isValid) {
        $scope.submitOnInvalid = true;
        return;
    }

    var data = {};
    var content = '';

    if($scope.view.type == 'formView') {
      // Format model data to send
      content = formatModel();
      data = {
        modelName: $scope.modelName,
        modelBody: content,
        command: cmdType
      };
    } else if($scope.view.type == 'codeView') {
      content = ace.edit('editor').getValue();
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

        $scope.submitSuccess = true;

        $scope.csvresult = output.body;
        $scope.filterable = output.decisions;
        // $scope.filterable.push.apply($scope.filterable, output.objectives);
        var csv = d3.csvParse(output.body);
        $scope.csvcolumns = csv.columns;
        // $('#model-result').empty().append(formatTable(csv));
        formatTable(csv);

      } else if(output.type == 'error'){
        $scope.filterable = [];
        $('#model-result').empty().append(formatError(output.body));

      } else if(output.type == 'success'){
        $scope.submitSuccess = true;
      }
    }, function errorCallback(res){
      $('#model-result').empty().append(formatError('Error in model response'));
    });
    $scope.submitSuccess = false;
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
    // Push columns back into filtered data
    data.columns = $scope.csvcolumns;

    // Update table in view
    $('#model-result').empty().append(formatTable(data));

    // TODO: Update graph in view
    // formatGraph(data);
  };

});
