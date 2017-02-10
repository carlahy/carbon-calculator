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
    console.log(csv.columns[c]);
    table += '<th>'+csv.columns[c]+'</th>';
  }
  table += '</tr></thead><tbody>';

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

// Forrmat error into HTML
function formatError(error) {
  console.log('Error >> ',error);
  var errmsg = '';
  var rows = error.split('\n');
  rows.forEach(function getValues(row) {
    errmsg += '<p>'+row+'</p>';
  });
  return errmsg;
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
