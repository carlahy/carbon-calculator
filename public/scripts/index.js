$(document).ready(function() {

  // Init Ace editor
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/tomorrow");
  editor.getSession().setMode("ace/mode/java");
  editor.setOptions({
        autoScrollEditorIntoView: true,
        maxLines: Infinity
    });
  editor.renderer.setScrollMargin(10, 10, 10, 10);
  editor.$blockScrolling = Infinity;

  // Toggle build and upload views
  $('.codeView').hide();

  $('#btnForm').click(function() {
    $('.codeView').hide();
    $('.formView').show();
  });

  $('#btnCode').click(function (){
    $('.formView').hide();
    $('.codeView').show();
  });

  /////////// Toggle Views ///////////

  $("#btn-objectives").click(function(){
    $("#objectives").toggle(200);
  });

  $("#btn-parameters").click(function(){
    $("#parameters").toggle(200);
  });

  $("#btn-equations").click(function(){
    $("#equations").toggle(200);
  });

  $("#btn-decisions").click(function(){
    $("#decisions").toggle(200);
  });

  $("#btn-variables").click(function(){
    $("#variables").toggle(200);
  });

});

/*
The following are helper functions for the angular
controller located in app.js
*/


function includes(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function indexOfAttribute(array,attrName, attrValue) {
  for(o in array) {
    var obj = array[o];
    if (obj[attrName] == attrValue) {
      return o;
    }
  }
  return -1;
}

function getVars(eq) {
  var vars = eq.split(/\+|\-|\/|\*|\(|\)|,/);
  var i = vars.length
  while(i--) {
    v = vars[i].trim();
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

/////////////////// Formatting ///////////////////


function formatGraph(csv) {

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

  // Adds the svg canvas
  var svg = d3.select("#model_graph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    // Get the data
    var data = d3.csvParse(csv, function(row){

      console.log(row);

      // Add the scatterplot
      // svg.selectAll("dot")
      //     .data(data)
      //   .enter().append("circle")
      //     .attr("r", 3.5)
      //     .attr("cx", function(d) { return x(d.date); })
      //     .attr("cy", function(d) { return y(d.close); });
      //
      // // Add the X Axis
      // svg.append("g")
      //     .attr("class", "x axis")
      //     .attr("transform", "translate(0," + height + ")")
      //     .call(xAxis);
      //
      // // Add the Y Axis
      // svg.append("g")
      //     .attr("class", "y axis")
      //     .call(yAxis);

    });

}

// Format CSV file to HTML table
function formatTable(csv) {

  var table = '<table class="table">';
  // Column names
  table += '<thead class="thead-inverse"><tr>';
  for(c in csv.columns) {
    table += '<th>'+csv.columns[c]+'</th>';
  }
  table += '</tr></thead><tbody>';

  csv = csv.splice(0,csv.length)
  for(r in csv){
    table += '<tr>';
    for(c in csv[r]) {
      table += '<td>'+csv[r][c]+'</td>';
    }
    table += '</tr>';
  }
  table += '</tbody></table>';
  return table;
}

// Format error into HTML
function formatError(error) {
  var errmsg = '';
  var rows = error.split('\n');
  rows.forEach(function getValues(row) {
    errmsg += '<p>'+row+'</p>';
  });
  return errmsg;
}
