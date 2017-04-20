angular.module('carbonCalc').controller('mainController', function(Service,Helper,$scope,$http) {


///////////// View Handlers /////////////

  $scope.toggle = function(id) {
    angular.element(document).find(id).toggle(200);
  }

  $scope.view = {
    type: 'formView',
    template: './views/form-view.html'
  };

  $scope.input = {
    objective:{},
    decision:'',
    option:''
  };

  $scope.varnames = [];

  // All of the $scope variables needed to save and restore a form view
  var saveScope = ['varnames', 'modelName', 'objectives', 'variables', 'parameters', 'equations', 'unassignedDecisions','decisions'];

///////////// Model Name /////////////

  $scope.addModelName = function(name) {
    $scope.modelName = name;
    if(name) {
      if(!Helper.includes($scope.varnames,name)) {
          $scope.varnames.push(name);
      }
    }
    return;
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
      if(!Helper.includes($scope.varnames,name)) {
        $scope.objectives.push({
          mode: o.mode,
          name: o.name,
          statistic: o.statistic,
          expression: o.expression
        });
        $scope.varnames.push(o.name);
        if(o.expression) {
          var vars = Helper.getVars(o.expression);
          addNewVariables(vars);
        }
      }
    }
    $scope.input.objective = {};
  };

  $scope.deleteObj = function(o) {
    var index = $scope.objectives.indexOf(o);
    $scope.objectives.splice(index,1);
    index = $scope.varnames.indexOf(o.name);
    $scope.varnames.splice(index,1);
    return;
  };

  $scope.addExpression = function(expression) {
    if(expression) {
      var vars = Helper.getVars(expression);
      addNewVariables(vars);
    }
  }

///////////// Variables /////////////

  $scope.variables = [];
  $scope.varoptions = ['Parameter','Equation','Decision'];

  $scope.assignVariable = function(v,option) {
    reassignVariable(v);
    v.assigned = true;
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
      var d = Helper.indexOfAttribute($scope.decisions, 'name', v.decision);
      if(d != -1) {
        // Find variable
        index = Helper.indexOfAttribute($scope.decisions[d].variables,'name',v.name);
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

    // If declared as a type, then remove from type
    if(v.type == 'Parameter') {
      index = $scope.parameters.indexOf(v);
      $scope.parameters.splice(index,1);
    } else if (v.type == 'Equation'){
      index = $scope.equations.indexOf(v);
      $scope.equations.splice(index,1);
    } else if (v.type == 'Decision') {
      if(v.decision) {
        var d = Helper.indexOfAttribute($scope.decisions,'name',v.decision);
        index = $scope.decisions[d].variables.indexOf(v);
        $scope.decisions[d].variables.splice(index,1);
      } else {
        var index = $scope.unassignedDecisions.indexOf(v);
        $scope.unassignedDecisions.splice(index,1);
      }
    }
    return;
  }

  function addNewVariables(vars){
    for(v in vars) {
      v = vars[v];
      if(!Helper.includes($scope.varnames,v)) {
        // Add variable to list
        $scope.varnames.push(v);
        $scope.variables.push({
          name:v,
          assigned:false
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
      var vars = Helper.getVars(value);
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
      var vars = Helper.getVars(expression);
      addNewVariables(vars);
    }
  };

  $scope.deleteEquation = function(e) {
    var index = $scope.equations.indexOf(e);
    $scope.equations.splice(index,1);
    index = $scope.varnames.indexOf(e.name);
    return $scope.varnames.splice(index,1);
  };

  ///////////// Decisions /////////////

  $scope.unassignedDecisions = [];
  $scope.decisions = [];
  // Decisions = [Decision]
  // Decision = {name,options[option],variables[variable]} ]
  // Option = 'option name'
  // Variable {decision,name,options[{name:value}]}

  $scope.addDecision = function(d) {
    if(d && Helper.indexOfAttribute($scope.decisions,'name',d) == -1) {
      $scope.decisions.push({
        name:d,
        options:[],
        variables:[]
      });
    }
    return $scope.input.decision = '';
  }

  $scope.assignDecision = function (v) {
    // Remove variable from unassigned
    var index = $scope.unassignedDecisions.indexOf(v);
    $scope.unassignedDecisions.splice(index,1);
    // Add variable to decision
    index = Helper.indexOfAttribute($scope.decisions,'name',v.decision);
    var decision = $scope.decisions[index];
    // Push variable to decision variables
    v.options = [];
    return decision.variables.push(v);
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
    return $scope.decisions.splice(index,1);
  }

  // Add new option for a decision
  $scope.addOption = function(d,option) {
    if(option && d.options.indexOf(option) == -1) {
      d.options.push(option);
    }
    return $scope.input.option = '';
  };

  // Parse expression for a decision variable's option assignment
  $scope.saveOptionExpression = function(v,o) {
    if(o == '') {
      var index = v.options.indexOf[o];
      v.options.splice(index,1);
    } else {
      // Parse expression
      var vars = Helper.getVars(v.options[o]);
      addNewVariables(vars);
    }
    return;
  };

  $scope.deleteOption = function(d,o) {
    var index = d.options.indexOf(o);
    return d.options.splice(index,1);
  }

  $scope.saveModel = function() {
    if(!$scope.orgId) {
      return displayWarning('Please log in to organisation');
    }

    var params = {};

    if($scope.view.type == 'formView') {
      params.content = JSON.stringify(getState(saveScope));
      params.type = 'form';
    } else {
      params.content = ace.edit('editor').getValue();
      params.type = 'code';
    }

    params.orgId = $scope.orgId;

    if($scope.modelId) {
      // Model already exists in database, update it
      params.modelId = $scope.modelId;

      Service.updateModel(params).then(function(){
        if(!Service.success){
          return displayWarning('Could not get shareable id');
        } else {
          $scope.modelId = Service.id;
          return displaySuccess('Shareable id is ' + $scope.modelId);
        }
      });

    } else {
      // Create new entry in database
      Service.createModel(params).then(function(){
        if(!Service.success){
          return displayWarning('Could not get shareable id');
        } else {
          $scope.modelId = Service.id;
          return displaySuccess('Shareable id is ' + $scope.modelId);
        }
      });
    }
  };

///////////// Code View /////////////

  // Upload the 'Form view' data to editor
  $scope.switchToCode = function() {
    console.log('Hello');
    return $scope.view = {
      type: 'codeView',
      template: './views/code-view.html'
    }
  }

  $scope.switchToForm = function () {
    console.log('World');
    return $scope.view = {
      type: 'formView',
      template: './views/form-view.html'
    }
  }

  // Load the model from form to code view
  $scope.formToCode = function() {
    var content = Helper.formatModel();
    var editor = ace.edit('editor');
    return editor.setValue(content);
  }

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

  ///////////// Dialog /////////////

  $scope.dialog = {};

  function displayWarning(message) {
    $scope.dialog.success = false;
    $scope.dialog.warning = true;
    $scope.dialog.message = message;
    return;
  }

  function displaySuccess(message) {
    $scope.dialog.warning = false;
    $scope.dialog.success = true;
    $scope.dialog.message = message;
    return;
  }

  ///////////// Parse and Solve Model /////////////

  $scope.uploadedModel = '';

  $scope.filterable = [];
  $scope.filterSelect = [];
  $scope.matrix = '';

  // Send model to RADAR (server)
  $scope.parseModel = function(isValid) {
    if(!isValid) {
      return displayWarning('Model is not valid!');
    }

    var params = Helper.getParams($scope.view.type,$scope.modelName);

    Service.parseModel(params).then(function() {
      if(Service.success) {
        return displaySuccess(Service.message);
      } else {
        $scope.filterable = [];
        return displayWarning('Model could not bef parsed: \n'+ Service.message);
      }
    });
  }

  $scope.solveModel = function(isValid) {
    if(!isValid) {
      return displayWarning('Model is not valid!');
    }

    var params = Helper.getParams($scope.view.type,$scope.modelName);

    Service.solveModel(params).then(function(){
      if(Service.success) {
        $scope.matrix = Service.res.matrix;
        $scope.dgraph = Service.res.dgraph;
        $scope.vgraph = Service.res.vgraph;
        $scope.filterable = Service.res.decisions;

        $scope.csv = d3.csvParse($scope.matrix);
        $scope.csvcols = ['Choose'].concat($scope.csv.columns);

        Helper.formatDGraph($scope.dgraph);
        Helper.formatVGraph($scope.vgraph);

        return displaySuccess('Model was successfully solved');

      } else {
        $scope.filterable = [];
        return displayWarning('There was an error solving the model: ' + Service.message)
      }
    });
  };

});
