$(document).ready(function() {

  // Toggle build and upload views
  $('.codeView').hide();

  $('#btn-form').click(function() {
    $('.codeView').hide();
    $('.formView').show();
  });

  $('#btn-code').click(function (){
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

  $("#btn-variables").click(function(){
    $("#variables").toggle(200);
  });

  $("#btn-result").click(function(){
    $("#table-result table tr:gt(5)").hide();
  });

  $('.row-filter').click(function() {

  })

  // Filter result table rows
  $('#model-result tr').filter(':has(:checkbox:checked)').each(function() {
      console.log('hello');
        // this = tr
        $tr = $(this);
        console.log($tr);
        //get row values
        $('#model-compare').append(this);
    });

});

/*
The following are helper functions for the angular
controller in app.js
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
  var vars = eq.split(/\+|\-|\/|\*|\(|\)|,|<|>/);
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

function displayError(mess) {
  return console.log(mess);
}

// Format CSV file to HTML table
function formatTable(csv) {

  $('#model-result').empty();

  var table = d3.select('#model-result').append('table').attr('class','table').attr('id','table-result');
  var thead = table.append('thead').attr('class','thead-inverse');
  var tbody = table.append('tbody');

  var columns = csv.columns;

  thead.append('tr').selectAll('th')
    .data(columns)
    .enter()
      .append('th')
      .text(function (d) { return d });

  csv = csv.splice(0,csv.length);

  var rows = tbody.selectAll('tr')
    .data(csv)
    .enter()
      .append('tr');

  var cells = rows.selectAll('td')
    .data(function(row){
      return columns.map(function(column) {
        return {column:column, value:row[column]}
      })
    })
    .enter()
      .append('td')
      .text(function (d) { return d.value});

  $('#model-result tr').each(function() {
    $(this).children('td').first()
      .prepend('<input type="checkbox" class="result-compare"/>');
  });

  return table;
}

function formatDGraph(dgraph) {
  return $('#dgraph').append(Viz(dgraph, { format: "png-image-element" }));
}

function formatVGraph(vgraph) {
  return $('#vgraph').append(Viz(vgraph, { format: "png-image-element" }));
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
