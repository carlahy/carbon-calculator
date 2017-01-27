
$( document ).ready(function() {

  // Trigger click event on press enter
  $("#obj_name").keyup(function(event){
    if(event.keyCode == 13){
        $("#obj_add").click();
    }
  });

  $("#param_val").keyup(function(event){
    if(event.keyCode == 13){
        $("#param_save").click();
    }
  });

  $("#current_eq").keyup(function(event){
    console.log('hello1');
    if(event.keyCode == 13){
      console.log('world1');
        $("#current_eq_save").click();
    }
  });

  $("#new_eq").keyup(function(event){
    if(event.keyCode == 13){
        $("#new_eq_save").click();
    }
  });



});


// Submit model to RADAR

function submitSolve() {
  $('#solve').submit(function(e) {
    e.preventDefault();

    modelObjectives = formatObj();
    modelEquations = formatEq();

    var data = {
      name: $('#modelName'),
      objectives: modelObjectives,
      parameters: $('#modelParams'),
      equations: modelEquations,
      decisions: $('#modelDecisions')
    };

    $.post('/solve', data, function(res) {
      // alert(res);
    });
  });
};
