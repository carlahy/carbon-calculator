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

function formatDGraph(dgraph) {
  return $('#dgraph').empty().append(Viz(dgraph, { format: "png-image-element" }));
}

function formatVGraph(vgraph) {
  return $('#vgraph').empty().append(Viz(vgraph, { format: "png-image-element" }));
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
