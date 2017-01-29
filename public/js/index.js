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
